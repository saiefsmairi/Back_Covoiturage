using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Auth_Microservice.Models
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
        public string Type { get; set; }
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
