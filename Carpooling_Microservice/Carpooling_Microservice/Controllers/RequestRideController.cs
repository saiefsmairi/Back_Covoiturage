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


        public RequestRideController(IRequestRideRepository reposiotory, CarpoolingContext context, HttpClient client)
        {
            _repository = reposiotory;
            _context = context;
            _client = client;

        }


        // POST api/<RequestRideController>
        [HttpPost]
        public ActionResult<RequestRide> Post([FromBody] RequestRide model)
        {
            if (model == null)
            {
                return BadRequest();
            }
     /*       var RequestRide = new RequestRide
            (
                model.Source,
                model.Destination,
 
            );*/
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
                rr.DriverId
            });

            return Ok(requestRidesWithTrip);
        }

        [HttpPut("requests/{requestRideId}/status")]
        public async Task<ActionResult<RequestRide>> UpdateRequestRideStatus(int requestRideId, [FromBody] string status)
        {
            var requestRide = await _context.RequestsRides.FindAsync(requestRideId);

            if (requestRide == null)
            {
                return NotFound();
            }

            // Update the status property
            requestRide.Status = status;

            await _context.SaveChangesAsync();

            return Ok(requestRide);
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
