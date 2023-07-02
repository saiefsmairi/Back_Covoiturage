using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User_Microservice.Migrations
{
    /// <inheritdoc />
    public partial class mig26 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowsNotifications",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeviceToken",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowsNotifications",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DeviceToken",
                table: "Users");
        }
    }
}
