using Carpooling_Microservice.Models;
using Carpooling_Microservice.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Carpooling_Microservice.DbConfig;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using Newtonsoft.Json;
using Auth_Microservice.Dtos;
using Carpooling_Microservice.Dtos;
using Carpooling_Microservice.NotificationsConfig;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Test4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]


    public class RequestRideController : ControllerBase
    {
        private readonly IRequestRideRepository _repository;
        private readonly CarpoolingContext _context;
        private HttpClient _client;
        private readonly PushApiClient _pushApiClient;


        public RequestRideController(IRequestRideRepository reposiotory, CarpoolingContext context, HttpClient client)
        {
            _repository = reposiotory;
            _context = context;
            _client = client;
            _pushApiClient = new PushApiClient();

        }


        // POST api/<RequestRideController>
        [HttpPost]
        public ActionResult<RequestRide> Post([FromBody] RequestRide model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            // Check if the passenger has already sent a request ride for the given trip
            var existingRequest = _repository.GetRequestRideByUserAndTrip(model.PassengerId, model.TripId);
            if (existingRequest != null)
            {
                return Conflict("passenger has already sent a request ride for this trip.");
            }

            var result = _repository.createRequestRide(model);
            _repository.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = result.RequestRideId }, result);
        }



        // GET: api/<RequestRideController>
        [HttpGet]
        public ActionResult<IEnumerable<RequestRide>> Get()
        {
            var result = _repository.GetRequestRides();
            return Ok(result);
        }


        // GET api/<RequestRideController>/5
        [HttpGet("{id}")]
        public ActionResult<RequestRide> Get(int id)
        {
            var result = _repository.GetRequestRide(id);
            if (result != null)
            {
                return Ok(result);

            }
            return NotFound();
        }
        private async Task<UserDto> GetUserFromUserMicroservice(int userId)
        {
            var response = await _client.GetAsync($"https://localhost:7031/api/User/{userId}");
            if (response.IsSuccessStatusCode)
            {
                var userResponse = await response.Content.ReadAsStringAsync();
                var user = JsonConvert.DeserializeObject<UserDto>(userResponse);


                return user;
            }

            return null;
        }


        // GET Request ride par DriverId 

        [HttpGet("requests/{DriverId}")]
        public async Task<ActionResult<IEnumerable<RequestRide>>> GetRequestRideByUser(int DriverId)
        {
            var requestRides = await _context.RequestsRides.Include(rr => rr.Trip).Where(t => t.DriverId == DriverId&&t.Status=="Pending").ToListAsync();

            var requestRidesWithTrip = requestRides.Select(rr => new
            {
                rr.RequestRideId,
                rr.RequestDate,
                rr.Status,
                rr.Trip.Source,
                rr.Trip.Destination,
                rr.PassengerId,
                rr.DriverId,
                
            });

            var requestsWithUsers = new List<object>();

            foreach (var requestRide in requestRidesWithTrip)
            {
                var passenger = await GetUserFromUserMicroservice(requestRide.PassengerId);
                var driver = await GetUserFromUserMicroservice(requestRide.DriverId);

                var requestWithUser = new
                {
                    RequestRideId = requestRide.RequestRideId,
                    RequestDate = requestRide.RequestDate,
                    Status = requestRide.Status,
                    Source = requestRide.Source,
                    Destination = requestRide.Destination,
                    PassengerId = requestRide.PassengerId,
                    DriverId = requestRide.DriverId,
                    Driver = driver,
                    Passenger = passenger
                };

                requestsWithUsers.Add(requestWithUser);
            }

            return Ok(requestsWithUsers);
        }

        [HttpGet("{requestRideId}/CheckDeadlineCancel")]
        public IActionResult CheckDeadlineForCancelRequestRide(int requestRideId)
        {
            var requestRide = _context.RequestsRides
                .Include(r => r.Trip)
                .SingleOrDefault(r => r.RequestRideId == requestRideId);
            if (requestRide == null)
            {
                return NotFound();
            }
            TimeSpan departureTime = (TimeSpan)requestRide.Trip.DepartureTime;
            TimeSpan currentTime = DateTime.Now.TimeOfDay;
            TimeSpan cancelTime = departureTime.Subtract(TimeSpan.FromMinutes(15));

            if (currentTime >= cancelTime)
            {
                return Conflict("Cancellation is not allowed after the cancellation deadline.");
            }
   
            return Ok("Reservation cancelled succesfully");
        }

        [HttpPut("{requestRideId}/cancel")]
        public async Task<IActionResult> CancelRequestRideAsync(int requestRideId)
        {
            var requestRide = _context.RequestsRides
                .Include(r => r.Trip)
                .SingleOrDefault(r => r.RequestRideId == requestRideId);

            TimeSpan departureTime = (TimeSpan)requestRide.Trip.DepartureTime;
            TimeSpan currentTime = DateTime.Now.TimeOfDay;
            TimeSpan cancelTime = departureTime.Subtract(TimeSpan.FromMinutes(15));

            if (currentTime >= cancelTime)
            {
                try
                {
                    requestRide.Status = "CANCELLED";
                    requestRide.TripStatus = "CANCELLED";
                    requestRide.Trip.AvailableSeats--;
                    var userId = requestRide.PassengerId;
                    var pointsToDeduct = 100; 
                    var updatePointsUrl = $"https://localhost:7031/api/User/users/{userId}/points";
                    var payload = JsonConvert.SerializeObject(pointsToDeduct);
                    using (var httpClient = new HttpClient())
                    {
                        var content = new StringContent(payload, Encoding.UTF8, "application/json");
                        var response = await httpClient.PutAsync(updatePointsUrl, content);

                        if (!response.IsSuccessStatusCode)
                        {
                            return BadRequest("Error calling update points method from user microservice0");
                        }
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest("Error calling update points method from user microservice1");

                }
            }
            else
            {
                requestRide.Status = "CANCELLED";
                requestRide.TripStatus = "CANCELLED";
                requestRide.Trip.AvailableSeats--;
            }

            _context.SaveChanges();
            return Ok("Reservation cancelled succesfully");
        }


        [HttpPut("requests/{requestRideId}/status")]
        public async Task<ActionResult<RequestRide>> UpdateRequestRideStatus(int requestRideId, [FromBody] UpdateRequestRideStatusDto requestData)
        {
            var requestRide = await _context.RequestsRides.FindAsync(requestRideId);

            if (requestRide == null)
            {
                return NotFound();
            }
            if (requestData.status == "Accepted")
            {
                var trip = await _context.Trips.FindAsync(requestRide.TripId);
                    trip.AvailableSeats--;
                    await _context.SaveChangesAsync();
                requestRide.TripStatus = "UPCOMING";
                //Sendnotification
                string message = $"Trip from {requestRide.Trip.Source} to {requestRide.Trip.Destination} is confirmed ";
                SendPushNotification(requestData.deviceToken,"Ride request accepted", message);

            }
            else if (requestData.status == "Declined")
            {
                //Sendnotification
                string message = $"Trip from {requestRide.Trip.Source} to {requestRide.Trip.Destination} is declined ";
                SendPushNotification(requestData.deviceToken, "Ride request declined", message);

            }
            else if (requestData.status == "Booked")
            {
                requestRide.TripStatus = "STARTED";
            }
            // Update the status property
            requestRide.Status = requestData.status;
           
            await _context.SaveChangesAsync();

            return Ok(requestRide);
        }

        [HttpPost("send-push-notification")]
        public async Task<IActionResult> SendPushNotification(string Devicetoken,string title,string message)
        {
            // Create the push ticket request
            var pushTicketReq = new PushTicketRequest()
            {
                PushTo = new List<string>() { Devicetoken },
                PushBadgeCount = 7,
                PushTitle = title,
                PushBody = message,
                PushSound = "default",
                PushData = new Dictionary<string, object>()
                    {
                        { "screen", "main" }, 
                    },
            };

            try
            {
                // Send the push notification
                var result = await _pushApiClient.PushSendAsync(pushTicketReq);

                if (result?.PushTicketErrors?.Count() > 0)
                {
                    // Handle errors if any
                    foreach (var error in result.PushTicketErrors)
                    {
                        Console.WriteLine($"Error: {error.ErrorCode} - {error.ErrorMessage}");
                    }
                }

                // Return a success response
                return Ok("Push notification sent successfully.");
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the push notification sending process
                return BadRequest($"Failed to send push notification: {ex.Message}");
            }
        }


        // DELETE api/<RequestRideController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _repository.deleteRequestRide(id);
            _repository.SaveChanges();
        }


        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] RequestRide model)
        {
            _repository.Update(model,id);
            return Ok(model);
        }

        [HttpGet("generate")]
        public IActionResult GenerateQRCode(string driverId, string tripId)
        {
            var data = new
            {
                DriverId = driverId,
                TripId = tripId
            };

            string jsonData = JsonConvert.SerializeObject(data);

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(jsonData, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);

            Bitmap qrCodeImage = qrCode.GetGraphic(20);
            using (MemoryStream stream = new MemoryStream())
            {
                qrCodeImage.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                byte[] qrCodeBytes = stream.ToArray();
                return File(qrCodeBytes, "image/png");
            }
        }

    }
}
