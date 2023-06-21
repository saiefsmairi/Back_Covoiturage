using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Carpooling_Microservice.Migrations
{
    /// <inheritdoc />
    public partial class mig48 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TripStatus",
                table: "RequestsRides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TripStatus",
                table: "RequestsRides");
        }
    }
}
