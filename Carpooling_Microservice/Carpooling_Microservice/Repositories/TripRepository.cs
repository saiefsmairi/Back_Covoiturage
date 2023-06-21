using Carpooling_Microservice.Models;
using Carpooling_Microservice.DbConfig;

namespace Carpooling_Microservice.Data
{
    public class TripRepository : ITripRepository
    {
        private readonly CarpoolingContext _context;

        public TripRepository(CarpoolingContext context)
        {
            _context = context;
        }

        public Trip createTrip(Trip trip)
        {
            _context.Trips.Add(trip);
            return trip;
        }

        public Trip GetTrip(int id)
        {
            return _context.Trips.FirstOrDefault(p => p.TripId == id);
        }


        public IEnumerable<Trip> GetTrips()
        {
            return _context.Trips.ToList();
        }

        public void deleteTrip(int id)
        {
            var trip = _context.Trips.FirstOrDefault(p => p.TripId == id);
            _context.Trips.Remove(trip);
        }

        public void Update(Trip model, int id)
        {
            var existingEntity = _context.Trips.Find(id);
            if (existingEntity != null)

            {
                model.TripId = existingEntity.TripId;
                // Update the properties of the existing entity with the values from the model
                _context.Entry(existingEntity).CurrentValues.SetValues(model);

                // Save the changes to the database
                _context.SaveChanges();

            }
        }
     

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

    
    }
}

