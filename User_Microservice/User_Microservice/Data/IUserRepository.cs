
using User_Microservice.Models;

namespace User_Microservice.Data
{
    public interface IUserRepository
    {
        Utilisateur Create(Utilisateur user);
        Utilisateur GetByEmail(string email);
        Utilisateur GetById(int id);
        public void UpdateUser(Utilisateur user);

    }
}
