using Carpooling_Microservice.Models;
using Carpooling_Microservice.Data;
using Carpooling_Microservice.DbConfig;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;
using Azure;
using System.IO;
using Newtonsoft.Json;

using RestSharp;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Auth_Microservice.Dtos;
using Carpooling_Microservice.Dtos;
using Carpooling_Microservice.NotificationsConfig;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Test4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly ITripRepository _repository;
        private readonly CarpoolingContext _context;
        private HttpClient _client;
        private readonly PushApiClient _pushApiClient;

        public TripController(ITripRepository reposiotory, CarpoolingContext context, HttpClient client)
        {
            _repository = reposiotory;
            _context = context;
            _client = client;
            _pushApiClient = new PushApiClient();
        }

        [HttpPost("send-push-notification")]
        public async Task<IActionResult> SendPushNotification(string Devicetoken, string title, string message)
        {
            var pushTicketReq = new PushTicketRequest()
            {
                PushTo = new List<string>() { Devicetoken },
                PushBadgeCount = 7,
                PushTitle = title,
                PushBody = message,
                PushSound = "default",
                PushData = new Dictionary<string, object>()
                    {
                        { "screen", "requestRidesList" },
                    },
            };

            try
            {   var result = await _pushApiClient.PushSendAsync(pushTicketReq);
                if (result?.PushTicketErrors?.Count() > 0)
                {
                    foreach (var error in result.PushTicketErrors)
                    {
                        Console.WriteLine($"Error: {error.ErrorCode} - {error.ErrorMessage}");
                    }
                }
                return Ok("Push notification sent successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to send push notification: {ex.Message}");
            }
        }


        private async Task<UserDto> GetUserFromUserMicroservice(int userId)
        {
            var response = await _client.GetAsync($"https://localhost:7031/api/User/{userId}");
            if (response.IsSuccessStatusCode)
            {
                var userResponse = await  response.Content.ReadAsStringAsync();
                var user = JsonConvert.DeserializeObject<UserDto>(userResponse);


                return user;
            }

            return null;
        }



        // POST api/<TripController>
        [HttpPost("addTrip")]
        public async Task<IActionResult> Post([FromBody] Trip model)
        {
            if (model == null)
            {
                return BadRequest();
            }

           var user = await GetUserFromUserMicroservice(model.UserId);
           if (user == null)
            {
               return BadRequest("Invalid UserId");
           }
      
            TimeSpan time1 = TimeSpan.Parse(model.DepartureTimeInput);

            model.DepartureTime = time1;

            DateTime startDate = model.AvailableDates.Min(d => d.Date);
            DateTime endDate = model.AvailableDates.Max(d => d.Date);

            // set the start and end dates
            model.DateDebut = startDate;
            model.DateFin = endDate;

            if (model.AvailableDates.Count > 1) {
                model.Type = "Regular";
            }
            else if(model.AvailableDates.Count == 1) {
                model.Type = "Occasional";
            }

            var result = _repository.createTrip(model);

            _repository.SaveChanges();
            var tripWithUser = new
            {
                Trip = result,
                User = user
            };
            return Ok(tripWithUser);
        }



        // GET: api/<TripController>
        [HttpGet("all")]
        public ActionResult<IEnumerable<Trip>> Get()
        {
            var result = _repository.GetTrips();
            return Ok(result);
        }


        // GET api/<TripController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetAsync(int id)
        {
            var availableTrips = await _context.Trips.Include(t => t.AvailableDates).FirstOrDefaultAsync(t => t.TripId == id);
            if (availableTrips != null)
            {
                return Ok(availableTrips);
            }
            return NotFound();
        }


        // DELETE api/<TripController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _repository.deleteTrip(id);
            _repository.SaveChanges();
        }


        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Trip model)
        {
            _repository.Update(model,id);
            return Ok(model);
        }

        //CHECK IF THE PASSENGER HAS ALDREADY SENT A REQUEST FOR A SPECIFIC TRIP
        [HttpGet("{tripId}/users/{passengerId}/check-request")]
        public async Task<ActionResult<bool>> CheckRequestExists(int tripId, int passengerId)
        {
            var requestExists = await _context.RequestsRides
                .AnyAsync(rr => rr.TripId == tripId && rr.PassengerId == passengerId);

            return Ok(requestExists);
        }



        //AJOUT REQUEST FI TRIP
        [HttpPost("{tripId}/request-rides")]
        public async Task<ActionResult<RequestRide>> CreateRequestRide(int tripId, [FromBody] RequestRide requestRide)
        {
            var trip = await _context.Trips.FindAsync(tripId);

            if (trip == null)
            {
                return NotFound();
            }
            var existingRequest = await _context.RequestsRides
              .FirstOrDefaultAsync(rr => rr.TripId == tripId && rr.PassengerId == requestRide.PassengerId);

            if (existingRequest != null)
            {
                return Conflict("User has already sent a request ride for this trip.");
            }

            requestRide.RequestDate = DateTime.Now;
            requestRide.Trip = trip;
            _context.RequestsRides.Add(requestRide);
            var user = await GetUserFromUserMicroservice(requestRide.DriverId);
            //Sendnotification
            string message = "You received a new ride request ";
            SendPushNotification(user.DeviceToken, "New ride request", message);
            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        //AFFICHAGE DES REQUESTS POUR UN TRIP
        [HttpGet("trips/{tripId}/requests")]
        public ActionResult<IEnumerable<RequestRide>> GetRequestsForTrip(int tripId)
        {
            var trip = _context.Trips.Find(tripId);

            if (trip == null)
            {
                return NotFound();
            }

            var requests = _context.RequestsRides.Where(r => r.TripId == tripId).ToList();

            return Ok(requests);
        }


        // TRAJAA LES TRIPS et requestId ACCEPTEE et booked POUR UN PASSENGER eli bech ykounou fel home
        [HttpGet("passengers/{passengerId}/trips/accepted")]
        public async Task<IActionResult> GetAcceptedTripsForPassenger(int passengerId)
        {
            var acceptedTrips = await _context.RequestsRides
                .Include(rr => rr.Trip)
                .Where(rr => rr.PassengerId == passengerId && (rr.Status == "Accepted" || rr.Status == "Booked"||rr.Status == "Cancelled"))
                .Select(rr => new { Trip = rr.Trip, RequestId = rr.RequestRideId, TripStatus = rr.TripStatus, UserId = rr.Trip.UserId })
                .OrderBy(rr => rr.Trip.DepartureTime)
                .ToListAsync();

            var tripWithUsers = new List<object>();

            foreach (var acceptedTrip in acceptedTrips)
            {
                var user = await GetUserFromUserMicroservice(acceptedTrip.UserId);
                var tripWithUser = new
                {
                    Trip = acceptedTrip.Trip,
                    RequestId = acceptedTrip.RequestId,
                    TripStatus=acceptedTrip.TripStatus,
                    UserId = acceptedTrip.UserId,
                    CreatedBy = user
                };

                tripWithUsers.Add(tripWithUser);
            }

            return Ok(tripWithUsers);
        }

        // TRAJAA LES TRIPS ELI AAMALHOM (creation) UN USER (driver) fel home
        [HttpGet("user/{userId}/trips")]
        public ActionResult<IEnumerable<Trip>> GetTripsForUser(int userId)
        {
            var trips = _context.Trips.Where(t => t.UserId == userId)
                .Include(t => t.AvailableDates).ToList();
            return Ok(trips);
        }



        // TRAJAA LES TRIPS BOOKED POUR UN PASSENGER
        [HttpGet("passengers/{passengerId}/trips/booked")]
        public async Task<IActionResult> GetBookedTripsForPassenger(int passengerId)
        {
            var acceptedTrips = await _context.RequestsRides
                .Include(rr => rr.Trip)
                .Where(rr => rr.PassengerId == passengerId && rr.Status == "Booked")
                .Select(rr => rr.Trip)
                .ToListAsync();

            return Ok(acceptedTrips);
        }



        [HttpGet("driver/{userId}/createdtripsWithPassengerCount")]
        public ActionResult<IEnumerable<TripWithPassengerCountDto>> GetCreatedTripsForDriverWithPassengerCount(int userId)
        {
            var trips = _context.Trips
                .Include(t => t.RequestRides)
                .Where(t => t.UserId == userId)
                .ToList();

            var tripList = new List<TripWithPassengerCountDto>();

            foreach (var trip in trips)
            {
                var tripData = new TripWithPassengerCountDto
                {
                    Trip = trip,
                    PassengerCount = trip.RequestRides.Count(rr => rr.Status == "Booked")
                };

                tripList.Add(tripData);
            }

            return Ok(tripList);
        }





        // AFFICHER LES TRIPS BETWEEN TWO DATES WE WILL ADD DESTINATION AND NBSEATS AKBER MEN 
        [HttpGet]
        [Route("trips/available-on-date")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsAvailableOnDate(DateTime selectedDate)
        {
            var allTrips = _context.Trips
            .Where(t =>  t.AvailableDates.Any(d => d.Date == selectedDate))
            .Include(t => t.AvailableDates)
            .ToList();
            return Ok(allTrips);

        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterTripsAsync(double userPickupLatitude, double userPickupLongitude, double userDropLatitude, double userDropLongitude, int range, DateTime selectedDate,string type)
        {
            List<Trip> allTrips = new List<Trip>();
            double proximityThreshold=0;
           // var allTrips = _context.Trips.Where(t => t.AvailableSeats > 0&t.UserId!=userId).ToList();

            if (type == "All")
            {
                 allTrips = _context.Trips
                      .Where(t => t.AvailableSeats > 0 && t.AvailableDates.Any(d => d.Date == selectedDate))
                      .Include(t => t.AvailableDates)
                      .ToList();

            }
            else if (type =="Regular" || type == "Occasional")
            {
                allTrips = _context.Trips.Where(t => t.AvailableSeats > 0 && t.AvailableDates.Any(d => d.Date == selectedDate) && t.Type == type)
                        .Include(t => t.AvailableDates)
                        .ToList();
            }
      

            if (range==0)
            {
                 proximityThreshold = 1;
            }
            else if(range != 0)
            {
                proximityThreshold = range;
            }

            var relevantTrips = new List<TripWithUser>();

            foreach (var trip in allTrips)
            {
                var tripPickupCoordinates = (trip.PickupLatitude, trip.PickupLongitude);
                var tripDropCoordinates = (trip.DropLatitude, trip.DropLongitude);

                var isWithinProximity = await IsTripWithinProximity(
                    (userPickupLatitude, userPickupLongitude),
                    (userDropLatitude, userDropLongitude),
                    tripPickupCoordinates,
                    tripDropCoordinates,
                    proximityThreshold);

                if (isWithinProximity)
                {
                    var user = await GetUserFromUserMicroservice(trip.UserId);
                    relevantTrips.Add(new TripWithUser
                    {
                        Trip = trip,
                        User = user
                    });
                }
            }

            return Ok(relevantTrips.OrderBy(t => t.Trip.DepartureTime));
        }

        private async Task<bool> IsTripWithinProximity(
            (double Latitude, double Longitude) userPickupCoordinates,
            (double Latitude, double Longitude) userDropCoordinates,
            (double Latitude, double Longitude) tripPickupCoordinates,
            (double Latitude, double Longitude) tripDropCoordinates,
             double proximityThreshold)
                {
                    double pickupDistance = await CalculateDistance(userPickupCoordinates, tripPickupCoordinates);
                    double dropDistance = await CalculateDistance(userDropCoordinates, tripDropCoordinates);
                    return pickupDistance <= proximityThreshold && dropDistance <= proximityThreshold;
                }

        private async Task<double> CalculateDistance(
        (double Latitude, double Longitude) point1,
        (double Latitude, double Longitude) point2)
        {
            string apiKey = "fad74474846544cfa2e35a5f60a3b11e";
            string apiUrl = $"https://api.geoapify.com/v1/routing?waypoints={point1.Latitude.ToString(CultureInfo.InvariantCulture)}," +
                $"{point1.Longitude.ToString(CultureInfo.InvariantCulture)}|{point2.Latitude.ToString(CultureInfo.InvariantCulture)}," +
                $"{point2.Longitude.ToString(CultureInfo.InvariantCulture)}&mode=drive&apiKey={apiKey}";

            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var result = JObject.Parse(content);
                    var distanceInMeters = (double)result["features"][0]["properties"]["distance"];
                    double distanceInKilometers = distanceInMeters / 1000;

                    return distanceInKilometers;
                }
                else
                {
                   
                    throw new Exception("Failed to calculate distance. API request failed.");
                }
            }
        }

        //ay method nheboha tkoun validé b token hedha kifeh:
        [HttpGet("currentUser")]
        [Authorize]
        public IActionResult GetCurrentUserApi()
        {
        

            return Ok(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        }






    }
}
