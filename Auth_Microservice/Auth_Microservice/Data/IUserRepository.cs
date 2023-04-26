using Auth_Microservice.Models;

namespace Auth_Microservice.Data
{
    public interface IUserRepository
    {
        User Create(User user);
        User GetByEmail(string email);
        User GetById(int id);
    }
}
