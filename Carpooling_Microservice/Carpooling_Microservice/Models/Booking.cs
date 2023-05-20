using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Carpooling_Microservice.Models
{
    public class Booking
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int BookingId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime BookingDate { get; set; }
        public string Status { get; set; }
        public int TripId { get; set; }
        [JsonIgnore]
        public Trip? Trip { get; set; }
    }
}
