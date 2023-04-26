using Auth_Microservice.Models;
using Carpooling_Microservice.DbConfig;

namespace Carpooling_Microservice.Data
{
    public class RequestRideRepository : IRequestRideRepository
    {
        private readonly CarpoolingContext _context;

        public RequestRideRepository(CarpoolingContext context)
        {
            _context = context;
        }

        public RequestRide createRequestRide(RequestRide requestRide)
        {
            _context.RequestsRides.Add(requestRide);
            return requestRide;
        }

   
        public RequestRide GetRequestRide(int id)
        {
            return _context.RequestsRides.FirstOrDefault(p => p.RequestRideId == id);
        }

        public IEnumerable<RequestRide> GetRequestRides()
        {
            return _context.RequestsRides.ToList();
        }

        public void deleteRequestRide(int id)
        {
            var booking = _context.RequestsRides.FirstOrDefault(p => p.RequestRideId == id);
            _context.RequestsRides.Remove(booking);
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void Update(RequestRide model, int id)
        {
            var existingEntity = _context.RequestsRides.Find(id);
            if (existingEntity != null)

            {
                model.RequestRideId = existingEntity.RequestRideId;
                // Update the properties of the existing entity with the values from the model
                _context.Entry(existingEntity).CurrentValues.SetValues(model);

                // Save the changes to the database
                _context.SaveChanges();

            }
        }
    }
}

