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
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly UserContext _context;
        private HttpClient _client;
        private readonly string twilioAccountSid = "ACb6f469cc427a1d8ecbfee4779793b6d5";
        private readonly string twilioAuthToken = "e34c13cc31f6c160fe53811893e76864";
        private readonly string twilioPhoneNumber = "+16186682361";


        public UserController(IUserRepository reposiotory, UserContext context, HttpClient client)
        {
            _repository = reposiotory;
            _context = context;
            _client = client;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            var existingUser = _repository.GetByEmail(dto.Email);

            if (existingUser != null)
            {
                return BadRequest("Email already exists");
            }

            var user = new Utilisateur
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Adress = dto.Adress,
                Phone = dto.Phone,
                Email = dto.Email,
                Hascar = false,
                Role = "User",
                AllowsNotifications = false,
                DeviceToken=null,
                IsVerifiedPhoneNumber = false,
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

        [HttpPut("{id}/UserNotif")]
        public IActionResult UpdateUserAllowNotif(int id, [FromBody] UpdateUserForNotifDTO updateUserDto)
        {
            var user = _repository.GetById(id);
            if (user == null)
            {
                return NotFound();
            }

            user.DeviceToken = updateUserDto.DeviceToken;
            user.AllowsNotifications = updateUserDto.AllowsNotifications;

            _repository.UpdateUser(user);

            return Ok();
        }

        [HttpPut("{id}/deleteDeviceTokenLogout")]
        public IActionResult deleteDeviceTokenLogout(int id)
        {
            var user = _repository.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            user.DeviceToken = null;
            user.AllowsNotifications =false;
            _repository.UpdateUser(user);
            return Ok();
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

        //user image methods

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
                var user = _repository.GetById(userId);
                user.Points = totalPoints;
                _context.SaveChanges();
                return Ok(totalPoints);
            }

            return NotFound();
        }

        [HttpPut("users/{userId}/points")]
        public IActionResult UpdateUserPoints(int userId, [FromBody] int points)
        {
            var user = _repository.GetById(userId);

            if (user == null)
            {
                return NotFound();
            }

            user.Points = user.Points-points;
            _context.SaveChanges();

            return Ok(user);
        }


        [HttpPost("sendSMSForConfirmPhone")]
        public IActionResult SendSms(string phoneNumber, string message)
        {
            TwilioClient.Init(twilioAccountSid, twilioAuthToken);

            var twilioMessage = MessageResource.Create(
                body: message,
                from: new Twilio.Types.PhoneNumber(twilioPhoneNumber),
                to: new Twilio.Types.PhoneNumber(phoneNumber)
            );

            return Ok(twilioMessage.Body);
        }

        [HttpPut("{userEmail}/updateVerifyPhoneStatus")]
        public IActionResult updateVerifyPhoneStatus(string userEmail)
        {
            var user = _repository.GetByEmail(userEmail);

            if (user == null)
            {
                return NotFound();
            }   

            user.IsVerifiedPhoneNumber= true;
            _context.SaveChanges();

            return Ok(user);
        }



    }
}
