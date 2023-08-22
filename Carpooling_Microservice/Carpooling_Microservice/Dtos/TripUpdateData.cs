using Carpooling_Microservice.Models;

namespace Carpooling_Microservice.Dtos
{
    public class TripUpdateData
    {
        public string source { get; set; }
        public string destination { get; set; }

        public int availableSeats { get; set; }
        public string departureTime { get; set; }

        public ICollection<TripDates> availableDates { get; set; }


    }
}
