using Auth_Microservice.Models;
using Carpooling_Microservice.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Test4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingRepository _repository;

        public BookingController(IBookingRepository reposiotory)
        {
            _repository = reposiotory;
        }


        // POST api/<BookingControllerController>
        [HttpPost]
        public ActionResult<Booking> Post([FromBody] Booking model)
        {
            if (model == null)
            {
                return BadRequest();
            }
              /*      var booking = new Booking
                    (
                        model.Source,
                        model.Destination,

                    );*/
            var result = _repository.CreateBooking(model);
            _repository.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = result.BookingId }, result);
        }



        // GET: api/<BookingController>
        [HttpGet]
        public ActionResult<IEnumerable<Booking>> Get()
        {
            var result = _repository.GetBookings();
            return Ok(result);
        }


        // GET api/<BookingController>/5
        [HttpGet("{id}")]
        public ActionResult<Booking> Get(int id)
        {
            var result = _repository.GetBooking(id);
            if (result != null)
            {
                return Ok(result);

            }
            return NotFound();
        }


        // DELETE api/<BookingController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _repository.DeleteBooking(id);
            _repository.SaveChanges();
        }


        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Booking model)
        {
            _repository.UpdateBooking(model,id);
            return Ok(model);
        }

    }
}
