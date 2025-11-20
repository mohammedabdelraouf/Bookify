using backend.Dtos.RoomDtos;
using backend.Dtos.RoomImageDtos;
using backend.RepositoryPattern.Interfaces;

namespace backend.RepositoryPattern.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly BookifyDbContext _context;
        public RoomRepository(BookifyDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
        {
            return await _context.Rooms.
                 Include(R => R.RoomType) //eager loading to avoid null values for RoomType properties
                 .Include(r => r.RoomImages) // eager loading to include room images
                 .Select(r => new RoomDto { // converting the entity to dto so the front end can handle them
                     roomId = r.RoomId,
                     roomNumber = r.RoomNumber,
                     floor = r.Floor,
                     Status = r.status.ToString(),
                     roomTypeName = r.RoomType.Name,
                     roomTypeDescription = r.RoomType.Description,
                     roomTypeCapacity = r.RoomType.Capacity,
                     roomTypePricePerNight = r.RoomType.PricePerNight,
                     Images = r.RoomImages!.Select(img => new RoomImageDto
                     {
                         ImageId = img.ImageId,
                         Url = img.ImageUrl,
                         IsMain = img.IsMain
                     }).ToList()
                 }).ToListAsync();
        }
        public async Task<RoomDto?> GetRoomDtoByIdAsync(int roomId)
        {
            return await _context.Rooms.Include(R => R.RoomType)
                .Include(r => r.RoomImages).Where(r=>r.RoomId==roomId)
                .Select(r => new RoomDto
                {
                    roomId = r.RoomId,
                    roomNumber = r.RoomNumber,
                    floor = r.Floor,
                    Status = r.status.ToString(),
                    roomTypeName = r.RoomType.Name,
                    roomTypeDescription = r.RoomType.Description,
                    roomTypeCapacity = r.RoomType.Capacity,
                    roomTypePricePerNight = r.RoomType.PricePerNight,
                    Images = r.RoomImages!.Select(img => new RoomImageDto
                    {
                        ImageId = img.ImageId,
                        Url = img.ImageUrl,
                        IsMain = img.IsMain
                    }).ToList()
                }).FirstOrDefaultAsync(r => r.roomId == roomId);
        }
        //Admin methods

        // getting the real entity from DB not the dto so admin can modify
        public async Task<Room> GetRoomEntityByIdAsync(int roomId)
        {
            return await _context.Rooms.FindAsync(roomId);
        }
        public async Task AddRoomAsync(Room room)
        {
            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateRoomAsync(int id,UpdateRoomDto UpdateroomDto)
        {
            var UpdatedRoom = await _context.Rooms.FindAsync(id);
            if (UpdatedRoom != null) {
                UpdatedRoom.RoomNumber = UpdateroomDto.RoomNumber;
                UpdatedRoom.Floor = UpdateroomDto.Floor;
                UpdatedRoom.status = UpdateroomDto.status;
                UpdatedRoom.RoomTypeId = UpdateroomDto.RoomTypeId;
                _context.Entry(UpdatedRoom).State = EntityState.Modified; // so the DbContext follow the new updates and add them
                await _context.SaveChangesAsync();
            }

        }

        public async Task<bool> DeleteRoomAsync(int roomId)
        {
            var RoomExist =await GetRoomEntityByIdAsync(roomId);
            if (RoomExist is not null) {
                _context.Rooms.Remove(RoomExist);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        // room images
        public async Task AddRoomImageAsync(int roomId, RoomImage image)
        {
            image.RoomId = roomId;
            await _context.RoomImages.AddAsync(image);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteRoomImageAsync(int imageId)
        {
            var img = await _context.RoomImages.FindAsync(imageId);
            if(img != null)
            {
                _context.RoomImages.Remove(img);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<RoomImage?> GetRoomImageByIdAsync(int imageId)
        {
            return await _context.RoomImages.FirstOrDefaultAsync(i => i.ImageId == imageId);
        }
        public async Task<Room?> GetRoomWithImagesAsync(int roomId) 
        {
            return await _context.Rooms
                .Include(r => r.RoomImages).Include(r => r.RoomType)
                .FirstOrDefaultAsync(r => r.RoomId == roomId);
        }
    }
}
