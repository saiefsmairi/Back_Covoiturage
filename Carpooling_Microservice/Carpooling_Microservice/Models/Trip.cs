using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Carpooling_Microservice.Models
{
    public class Trip
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int TripId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }

        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }

        public int AvailableSeats { get; set; }
        public float Distance { get; set; }
        public float EstimatedTime { get; set; }
        public double PickupLatitude { get; set; }
        public double PickupLongitude { get; set; }

        public double DropLatitude { get; set; }
        public double DropLongitude { get; set; }
        public string Description { get; set; }

        public bool Food { get; set; }
        public bool Smoke { get; set; }
        public bool Music { get; set; }


        public TimeSpan? DepartureTime { get; set; }
        [NotMapped]
        public string DepartureTimeInput { get; set; }

        public string Type { get; set; }
        public ICollection<TripDates> AvailableDates { get; set; }

        public int UserId { get; set; }

        public ICollection<RequestRide>? RequestRides { get; set; }
        public ICollection<Booking>? Bookings { get; set; }

        public Trip(string source, string destination, DateTime dateDebut, DateTime dateFin, int availableSeats, float distance, string type)
        {
            Source = source;
            Destination = destination;
            DateDebut = dateDebut;
            DateFin = dateFin;
            AvailableSeats = availableSeats;
            Distance = distance;
            Type = type;
        }
    }
}
