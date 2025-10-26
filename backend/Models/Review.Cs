using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }
        [Required]
        [Range(1,5)]
        public int Rating { get; set; }
        public string? Comment { get; set; }
        [Required]
        public DateTime ReviewDate { get; set; }

        //relationship with the user one user to many reviews
        [Required]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        // relationship with the book one to one
        [Required]
        public int BookId { get; set; }
        [ForeignKey("BookId")]
        public Booking Book { get; set; }
    }
}
