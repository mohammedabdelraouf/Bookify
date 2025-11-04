namespace backend.Repositories
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
                 .Select(r => new RoomDto { // converting the entity to dto so the front end can handle them
                     roomId = r.RoomId,
                     roomNumber = r.RoomNumber,
                     floor = r.Floor,
                     Status = r.status.ToString(),
                     roomTypeName = r.RoomType.Name,
                     roomTypeDescription = r.RoomType.Description,
                     roomTypeCapacity = r.RoomType.Capacity,
                     roomTypePricePerNight = r.RoomType.PricePerNight
                 }).ToListAsync();
        }
        public async Task<RoomDto?> GetRoomDtoByIdAsync(int roomId)
        {
            return await _context.Rooms.Include(R => R.RoomType)
                .Select(r => new RoomDto
                {
                    roomId = r.RoomId,
                    roomNumber = r.RoomNumber,
                    floor = r.Floor,
                    Status = r.status.ToString(),
                    roomTypeName = r.RoomType.Name,
                    roomTypeDescription = r.RoomType.Description,
                    roomTypeCapacity = r.RoomType.Capacity,
                    roomTypePricePerNight = r.RoomType.PricePerNight
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
    }
}
