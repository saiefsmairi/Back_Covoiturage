using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace User_Microservice.Models
{
    public class Utilisateur
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Adress { get; set; }
        public string? Image { get; set; }
        public bool? Hascar { get; set; }
        public string? CarImg { get; set; }
        public string? CarBrand { get; set; }

        public string Email { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
    }
}

