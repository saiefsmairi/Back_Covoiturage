using Auth_Microservice.Models;
using Carpooling_Microservice.DbConfig;

namespace Carpooling_Microservice.Data
{
    public class BookingRepository : IBookingRepository
    {
        private readonly CarpoolingContext _context;

        public BookingRepository(CarpoolingContext context)
        {
            _context = context;
        }

        public Booking CreateBooking(Booking booking)
        {
            _context.Bookings.Add(booking);
            return booking;
        }

        public Booking GetBooking(int id)
        {
            return _context.Bookings.FirstOrDefault(p => p.BookingId == id);
        }

        public IEnumerable<Booking> GetBookings()
        {
            return _context.Bookings.ToList();
        }


        public void DeleteBooking(int id)
        {
            var booking = _context.Bookings.FirstOrDefault(p => p.BookingId == id);
            _context.Bookings.Remove(booking);
        }

    
        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void UpdateBooking(Booking model, int id)
        {
            var existingEntity = _context.Bookings.Find(id);
            if (existingEntity != null)

            {
                model.BookingId = existingEntity.BookingId;
                // Update the properties of the existing entity with the values from the model
                _context.Entry(existingEntity).CurrentValues.SetValues(model);

                // Save the changes to the database
                _context.SaveChanges();

            }
        }

    }
}

