using Auth_Microservice.Dtos;
using Auth_Microservice.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Numerics;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace Auth_Microservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(  IConfiguration configuration)
        {
            _configuration = configuration;
        }



        [HttpPost("login")]
        public async Task<IActionResult> VerifyUserAndLogin([FromBody] LoginDto userLogin)
        {
            // Make an API request to the User microservice to verify the user
            using (var client = new HttpClient())
            {
                var userMicroserviceUrl = "http://localhost:5243/api/User/verify";
                var requestBody = new { Email = userLogin.Email, Password = userLogin.Password };

                var requestContent = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

                HttpResponseMessage response;
                try
                {
                    response = client.PostAsync(userMicroserviceUrl, requestContent).Result;
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error calling User microservice." });
                }

                if (response.IsSuccessStatusCode)
                {
                    var userResponse = await response.Content.ReadAsStringAsync();
                    var user = JsonConvert.DeserializeObject<User>(userResponse);

                    // User is valid, generate token and return the response
                    var token = Generate(user);
                    var responseObject = new
                    {
                        token = token,
                        user = new
                        {
                            Id=user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Phone = user.Phone,
                            Email = user.Email,
                            Adress= user.Adress,
                            Role= user.Role,
                        }
                    };

                    return Ok(responseObject);
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    return BadRequest(new { message = "Invalid Credentials" });
                }
                else
                {
                    return StatusCode(500, new { message = "Error calling User microservice." });
                }
            }
        }


        private string Generate(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.Email),
                new Claim(ClaimTypes.Name,user.FirstName),
                new Claim(ClaimTypes.StreetAddress, user.Adress),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.MobilePhone, user.Phone),

            };

            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
              _configuration["Jwt:Audience"],
              claims,
              expires: DateTime.Now.AddMinutes(15),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }




    }
}
