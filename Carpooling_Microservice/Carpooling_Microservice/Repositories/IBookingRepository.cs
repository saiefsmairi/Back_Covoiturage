using Auth_Microservice.Models;


    public interface IBookingRepository
    {
        bool SaveChanges();
        IEnumerable<Booking> GetBookings();
        Booking GetBooking(int id);

        Booking CreateBooking(Booking trip);

        void UpdateBooking(Booking model, int id);

        void DeleteBooking(int id);
    
}
