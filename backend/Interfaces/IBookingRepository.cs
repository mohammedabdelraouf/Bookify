namespace backend.Interfaces
{
    public interface IBookingRepository
    {
        Task<Booking> CreateBookingAsync(CreateBookingDto createBookingDto,string UserId);
        Task<BookingDto> GetBookingByIdAsync(int bookingId, string userId);
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId);
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync(); // Admin only
        Task<Booking> UpdateBookingStatusAsync(int bookingId, BookingStatus newStatus);
        Task<Booking> GetBookingEntityByIdAsync(int bookingId, string userId);
        //Aggregate Root
        Task ConfirmPaymentAsync(int bookingId, string userId, string transactionId);
    }
}
