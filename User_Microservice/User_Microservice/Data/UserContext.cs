using User_Microservice.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace User_Microservice.Data
{
    public class UserContext : DbContext

    {
        public DbSet<Utilisateur> Users { set; get; }
        public UserContext(DbContextOptions<UserContext> opt) : base(opt)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Utilisateur>(entity => { entity.HasIndex(e => e.Email).IsUnique(); });
        }
    }
}
