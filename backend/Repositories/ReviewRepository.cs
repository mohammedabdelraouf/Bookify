
namespace backend.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly BookifyDbContext _context;
        public ReviewRepository(BookifyDbContext context)
        {
            _context = context;
        }
        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto reviewDto, string UserId)
        {
            var booking =await _context.Bookings.Include(b=>b.User)
                .FirstOrDefaultAsync(b=>b.BookingId == reviewDto.BookingId && b.UserId == UserId);
            if(booking == null)
            {
                throw new KeyNotFoundException("Booking not found or does not belong to the user.");
            }
            if(booking.bookingStatus != BookingStatus.Confirmed)
            {
                throw new InvalidOperationException("Cannot review a booking that is not confirmed.");
            }
            var existingReview = await _context.Reviews
                                     .FirstOrDefaultAsync(r => r.BookingId == reviewDto.BookingId);
            if (existingReview != null)
            {
                throw new InvalidOperationException("This booking has already been reviewed.");
            }
            var newReview = new Review
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                ReviewDate = DateTime.UtcNow,
                UserId = UserId,
                BookingId = reviewDto.BookingId
            };
            await _context.Reviews.AddAsync(newReview);
            await _context.SaveChangesAsync();
            // Maping the real entity to return Dto type
            
            return new ReviewDto
            {
                ReviewId = newReview.ReviewId,
                Rating = newReview.Rating,
                Comment = newReview.Comment,
                ReviewDate = newReview.ReviewDate,
                AuthorName = booking.User.FirstName
            };
        }
        public async Task<IEnumerable<ReviewDto>> GetReviewsByRoomIdAsync(int roomId)
        {
            return await _context.Reviews
                .Where(r => r.Booking.RoomId == roomId)
                .Include(r => r.User).Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate,
                    AuthorName = r.User.FirstName
                }).ToListAsync();
        }

        public async Task<bool> DeleteReviewAsync(int reviewId)
        {
            var ReviewToDelete = await _context.Reviews.FindAsync(reviewId);
            if (ReviewToDelete == null)
            {
                return false;
            }
            _context.Reviews.Remove(ReviewToDelete);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
