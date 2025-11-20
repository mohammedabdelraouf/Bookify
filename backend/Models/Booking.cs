using backend.Models.Enums;

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

        // --------------- Relationships ----------------
        [Required]
        public string UserId { get; set; } 

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } // many bookings by one user

        [Required]
        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; } // one room can have many bookings ( the history of room booking )

        public Payment Payment { get; set; } //one booking to one payment

        public Review Review { get; set; } // one booking to one review
    }
}
