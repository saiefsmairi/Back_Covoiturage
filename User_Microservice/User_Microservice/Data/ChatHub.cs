namespace User_Microservice.Data
{
    using Microsoft.AspNetCore.SignalR;
    using System.Threading.Tasks;
    public class ChatHub : Hub
    {
        public async Task SendMessage(int senderId, int receiverId, string message)
        {
            // Broadcast the message to the sender and receiver
            await Clients.Users(senderId.ToString(), receiverId.ToString()).SendAsync("ReceiveMessage", senderId, message);


        }
    }


}
