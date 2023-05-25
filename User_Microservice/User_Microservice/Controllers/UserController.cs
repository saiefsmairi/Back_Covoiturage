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

namespace User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly UserContext _context;

        public UserController(IUserRepository reposiotory, UserContext context)
        {
            _repository = reposiotory;
            _context = context;
          

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



    }
}
