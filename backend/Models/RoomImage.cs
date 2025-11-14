namespace backend.Models
{
    public class RoomImage
    {
        [Key]
        public int ImageId { get; set; }
        [Required]
        public string ImageUrl { get; set; }= string.Empty;
        // Cloudinary public id (used for deleting)
        public string? PublicId { get; set; }
        public bool IsMain { get; set; } = false;

        [Required]
        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; }
    }
}
