namespace Carpooling_Microservice.Dtos
{
    public class UpdateRequestRideStatusDto
    {
        public string status { get; set; }
        public string? deviceToken { get; set; }

    }
}
