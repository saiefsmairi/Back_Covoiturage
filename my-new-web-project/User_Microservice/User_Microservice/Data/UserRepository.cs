
using User_Microservice.Models;

namespace User_Microservice.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly UserContext _context;

        public UserRepository(UserContext context)
        {
            _context = context;
        }

        public Utilisateur Create(Utilisateur user)
        {
            _context.Users.Add(user);
            user.Id = _context.SaveChanges();

            return user;
        }

        public IEnumerable<Utilisateur> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public Utilisateur GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }



        public Utilisateur GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public void UpdateUser(Utilisateur user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }
    }
}
