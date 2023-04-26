using Auth_Microservice.Models;

namespace Carpooling_Microservice.Data
{
    public interface IRequestRideRepository
    {
        bool SaveChanges();
        IEnumerable<RequestRide> GetRequestRides();
        RequestRide GetRequestRide(int id);

        RequestRide createRequestRide(RequestRide trip);

        void Update(RequestRide model, int id);

        void deleteRequestRide(int id);
    }
}


