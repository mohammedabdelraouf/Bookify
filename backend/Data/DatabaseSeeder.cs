using backend.Data.SeedData;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DatabaseSeeder
    {
        private readonly BookifyDbContext _context;

        public DatabaseSeeder(BookifyDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Check if data already exists (idempotent operation)
            if (await _context.RoomTypes.AnyAsync())
            {
                Console.WriteLine("Database already seeded. Skipping seed operation.");
                return;
            }

            Console.WriteLine("Starting database seeding...");

            // Seed RoomTypes first (no dependencies)
            var roomTypes = RoomTypeSeedData.GetRoomTypes();
            await _context.RoomTypes.AddRangeAsync(roomTypes);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {roomTypes.Count} room types.");

            // Seed Rooms (depends on RoomTypes)
            var rooms = RoomSeedData.GetRooms();
            await _context.Rooms.AddRangeAsync(rooms);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {rooms.Count} rooms.");

            // Seed RoomImages (depends on Rooms)
            var roomImages = RoomImageSeedData.GetRoomImages();
            await _context.RoomImages.AddRangeAsync(roomImages);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {roomImages.Count} room images.");

            Console.WriteLine("Database seeding completed successfully!");
        }
    }
}
