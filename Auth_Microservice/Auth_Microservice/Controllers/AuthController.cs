using Auth_Microservice.Data;
using Auth_Microservice.Dtos;
using Auth_Microservice.Helpers;
using Auth_Microservice.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
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
        private readonly IUserRepository _repository;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserRepository repository, JwtService jwtService, IConfiguration configuration)
        {
            _repository = repository;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Adress = dto.Adress,
                Phone = dto.Phone,
                Email = dto.Email,
                Role = "User",
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            return Created("success", _repository.Create(user));
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = _repository.GetByEmail(dto.Email);

            if (user == null) return BadRequest(new { message = "Invalid Credentials" });

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return BadRequest(new { message = "Invalid Credentials" });
            }

            var jwt = _jwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new
            {
                message = jwt
            });
        }

        [HttpGet("user")]
        public IActionResult User()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];

                var token = _jwtService.Verify(jwt);

                int userId = int.Parse(token.Issuer);

                var user = _repository.GetById(userId);

                return Ok(user);
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "success"
            });

        }

        /// <summary>
        /// ////////////////
        /// </summary>
        /// 
        /// <returns></returns>


        [AllowAnonymous]
        [HttpPost("login2")]

        public IActionResult Login2([FromBody] LoginDto userLogin)
        {
            var user = _repository.GetByEmail(userLogin.Email);

            if (user == null) return BadRequest(new { message = "Invalid Credentials" });

            if (!BCrypt.Net.BCrypt.Verify(userLogin.Password, user.Password))
            {
                return BadRequest(new { message = "Invalid Credentials" });
            }
                var token = Generate(user);
            var response = new
            {
                token = token,
                user = new
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Adress = user.Adress,
                    Phone = user.Phone,
                    Email = user.Email,

                }
            };
            return Ok(response);

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
