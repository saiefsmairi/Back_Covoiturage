using Auth_Microservice.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Auth_Microservice.Data
{
    public class UserContext : DbContext

    {
        public DbSet<User> Users { set; get; }
        public UserContext(DbContextOptions<UserContext> opt) : base(opt)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity => { entity.HasIndex(e => e.Email).IsUnique(); });
        }
    }
}
