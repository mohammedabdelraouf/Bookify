using backend.Enums;
using backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Dtos
{
    public class BookingDto
    {
        public DateTime CheckInDate { get; set; }
   
        public DateTime CheckOutDate { get; set; }

        public DateTime BookingDate { get; set; }
       
        public decimal TotalAmount { get; set; }
     
        public BookingStatus bookingStatus { get; set; } = BookingStatus.Pending;

        // --------------- Relationships ----------------

        //public string UserId { get; set; }
        //public ApplicationUser User { get; set; } // many bookings by one user
        //public int RoomId { get; set; }
        public Payment Payment { get; set; } //one booking to one payment
        //public Review Review { get; set; } // one booking to one review
    }
}
