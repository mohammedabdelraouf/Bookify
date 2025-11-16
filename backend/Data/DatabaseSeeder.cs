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
            // Check if room types exist (main check)
            bool roomTypesExist = await _context.RoomTypes.AnyAsync();

            // Always reseed room images with latest Cloudinary URLs
            if (await _context.RoomImages.AnyAsync())
            {
                Console.WriteLine("Clearing old room images...");
                _context.RoomImages.RemoveRange(await _context.RoomImages.ToListAsync());
                await _context.SaveChangesAsync();
            }

            if (roomTypesExist)
            {
                Console.WriteLine("Database already seeded (except images). Reseeding images with Cloudinary URLs...");

                // Reseed only room images
                var newRoomImages = RoomImageSeedData.GetRoomImages();
                await _context.RoomImages.AddRangeAsync(newRoomImages);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Reseeded {newRoomImages.Count} room images with Cloudinary URLs.");
                return;
            }

            Console.WriteLine("Starting database seeding...");

            // Seed RoomTypes first (no dependencies)
            var roomTypes = RoomTypeSeedData.GetRoomTypes();
            await _context.RoomTypes.AddRangeAsync(roomTypes);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Seeded {roomTypes.Count} room types.");

            // Reload room types from DB to get auto-generated IDs
            var dbRoomTypes = await _context.RoomTypes.ToListAsync();
            var standardType = dbRoomTypes.First(rt => rt.Name == "Standard");
            var deluxeType = dbRoomTypes.First(rt => rt.Name == "Deluxe");
            var suiteType = dbRoomTypes.First(rt => rt.Name == "Suite");
            var presidentialType = dbRoomTypes.First(rt => rt.Name == "Presidential");

            // Seed Rooms with correct RoomTypeIds
            var rooms = new List<Room>();
            
            // Standard Rooms (8 rooms: 101-108, Floor 1)
            for (int i = 1; i <= 8; i++)
            {
                rooms.Add(new Room { RoomNumber = $"10{i}", Floor = 1, RoomTypeId = standardType.RoomTypeId, status = RoomStatus.Available });
            }
            
            // Deluxe Rooms (6 rooms: 201-206, Floor 2)
            for (int i = 1; i <= 6; i++)
            {
                rooms.Add(new Room { RoomNumber = $"20{i}", Floor = 2, RoomTypeId = deluxeType.RoomTypeId, status = RoomStatus.Available });
            }
            
            // Suite Rooms (4 rooms: 301-304, Floor 3)
            for (int i = 1; i <= 4; i++)
            {
                rooms.Add(new Room { RoomNumber = $"30{i}", Floor = 3, RoomTypeId = suiteType.RoomTypeId, status = RoomStatus.Available });
            }
            
            // Presidential Rooms (2 rooms: 401-402, Floor 4)
            for (int i = 1; i <= 2; i++)
            {
                rooms.Add(new Room { RoomNumber = $"40{i}", Floor = 4, RoomTypeId = presidentialType.RoomTypeId, status = RoomStatus.Available });
            }

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
