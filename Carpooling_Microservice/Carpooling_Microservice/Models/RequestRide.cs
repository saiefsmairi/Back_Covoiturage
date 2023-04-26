using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Auth_Microservice.Models
{
    public class RequestRide
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int RequestRideId { get; set; }
        public DateTime RequestDate { get; set; }

        public string Status { get; set; }
        public string PickupPoint { get; set; }

        public Trip Trip { get; set; }


    }
}
