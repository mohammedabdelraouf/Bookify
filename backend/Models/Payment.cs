using backend.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        [Required]
        public DateTime PaymentDate { get; set; } 
        [Required]
        public PaymentMethod Method { get; set; }
        [Required]
        public PaymentStatus Status { get; set; }
        // هذا الحقل لتخزين رقم العملية من Stripe
        public string? TransactionId { get; set; } // اختياري (nullable)

        // --- Foreign Key & Navigation Property for Booking ---
        // هذه العلاقة هي One-to-One

        [Required]
        public int BookingId { get; set; } // <-- المفتاح الأجنبي لـ Booking

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; } // <-- Navigation Property
    }
}
