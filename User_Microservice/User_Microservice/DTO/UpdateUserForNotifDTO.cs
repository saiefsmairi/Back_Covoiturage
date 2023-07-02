namespace User_Microservice.DTO
{
    public class UpdateUserForNotifDTO
    {
        public bool AllowsNotifications { get; set; }
        public string? DeviceToken { get; set; }
    }
}
