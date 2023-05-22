using Carpooling_Microservice.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Carpooling_Microservice.Models
{
    public class TripDates
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TripDatesId { get; set; }
        public DateTime Date { get; set; }

        public int TripId { get; set; }
        [JsonIgnore]
        public Trip? Trip { get; set; }
    }
}
