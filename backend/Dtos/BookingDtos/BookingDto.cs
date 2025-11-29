namespace backend.Dtos.BookingDtos
{
    // ايصال الحجز
    // to pass for checkout page and booking confirmation
    public class BookingDto
    {
        
        public int BookingId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalCost { get; set; }
        public string Status { get; set; } // (Pending, Confirmed, Successed, Failed)

        // User info (for admin views)
        public string? UserEmail { get; set; }
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }

        // from Room navigation property
        public string RoomNumber { get; set; }
        public int Floor { get; set; }
        // from RoomType navigation property
        public string RoomTypeName { get; set; }
        // from payment navigation property
        public int? PaymentId { get; set; }
        public string PaymentMethod { get; set; } // (Stripe, CashOnArrival)
        public string PaymentStatus { get; set; } // (Succeeded, Pending, Failed)
        public DateTime? PaymentDate { get; set; }
        public string? TransactionId { get; set; }

        // Review status
        public bool HasReview { get; set; } // true if user has already reviewed this booking
    }
}
