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

        public TripController(ITripRepository reposiotory, CarpoolingContext context, HttpClient client)
        {
            _repository = reposiotory;
            _context = context;
            _client = client;

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
        [HttpPost]
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


            string timeString = model.DepartureTimeInput;

            // Use regular expression to extract hour, minute, and AM/PM indicator
            Match match = Regex.Match(timeString, @"(\d+):(\d+)\s+([AP]M)", RegexOptions.IgnoreCase);
            if (!match.Success)
            {
                Console.WriteLine("Invalid time format");
                
            }

            int hour = int.Parse(match.Groups[1].Value);
            int minute = int.Parse(match.Groups[2].Value);
            string amPmIndicator = match.Groups[3].Value;

            if (hour == 12)
            {
                // Convert 12-hour format to 24-hour format for PM times
                if (amPmIndicator.Equals("PM", StringComparison.OrdinalIgnoreCase))
                {
                    hour = 12;
                }
                // Convert 12-hour format to 24-hour format for AM times
                else if (amPmIndicator.Equals("AM", StringComparison.OrdinalIgnoreCase))
                {
                    hour = 0;
                }
            }
            else if (amPmIndicator.Equals("PM", StringComparison.OrdinalIgnoreCase))
            {
                // Convert PM times to 24-hour format by adding 12 to the hour
                hour += 12;
            }

            TimeSpan time = new TimeSpan(hour, minute, 0);

            model.DepartureTime = time;


            DateTime startDate = model.AvailableDates.Min(d => d.Date);
            DateTime endDate = model.AvailableDates.Max(d => d.Date);


            // set the start and end dates
            model.DateDebut = startDate;
            model.DateFin = endDate;

            var result = _repository.createTrip(model);
            //or hedhi  var result = _repository.createTrip(trip);

            _repository.SaveChanges();
            var tripWithUser = new
            {
                Trip = result,
                User = user
            };
            return Ok(tripWithUser);
        }



        // GET: api/<TripController>
        [HttpGet]
        public ActionResult<IEnumerable<Trip>> Get()
        {
            var result = _repository.GetTrips();
            return Ok(result);
        }


        // GET api/<TripController>/5
        [HttpGet("{id}")]
        public ActionResult<Trip> Get(int id)
        {
            var result = _repository.GetTrip(id);
            if (result != null)
            {
                return Ok(result);

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


        //AJOUT REQUEST FI TRIP
        [HttpPost("{tripId}/request-rides")]
        public async Task<ActionResult<RequestRide>> CreateRequestRide(int tripId, [FromBody] RequestRide requestRide)
        {
            var trip = await _context.Trips.FindAsync(tripId);

            if (trip == null)
            {
                return NotFound();
            }
            requestRide.RequestDate = DateTime.Now;
            requestRide.Trip = trip;
            _context.RequestsRides.Add(requestRide);
            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        //AFFICHAGE DES REQUEST POUR UN TRIP
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

        // AFFICHER LES TRIPS BETWEEN TWO DATES WE WILL ADD DESTINATION AND NBSEATS AKBER MEN 
        [HttpGet]
        [Route("trips/available-on-date")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsAvailableOnDate(DateTime date)
        {
         var availableTrips = await _context.Trips.Include(t => t.AvailableDates)
        .Where(t =>t.DateDebut <= date && t.DateFin >= date)
        .ToListAsync();
         return Ok(availableTrips);

        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterTripsAsync(double userPickupLatitude, double userPickupLongitude, double userDropLatitude, double userDropLongitude)
        {
            var allTrips = _context.Trips.ToList();
            double proximityThreshold = 10.0;
            var relevantTrips = new List<Trip>();

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
                    relevantTrips.Add(trip);
                }
            }
            if (relevantTrips.Count == 0)
            {
                return Ok("There are no trips close to your locations");
            }

            return Ok(relevantTrips);
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
