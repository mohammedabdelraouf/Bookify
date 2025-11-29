
using backend.Dtos.BookingDtos;
using backend.Dtos.PaymentDtos;
using backend.RepositoryPattern.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository; // (علشان نتأكد إن الغرفة موجودة)
        public BookingsController(IBookingRepository bookingRepository, IRoomRepository roomRepository, UserManager<ApplicationUser> userManager)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
        }
  
       
        [HttpPost] // POST: /api/bookings
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto bookingDto)
        {
            // 1. نتأكد إن البيانات اللي جاية (DTO) سليمة
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // --- 2. (الأمان) جلب الـ ID بتاع اليوزر من التوكن ---
            // إحنا "بنثق" في التوكن، مش في أي ID جاي من الفرونت إند
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var room = await _roomRepository.GetRoomEntityByIdAsync(bookingDto.RoomId);
            if (room == null)
            {
                return BadRequest("Invalid Room ID.");
            }
            try {
                var newBooking = await _bookingRepository.CreateBookingAsync(bookingDto, userId);
                // Circular Reference Problem Solution:
                var bookingDtoResponse = await _bookingRepository.GetBookingByIdAsync(newBooking.BookingId, userId);
                return Ok(bookingDtoResponse);
            }
            catch (KeyNotFoundException ex) // for room not found
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex) // for trying to book in invalid dates
            {
                return BadRequest("Could not create booking: " + ex.Message);
            }
            catch(Exception) // generic error
            {
                return StatusCode(500, "An unexpected error occurred while creating the booking.");
            }
        }
        // GET: /api/bookings/my-bookings
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetUserBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }
            var bookings = await _bookingRepository.GetUserBookingsAsync(userId);

            // front end handling empty list is better
            //if (bookings == null || !bookings.Any())
            //{
            //    return NotFound("No bookings found for the user.");
            //}

            return Ok(bookings);
        }
        // GET: /api/bookings/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var booking = await _bookingRepository.GetBookingByIdAsync(id, userId);

            if (booking == null)
            {
                return NotFound("Booking not found or you do not have permission.");
            }

            return Ok(booking);
        }
        [HttpPost("confirm-payment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] PaymentConfirmationDto paymentConfirmationDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null)
            {
                return Unauthorized("User Id not found");
            }
            try
            {
                await _bookingRepository.ConfirmPaymentAsync(paymentConfirmationDto.BookingId, userId, paymentConfirmationDto.TransactionId);
                return Ok(new { message = "payment is confirmed and booking is updated successfully" });
            }
            catch (KeyNotFoundException ex) // for no booking exception
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex) // if payment was done before
            {
                return BadRequest(ex.Message);
            }
            catch(Exception ex)
            {
                return StatusCode(500, "An internal error occurred. Payment failed.");
            }
        }


    }
}
