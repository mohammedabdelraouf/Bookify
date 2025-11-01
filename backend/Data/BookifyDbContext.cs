using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class BookifyDbContext: IdentityDbContext<ApplicationUser>
    {
        
        public BookifyDbContext(DbContextOptions<BookifyDbContext> options): base(options)
        {
        }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ----- convert all the enums to string -----
            
            builder.Entity<Room>()
                .Property(r => r.status).HasConversion<string>();// Storing the RoomStatus enum as string in the database

            builder.Entity<Booking>()
                .Property(b => b.bookingStatus).HasConversion<string>();// Storing the BookingStatus enum as string in the database

            builder.Entity<Payment>()
                .Property(p => p.Method).HasConversion<string>(); // Storing the PaymentMethod enum as string in the database
            builder.Entity<Payment>()
                .Property(p => p.Status).HasConversion<string>();// Storing the PaymentStatus enum as string in the database

            //-----------------relationships-----------------------
            builder.Entity<Booking>()
                .HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<Payment>(p => p.BookingId); 

            // booking - review one to one
            builder.Entity<Booking>()
                .HasOne(b=>b.Review).WithOne(r=>r.Booking)
                .HasForeignKey<Review>(r=>r.BookingId)
                .OnDelete(DeleteBehavior.Restrict); //DeleteBehavior.Restrict: يمنع حذف حجز (Booking) إذا كان مرتبطاً بريفيو (Review). هذا يحافظ على سجلاتك.

            // user - review one to many
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Reviews)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade); //DeleteBehavior.Cascade: إذا تم حذف مستخدم (User)، يتم حذف جميع الريفيوهات المرتبطة به تلقائياً.
        }
    }
}
