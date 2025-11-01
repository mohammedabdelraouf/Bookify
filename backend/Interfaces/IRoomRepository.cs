using backend.Dtos;
using backend.Models;

namespace backend.Interfaces
{
    public interface IRoomRepository
    {
        // IEnumerable instead of List to allow more flexibility so i don't bring the whole rooms and save them in memory
        // no i will just stream them one by one using foreach (this will increase performance when there are many rooms)
        Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
        Task<RoomDto?> GetRoomDtoByIdAsync(int roomId);
        // Admin Methods
        Task<Room> GetRoomEntityByIdAsync(int roomId);
        Task AddRoomAsync(Room room); // parameter is RoomDto to avoid overposting and because front-end only sends these properties
        Task UpdateRoomAsync(Room room);
        Task DeleteRoomAsync(int roomId);
        
    }
}
