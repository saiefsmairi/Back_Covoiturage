using Carpooling_Microservice.Models;
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
                _context.Entry(existingEntity).CurrentValues.SetValues(model);
                _context.SaveChanges();

            }
        }

        public RequestRide GetRequestRideByUserAndTrip(int PassengerId, int tripId)
        {
            return _context.RequestsRides
                .FirstOrDefault(rr => rr.PassengerId == PassengerId && rr.TripId == tripId);
        }
    }
}

