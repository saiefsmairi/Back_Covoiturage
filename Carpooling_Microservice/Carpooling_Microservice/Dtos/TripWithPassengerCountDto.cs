using Carpooling_Microservice.Models;

namespace Carpooling_Microservice.Dtos
{
    public class TripWithPassengerCountDto
    {
        public Trip Trip { get; set; }
        public int PassengerCount { get; set; }

    }
}
