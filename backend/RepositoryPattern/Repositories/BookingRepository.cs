using backend.Dtos.BookingDtos;
using backend.Models.Enums;
using backend.RepositoryPattern.Interfaces;

namespace backend.RepositoryPattern.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly BookifyDbContext _context;
        public BookingRepository(BookifyDbContext context)
        {
            _context = context;
        }
        public async Task<Booking> CreateBookingAsync(CreateBookingDto createBookingDto, string UserId)
        {
            var room = await _context.Rooms
                .Include(r => r.RoomType).FirstOrDefaultAsync(r => r.RoomId == createBookingDto.RoomId);
            if (room == null)
            {
                throw new Exception("Room not found");
            }
            var pricePerNight = room.RoomType.PricePerNight;
            var numberOfNights = (createBookingDto.CheckOut - createBookingDto.CheckIn).Days;
            if (numberOfNights <= 0)
            { throw new Exception("Check-out date must be after check-in date"); }

            // Check if room is already booked for the requested dates
            var hasConflict = await _context.Bookings
                .AnyAsync(b => b.RoomId == createBookingDto.RoomId
                    && (b.bookingStatus == BookingStatus.Confirmed || b.bookingStatus == BookingStatus.Pending)
                    && b.CheckInDate < createBookingDto.CheckOut
                    && b.CheckOutDate > createBookingDto.CheckIn);

            if (hasConflict)
            {
                throw new InvalidOperationException("This room is already booked for the selected dates. Please choose different dates or another room.");
            }

            var TotalAmount = pricePerNight * numberOfNights;
            var newBooking = new Booking
            {
                RoomId = createBookingDto.RoomId,
                UserId = UserId, // parameter from token
                CheckInDate = createBookingDto.CheckIn,
                CheckOutDate = createBookingDto.CheckOut,
                BookingDate = DateTime.UtcNow,
                TotalAmount = TotalAmount,
                bookingStatus = BookingStatus.Pending
            };
            await _context.Bookings.AddAsync(newBooking);
            await _context.SaveChangesAsync();
            return newBooking;
        }
        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId)
        {
            return await _context.Bookings.Where(b => b.UserId == userId)
                .Include(b => b.Room).ThenInclude(r => r.RoomType)
                .Include(b => b.Payment)
                .Include(b => b.Review)
                .Select(b => new BookingDto
                {
                    //booking props
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalCost = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    //room props
                    RoomNumber = b.Room.RoomNumber,
                    Floor = b.Room.Floor,
                    RoomTypeName = b.Room.RoomType.Name,
                    // Payment props
                    PaymentId = b.Payment != null ? b.Payment.PaymentId : null,
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A",
                    PaymentDate = b.Payment != null ? b.Payment.PaymentDate : null,
                    TransactionId = b.Payment != null ? b.Payment.TransactionId : null,
                    // Review status
                    HasReview = b.Review != null

                })
                .ToListAsync();
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room).ThenInclude(r => r.RoomType)
                .Include(b => b.Payment)
                .Include(b => b.Review)
                .Select(b => new BookingDto
                {
                    //booking props
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalCost = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    // User props (for admin)
                    UserEmail = b.User.Email,
                    UserFirstName = b.User.FirstName,
                    UserLastName = b.User.LastName,
                    //room props
                    RoomNumber = b.Room.RoomNumber,
                    Floor = b.Room.Floor,
                    RoomTypeName = b.Room.RoomType.Name,
                    // Payment props
                    PaymentId = b.Payment != null ? b.Payment.PaymentId : null,
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A",
                    PaymentDate = b.Payment != null ? b.Payment.PaymentDate : null,
                    TransactionId = b.Payment != null ? b.Payment.TransactionId : null,
                    // Review status
                    HasReview = b.Review != null
                })
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
        }

        public Task<BookingDto> GetBookingByIdAsync(int bookingId, string userId)
        {
            var booking = _context.Bookings
                .Where(b => b.BookingId == bookingId && b.UserId == userId)
                .Include(b => b.Room).ThenInclude(r => r.RoomType)
                .Include(b => b.Payment)
                .Include(b => b.Review)
                .Select(b => new BookingDto
                {
                    //booking props
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalCost = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    //room props
                    RoomNumber = b.Room.RoomNumber,
                    Floor = b.Room.Floor,
                    RoomTypeName = b.Room.RoomType.Name,
                    // Payment props
                    PaymentId = b.Payment != null ? b.Payment.PaymentId : null,
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A",
                    PaymentDate = b.Payment != null ? b.Payment.PaymentDate : null,
                    TransactionId = b.Payment != null ? b.Payment.TransactionId : null,
                    // Review status
                    HasReview = b.Review != null
                })
                .FirstOrDefaultAsync();
            return booking;
        }

        public async Task<Booking> GetBookingEntityByIdAsync(int bookingId, string userId)
        {
            return await _context.Bookings.FirstOrDefaultAsync(b => b.BookingId == bookingId && b.UserId == userId);
        }

        public async Task<Booking> UpdateBookingStatusAsync(int bookingId, BookingStatus newStatus)
        {
            // 1. ابحث عن الـ Entity الأصلية في الداتا بيز
            var bookingToUpdate = await _context.Bookings.FindAsync(bookingId);

            if (bookingToUpdate == null)
            {
                return null;
            }

            bookingToUpdate.bookingStatus = newStatus;

            // 4. (اختياري) إخبار الـ DbContext أن الحالة "تعدلت"
            _context.Entry(bookingToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return bookingToUpdate; // (ارجع "نجاح" - تم التعديل)
        }
        public async Task ConfirmPaymentAsync(int bookingId, string userId, string transactionId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var booking = await GetBookingEntityByIdAsync(bookingId, userId);
                    if (booking == null)
                        throw new KeyNotFoundException("Booking is not Found or user unauthorized");
                    if (booking.bookingStatus != BookingStatus.Pending)
                        throw new InvalidOperationException("Booking is already processed!");
                    // لو عدي من ال 2 check 
                    // يبقي كده الغرفة موجودة و الدفع لسا قيد الانتظار
                    var newPayment = new Payment
                    {
                        BookingId = booking.BookingId,
                        TransactionId = transactionId,
                        Amount = booking.TotalAmount,
                        PaymentDate = DateTime.Now,
                        Method = PaymentMethod.Stripe, // default
                        Status = PaymentStatus.Succeeded
                    };
                    await _context.Payments.AddAsync(newPayment);
                    //  update the booking status before saving the payment
                    booking.bookingStatus = BookingStatus.Confirmed;
                    _context.Entry(booking).State = EntityState.Modified;
                    // save both of them at once
                    await _context.SaveChangesAsync();
                    // لو كله نجح بنأكد الدفع
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw; // throw it to controller
                }
            }


        }
    }
}
