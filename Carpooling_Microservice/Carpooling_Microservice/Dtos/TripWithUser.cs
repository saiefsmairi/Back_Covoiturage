using Auth_Microservice.Dtos;
using Carpooling_Microservice.Models;

namespace Carpooling_Microservice.Dtos
{
    public class TripWithUser
    {
        public Trip Trip { get; set; }
        public UserDto User { get; set; }
    }

}
