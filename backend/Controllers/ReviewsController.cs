using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ReviewsController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;
        public ReviewsController(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReviewAsync([FromBody] CreateReviewDto createReviewDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }
            try 
            {
                var newreviewDto = await _reviewRepository.CreateReviewAsync(createReviewDto, userId);
                return Ok(newreviewDto);

            }
            catch(KeyNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
            catch(InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch(Exception)
            {
                return StatusCode(500, "An unexpected error occurred while creating the review.");
            }
        }
        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetReviewsByRoomIdAsync(int roomId)
        {
            var reviews = await _reviewRepository.GetReviewsByRoomIdAsync(roomId);
            return Ok(reviews);
        }
        // --- 3. Endpoint: حذف تقييم (للأدمن فقط) ---
        // DELETE: /api/reviews/10
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // (محمي للأدمن فقط)
        public async Task<IActionResult> DeleteReview(int id)
        {
            var result = await _reviewRepository.DeleteReviewAsync(id);

            if (!result)
            {
                // لو المطبخ قال "false" (ملقاش الريفيو)
                return NotFound($"Review with ID {id} not found.");
            }

            // لو المطبخ قال "true" (تم الحذف)
            return NoContent();
        }

    }
}
