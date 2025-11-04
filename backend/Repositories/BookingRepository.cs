using backend.Data;
using backend.Dtos;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BookingRepository(BookifyDbContext context) : IBookingRepository
    {
        private readonly BookifyDbContext _context = context;


        public async Task<IEnumerable<BookingDto>> GetAllBookingAsync()
        {
            return  await _context.Bookings
                .Include(B => B.Payment)
                .Select(b => new BookingDto 
                {
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalAmount = b.TotalAmount,
                    bookingStatus = b.bookingStatus
                }).ToListAsync();
        }


        public Task<BookingDto> GetBookingByIdAsync(int bookingId)
        {
            throw new NotImplementedException();
        }

        public Task AddBookingAsync(BookingDto bookingDto)
        {
            throw new NotImplementedException();
        }

        public Task UpdateBookingAsync(BookingDto bookingDto)
        {
            throw new NotImplementedException();
        }


        public Task DeleteBookingAsync(int bookingId)
        {
            throw new NotImplementedException();
        }

    }
}
