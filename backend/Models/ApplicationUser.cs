namespace backend.Models
{
    public class ApplicationUser:IdentityUser
    {
        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string LastName { get; set; }
        
        //Relationships
        public ICollection<Booking> Bookings { get; set; } // many bookings by one user
        public ICollection<Review> Reviews { get; set; }  // may reviews by one user
    }
}
