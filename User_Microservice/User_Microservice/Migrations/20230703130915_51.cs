using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User_Microservice.Migrations
{
    /// <inheritdoc />
    public partial class _51 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVerifiedPhoneNumber",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVerifiedPhoneNumber",
                table: "Users");
        }
    }
}
