﻿namespace Auth_Microservice.Dtos
{
    public class LoginDto
    {
        public string Email { set; get; }
        public string Password { set; get; }
        public bool? AllowsNotifications { get; set; }
        public string? DeviceToken { get; set; }
    }
}
