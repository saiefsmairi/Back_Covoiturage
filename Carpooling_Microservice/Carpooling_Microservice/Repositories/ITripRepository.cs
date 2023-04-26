using Auth_Microservice.Models;

namespace Carpooling_Microservice.Data
{
    public interface ITripRepository
    {
        bool SaveChanges();
        IEnumerable<Trip> GetTrips();
        Trip GetTrip(int id);

        Trip createTrip(Trip trip);

        void Update(Trip model, int id);

        void deleteTrip(int id);
    }
}
