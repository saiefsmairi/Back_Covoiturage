﻿// <auto-generated />
using System;
using Carpooling_Microservice.DbConfig;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Carpooling_Microservice.Migrations
{
    [DbContext(typeof(CarpoolingContext))]
    [Migration("20230527130847_mig14")]
    partial class mig14
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Carpooling_Microservice.Models.Booking", b =>
                {
                    b.Property<int>("BookingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BookingId"));

                    b.Property<DateTime>("BookingDate")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("datetime2");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TripId")
                        .HasColumnType("int");

                    b.HasKey("BookingId");

                    b.HasIndex("TripId");

                    b.ToTable("Bookings");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.RequestRide", b =>
                {
                    b.Property<int>("RequestRideId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RequestRideId"));

                    b.Property<int>("DriverId")
                        .HasColumnType("int");

                    b.Property<int>("PassengerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("RequestDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TripId")
                        .HasColumnType("int");

                    b.HasKey("RequestRideId");

                    b.HasIndex("TripId");

                    b.ToTable("RequestsRides");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.Trip", b =>
                {
                    b.Property<int>("TripId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TripId"));

                    b.Property<int>("AvailableSeats")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateDebut")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateFin")
                        .HasColumnType("datetime2");

                    b.Property<TimeSpan?>("DepartureTime")
                        .HasColumnType("time");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Destination")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Distance")
                        .HasColumnType("real");

                    b.Property<double>("DropLatitude")
                        .HasColumnType("float");

                    b.Property<double>("DropLongitude")
                        .HasColumnType("float");

                    b.Property<float>("EstimatedTime")
                        .HasColumnType("real");

                    b.Property<double>("PickupLatitude")
                        .HasColumnType("float");

                    b.Property<double>("PickupLongitude")
                        .HasColumnType("float");

                    b.Property<string>("Source")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("TripId");

                    b.ToTable("Trips");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.TripDates", b =>
                {
                    b.Property<int>("TripDatesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TripDatesId"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<int>("TripId")
                        .HasColumnType("int");

                    b.HasKey("TripDatesId");

                    b.HasIndex("TripId");

                    b.ToTable("TripDates");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.Booking", b =>
                {
                    b.HasOne("Carpooling_Microservice.Models.Trip", "Trip")
                        .WithMany("Bookings")
                        .HasForeignKey("TripId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Trip");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.RequestRide", b =>
                {
                    b.HasOne("Carpooling_Microservice.Models.Trip", "Trip")
                        .WithMany("RequestRides")
                        .HasForeignKey("TripId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Trip");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.TripDates", b =>
                {
                    b.HasOne("Carpooling_Microservice.Models.Trip", "Trip")
                        .WithMany("AvailableDates")
                        .HasForeignKey("TripId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Trip");
                });

            modelBuilder.Entity("Carpooling_Microservice.Models.Trip", b =>
                {
                    b.Navigation("AvailableDates");

                    b.Navigation("Bookings");

                    b.Navigation("RequestRides");
                });
#pragma warning restore 612, 618
        }
    }
}
