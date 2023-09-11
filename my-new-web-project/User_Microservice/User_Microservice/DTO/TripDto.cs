using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace User_Microservice.DTO
{
  
        public class TripDto
        {
            public int TripId { get; set; }
            public string Source { get; set; }
            public string Destination { get; set; }

            public int AvailableSeats { get; set; }
            public float Distance { get; set; }
            public float EstimatedTime { get; set; }

            public string Type { get; set; }

            public int UserId { get; set; }
    }
    
}
