using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController] // add features like understanding request body, model validation, etc [formbody]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;
        public RoomsController(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _roomRepository.GetAllRoomsAsync();
            return Ok(rooms);
        }
        [HttpGet("{roomId}")]
        public async Task<IActionResult> GetRoomByID(int roomId)
        {
            var room = await _roomRepository.GetRoomDtoByIdAsync(roomId);
            if (room == null)
                return NotFound();
            return Ok(room);
        }
      

    }
}
