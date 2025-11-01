using backend.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }
        [Required]
        [MaxLength(20)]
        public string RoomNumber { get; set; }=string.Empty;
        [Required]
        public int Floor { get; set; }
        public RoomStatus status { get; set; } = RoomStatus.Available;
        [Required]
        
        public int RoomTypeId { get; set; }
        [ForeignKey("RoomTypeId")]
        public RoomType? RoomType { get; set; } // one room type to many rooms
        public ICollection<Booking>? Bookings { get; set; } //many booking for same room ( the history of room booking )
    }
}
