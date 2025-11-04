using backend.Interfaces;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController(IBookingRepository bookingRepository) : ControllerBase
    { 
            private readonly IBookingRepository _bookingRepository = bookingRepository;

            [HttpGet]
            public async Task<IActionResult> GetAllBooking()
            {
                var booking = await _bookingRepository.GetAllBookingAsync();
                return Ok(booking);
            }
    }
}
