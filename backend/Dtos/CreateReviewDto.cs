namespace backend.Dtos
{
    public class CreateReviewDto
    {
        [Required]
        public int BookingId { get; set; } 

        [Required]
        [Range(1, 5)] 
        public int Rating { get; set; }

        [MaxLength(1500)]
        public string? Comment { get; set; } 
    }
}
