using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IRoomTypeRepository _roomTypeRepository;
        public AdminController(IRoomTypeRepository roomTypeRepository, IRoomRepository roomRepository)
        {
            _roomTypeRepository = roomTypeRepository;
            _roomRepository = roomRepository;
        }
        [HttpPost("room-types")] // POST: api/Admin/room-types
        public async Task<IActionResult> AddRoomType([FromBody] CreateRoomTypeDto createRoomTypeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _roomTypeRepository.AddRoomTypeAsync(createRoomTypeDto);
            return Ok(new { Message = "Room type added successfully." });
        }
        [HttpGet("room-types")]
        public async Task<IActionResult> GetAllRoomTypes()
        {
            var roomTypes = await _roomTypeRepository.GetAllRoomTypesAsync();
            return Ok(roomTypes);

        }
        [HttpGet("room-types/{id}")]    
        public async Task<IActionResult> GetRoomTypeById(int id)
        {
            var roomType = await _roomTypeRepository.GetRoomTypeDtoByIdAsync(id);
            if (roomType == null)
            {
                return NotFound(new { Message = "Room type not found." });
            }
            return Ok(roomType);
        }
        [HttpPut("room-types/{id}")]
        public async Task<IActionResult> UpdateRoomType(int id, [FromBody] CreateRoomTypeDto createRoomTypeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
 
            await _roomTypeRepository.UpdateRoomTypeAsync(id, createRoomTypeDto);
            return Ok(new { Message = "Room type updated successfully." });
        }
        [HttpDelete("room-types/{id}")]
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            var result = await _roomTypeRepository.DeleteRoomTypeAsync(id);
            if (!result)
            {
                return NotFound(new { Message = "Room type not found." });
            }
            return Ok(new { Message = "Room type deleted successfully." });
        }
        // Room methods
        [HttpPost("rooms")]
        public async Task<IActionResult> AddRoom([FromBody] CreateRoomDto roomDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var roomType = await _roomTypeRepository.GetRoomEntityByIdAsync(roomDto.RoomTypeId);
            if(roomType == null)
            {
                return BadRequest(new { Message = "Invalid RoomTypeId. Room type does not exist." });
            }
            var newRoom = new Room
            {
                RoomNumber = roomDto.RoomNumber,
                Floor = roomDto.Floor,
                status = roomDto.status,
                RoomTypeId = roomDto.RoomTypeId
            };
            await _roomRepository.AddRoomAsync(newRoom);
            return Ok(new { Message = "Room added successfully." });
        }
        [HttpPut("rooms/{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomDto updateRoomDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var roomType = await _roomTypeRepository.GetRoomEntityByIdAsync(updateRoomDto.RoomTypeId);
            if(roomType == null)
            {
                return BadRequest(new { Message = "Invalid RoomTypeId. Room type does not exist." });
            }
            await _roomRepository.UpdateRoomAsync(id, updateRoomDto);
            return Ok(new { Message = "Room updated successfully." });

        }
        [HttpDelete("rooms/{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {

            var result = await _roomRepository.DeleteRoomAsync(id);
            if (!result)
            {
                return NotFound(new { Message = "Room not found." });
            }
            return Ok(new { Message = "Room deleted successfully." });
        }


        }
}