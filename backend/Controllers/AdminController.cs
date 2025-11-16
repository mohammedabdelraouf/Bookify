using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IRoomTypeRepository _roomTypeRepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IBookingRepository _bookingRepository;
        public AdminController(IRoomTypeRepository roomTypeRepository, IRoomRepository roomRepository,
            ICloudinaryService cloudinaryService, IBookingRepository bookingRepository)
        {
            _roomTypeRepository = roomTypeRepository;
            _roomRepository = roomRepository;
            _cloudinaryService = cloudinaryService;
            _bookingRepository = bookingRepository;
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
        // Room Image methods
        [Authorize(Roles = "Admin")]
        [HttpPost("rooms/{roomId}/images")]
        public async Task<IActionResult> UploadRoomImage(int roomId, IFormFile imageFile)
        {
            if (imageFile == null) return BadRequest(new { Message = "Image file is required." });
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { Message = "Invalid image format. Only JPG and PNG are allowed." });
            }
            if (imageFile.Length > 5 * 1024 * 1024) // 5 MB limit
            {
                return BadRequest(new { Message = "Image size exceeds the 5MB limit." });
            }
            var room = await _roomRepository.GetRoomEntityByIdAsync(roomId);

            if (room == null) return NotFound(new { Message = "Room not found." });
            var folder = $"rooms/{roomId}";
            var (url, publicId) = await _cloudinaryService.UploadImageAsync(imageFile, folder);
            var roomImage = new RoomImage
            {
                ImageUrl = url,
                PublicId = publicId,
                IsMain = room.RoomImages == null || !room.RoomImages.Any()
            };
            await _roomRepository.AddRoomImageAsync(roomId, roomImage);
            var dto = new RoomImageDto { ImageId = roomImage.ImageId, Url = roomImage.ImageUrl, IsMain = roomImage.IsMain };
            return Ok(dto);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("rooms/{roomId}/images/bulk")]
        public async Task<IActionResult> UploadRoomImagesBulk(int roomId, List<IFormFile> files)
        {
            if (files == null || !files.Any()) return BadRequest("No files provided.");
            var room = await _roomRepository.GetRoomWithImagesAsync(roomId);
            if (room == null) return NotFound("Room not found.");

            var results = new List<RoomImageDto>();
            var folder = $"bookify/rooms/{roomId}";

            foreach (var file in files)
            {
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                var allowed = new[] { ".jpg", ".jpeg", ".png" };
                if (!allowed.Contains(ext)) continue; // skip invalid
                if (file.Length > 5 * 1024 * 1024) continue; // skip too big

                var (url, publicId) = await _cloudinaryService.UploadImageAsync(file, folder);
                var image = new RoomImage
                {
                    ImageUrl = url,
                    PublicId = publicId,
                    IsMain = (room.RoomImages == null || !room.RoomImages.Any()) && !results.Any()
                };
                await _roomRepository.AddRoomImageAsync(roomId, image);
                results.Add(new RoomImageDto { ImageId = image.ImageId, Url = image.ImageUrl, IsMain = image.IsMain });
            }

            return Ok(results);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("rooms/{roomId}/images/{imageId}")]
        public async Task<IActionResult> DeleteRoomImage(int roomId, int imageId)
        {
            var img = await _roomRepository.GetRoomImageByIdAsync(imageId);
            if (img == null || img.RoomId != roomId) return NotFound();

            if (!string.IsNullOrEmpty(img.PublicId))
                await _cloudinaryService.DeleteImageAsync(img.PublicId);

            var ok = await _roomRepository.DeleteRoomImageAsync(imageId);
            if (!ok) return StatusCode(500, "Failed to delete image.");

            return Ok(new { Message = "Image deleted." });
        }

        // Bookings methods
        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _bookingRepository.GetAllBookingsAsync();
            return Ok(bookings);
        }

        // Payments methods
        [HttpGet("payments")]
        public async Task<IActionResult> GetAllPayments()
        {
            var bookings = await _bookingRepository.GetAllBookingsAsync();
            // Filter to only include bookings with actual payments
            var paymentsData = bookings
                .Where(b => b.PaymentId.HasValue)
                .OrderByDescending(b => b.PaymentDate)
                .ToList();
            return Ok(paymentsData);
        }

        // Customers methods
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var bookings = await _bookingRepository.GetAllBookingsAsync();
            // Return all bookings with user info - frontend will group by user
            return Ok(bookings);
        }

    }
}