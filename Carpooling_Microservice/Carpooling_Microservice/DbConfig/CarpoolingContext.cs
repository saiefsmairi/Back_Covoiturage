using Carpooling_Microservice.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace Carpooling_Microservice.DbConfig
{
    public class CarpoolingContext : DbContext

    {
        public DbSet<Trip> Trips { set; get; }
        public DbSet<RequestRide> RequestsRides { set; get; }

        public DbSet<Booking> Bookings { set; get; }

        public CarpoolingContext(DbContextOptions<CarpoolingContext> opt) : base(opt)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Trip>()
           .HasMany(e => e.RequestRides)
           .WithOne(e => e.Trip)
           .HasForeignKey(e => e.TripId);

            modelBuilder.Entity<Trip>()
            .HasMany(e => e.AvailableDates)
            .WithOne(e => e.Trip)
            .HasForeignKey(e => e.TripId);


            modelBuilder.Entity<Trip>()
           .HasMany(e => e.Bookings)
           .WithOne(e => e.Trip)
           .HasForeignKey(e => e.TripId);

        }
    }
}
