namespace backend.Dtos.ReviewDtos
{
    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public int Rating { get; set; } 
        public string? Comment { get; set; }
        public DateTime ReviewDate { get; set; }

        // ----- بيانات مدمجة من ApplicationUser -----
        // (علشان نعرض "مين" اللي كتب التقييم)
        public string AuthorName { get; set; }
    }
}
