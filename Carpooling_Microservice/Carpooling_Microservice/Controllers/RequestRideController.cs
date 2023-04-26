using Auth_Microservice.Models;
using Carpooling_Microservice.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Test4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestRideController : ControllerBase
    {
        private readonly IRequestRideRepository _repository;

        public RequestRideController(IRequestRideRepository reposiotory)
        {
            _repository = reposiotory;

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

    }
}
