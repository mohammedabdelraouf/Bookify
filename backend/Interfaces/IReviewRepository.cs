namespace backend.Interfaces
{
    public interface IReviewRepository
    {
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto reviewDto, string UserId);
        // showing all the reviews for a specific room
        Task<IEnumerable<ReviewDto>> GetReviewsByRoomIdAsync(int roomId);
        Task<bool> DeleteReviewAsync(int reviewId);
    }
}
