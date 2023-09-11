using User_Microservice.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using User_Microservice.Data;
using User_Microservice.DTO;
using Auth_Microservice.Dtos;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly UserContext _context;
        private HttpClient _client;


        public UserController(IUserRepository reposiotory, UserContext context, HttpClient client)
        {
            _repository = reposiotory;
            _context = context;
            _client = client;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            var user = new Utilisateur
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Adress = dto.Adress,
                Phone = dto.Phone,
                Email = dto.Email,
                Hascar = false,
                Role = "User",
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            return Created("success", _repository.Create(user));
        }

        //this method for verifying user email and password and return the user if the coords are correct
        [HttpPost("verify")]
        public IActionResult VerifyUser(LoginDTO userLogin)
        {
            var user = _repository.GetByEmail(userLogin.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(userLogin.Password, user.Password))
            {
                return BadRequest();
            }

            return Ok(user);
        }

        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _repository.GetById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<Utilisateur>> Get()
        {
            var result = _repository.GetAllUsers();
            var response = new List<Utilisateur>();
            foreach (var user in result)
            {
                var image = user.Image;
                if (!string.IsNullOrEmpty(image))
                {
                    try
                    {
                        byte[] imageBytes = System.IO.File.ReadAllBytes(image);
                        string base64Image = Convert.ToBase64String(imageBytes);
                        user.Image = base64Image;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"An error occurred while processing user image: {ex.Message}");
                        // Handle the exception or skip the user as needed.
                        // For example, you can add a default image or simply skip this user:
                        // continue;
                    }
                }
                response.Add(user);
            }
            return Ok(response);
        }



        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UpdateUserDTO updatedUser)
        {
            Utilisateur existingUser = _repository.GetById(id);

            if (existingUser == null)
            {
                return NotFound(); 
            }

            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.Email = updatedUser.Email;
            existingUser.Phone = updatedUser.Phone;
            existingUser.Adress = updatedUser.Adress;

            _repository.UpdateUser(existingUser);
            var updatedUserDto = new
            {
                existingUser.Id,
                existingUser.FirstName,
                existingUser.LastName,
                existingUser.Email,
                existingUser.Adress,
                existingUser.Phone
            };
            return Ok(updatedUserDto); 
        }


        [HttpPut("{userId}/upload")]
        public async Task<IActionResult> UploadImage(int userId, IFormFile profilePhoto)
        {
            if (profilePhoto == null || profilePhoto.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(profilePhoto.FileName);

            var imagePath = Path.Combine("images", fileName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await profilePhoto.CopyToAsync(stream);
            }

            var user = _repository.GetById(userId);
            user.Image = imagePath;
            _context.SaveChanges();

            return Ok("Image uploaded successfully.");
        }


        [HttpGet("{userId}/profileImage")]
        public IActionResult GetProfileImage(int userId)
        {
            var user = _repository.GetById(userId);
            var profileImagePath = user.Image;

            if (string.IsNullOrEmpty(profileImagePath))
            {
                return NotFound("Profile image not found.");
            }

            byte[] imageBytes = System.IO.File.ReadAllBytes(profileImagePath);
            string base64Image = Convert.ToBase64String(imageBytes);

            return Ok(base64Image);
        }

        //Add car methods

        [HttpPut("{userId}/uploadCar")]
        public async Task<IActionResult> UploadCar(int userId, IFormFile carPhoto,string CarBrand)
        {
            if (carPhoto == null || carPhoto.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(carPhoto.FileName);

            var imagePath = Path.Combine("images", fileName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await carPhoto.CopyToAsync(stream);
            }

            var user = _repository.GetById(userId);
            user.CarImg = imagePath;
            user.CarBrand = CarBrand;
            user.Hascar=true;
            _context.SaveChanges();

            return Ok("Image uploaded successfully.");
        }

        [HttpGet("{userId}/carImage")]
        public IActionResult GetcarImage(int userId)
        {
            var user = _repository.GetById(userId);
            var carImagePath = user.CarImg;

            if (string.IsNullOrEmpty(carImagePath))
            {
                return NotFound("Car image not found.");
            }

            byte[] imageBytes = System.IO.File.ReadAllBytes(carImagePath);
            string base64Image = Convert.ToBase64String(imageBytes);

            var carInfos = new
            {
                user.CarBrand,
                base64Image,
                user.Hascar
            };
            return Ok(carInfos);
        }


        /// calcul total points 

        [HttpGet("users/{userId}/TotalPoints")]
        public async Task<IActionResult> GetPointsForBookedTripsByPassenger(int userId)
        {
            var bookedTripsResponse = await _client.GetAsync($"https://localhost:7095/api/Trip/passengers/{userId}/trips/booked");
            var createdTripsResponse = await _client.GetAsync($"https://localhost:7095/api/Trip/driver/{userId}/createdtripsWithPassengerCount");

            if (bookedTripsResponse.IsSuccessStatusCode && createdTripsResponse.IsSuccessStatusCode)
            {
                var bookedTripsResponseContent = await bookedTripsResponse.Content.ReadAsStringAsync();
                var createdTripsResponseContent = await createdTripsResponse.Content.ReadAsStringAsync();

                var bookedTrips = JsonConvert.DeserializeObject<List<TripDto>>(bookedTripsResponseContent);
                var createdTrips = JsonConvert.DeserializeObject<List<TripWithPassengerCountDto>>(createdTripsResponseContent);

                int totalPoints = 0;

                foreach (var trip in bookedTrips)
                {
                    int tripPoints = (int)(trip.Distance * 150);
                    totalPoints += tripPoints;
                }
                foreach (var createdTrip in createdTrips)
                {
                    int tripPoints = (int)(createdTrip.Trip.Distance * createdTrip.PassengerCount*150);
                    totalPoints += tripPoints;
                }

                return Ok(totalPoints);
            }

            return NotFound();
        }




    }
}
