using Auth_Microservice.Models;
using Carpooling_Microservice.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Test4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly ITripRepository _repository;

        public TripController(ITripRepository reposiotory)
        {
            _repository = reposiotory;

        }


        // POST api/<TripController>
        [HttpPost]
        public ActionResult<Trip> Post([FromBody] Trip model)
        {
            if (model == null)
            {
                return BadRequest();
            }
            var trip = new Trip
            (
                model.Source,
                model.Destination,
                model.DateDebut,
                model.DateFin,
                model.AvailableSeats,
                model.Distance,
                model.Type
            );
            var result = _repository.createTrip(model);
            //or hedhi             var result = _repository.createTrip(trip);

            _repository.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = result.TripId }, result);
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

    }
}
