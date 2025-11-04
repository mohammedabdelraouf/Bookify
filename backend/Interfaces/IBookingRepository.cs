using backend.Dtos;
using backend.Models;

namespace backend.Interfaces
{
    public interface IBookingRepository
    {
        Task<IEnumerable<BookingDto>> GetAllBookingAsync();
        Task<BookingDto> GetBookingByIdAsync(int bookingId);
        Task AddBookingAsync(BookingDto bookingDto); // parameter is BookingDto to avoid overposting and because front-end only sends these properties
        Task UpdateBookingAsync(BookingDto bookingDto);
        Task DeleteBookingAsync(int bookingId);
    }
}
