using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class RoomType
    {
        [Key]
        public int RoomTypeId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }=string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        public int Capacity { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerNight { get; set; }
        public ICollection<Room> Rooms { get; set; } // many rooms can have same room type

    }
}
