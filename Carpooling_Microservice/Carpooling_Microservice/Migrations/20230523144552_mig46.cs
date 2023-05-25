using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Carpooling_Microservice.Migrations
{
    /// <inheritdoc />
    public partial class mig46 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PickupPoint",
                table: "RequestsRides");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PickupPoint",
                table: "RequestsRides",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
