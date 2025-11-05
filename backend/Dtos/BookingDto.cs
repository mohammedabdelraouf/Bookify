namespace backend.Dtos
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

        // from Room navigation property
        public string RoomNumber { get; set; }
        public int Floor { get; set; }
        // from RoomType navigation property
        public string RoomTypeName { get; set; }
        // from payment navigation property
        public string PaymentMethod { get; set; } // (Stripe, CashOnArrival)
        public string PaymentStatus { get; set; } // (Succeeded, Pending, Failed)
    }
}
