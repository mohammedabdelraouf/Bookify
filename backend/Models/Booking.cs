using backend.Enums;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        [Required]
        public DateTime CheckInDate { get; set; }
        [Required]
        public DateTime CheckOutDate { get; set; }
        [Required]
        public DateTime BookingDate { get; set; } 
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        [Required]
        public BookingStatus bookingStatus { get; set; } = BookingStatus.Pending;
        [Required]
        public string UserId { get; set; } // <-- المفتاح الأجنبي لـ IdentityUser

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } // <-- Navigation Property

        // --- Foreign Key & Navigation Property for Room ---
        [Required]
        public int RoomId { get; set; } // <-- المفتاح الأجنبي لـ Room

        [ForeignKey("RoomId")]
        public Room Room { get; set; } // <-- Navigation Property

        // --- Navigation Property for Payment ---
        // الحجز الواحد له عملية دفع واحدة
        public Payment Payment { get; set; }

        // relationship with the review one to one
        public Review Review { get; set; }
    }
}
