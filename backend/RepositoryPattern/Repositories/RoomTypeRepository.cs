using backend.Dtos.RoomTypeDtos;
using backend.RepositoryPattern.Interfaces;

namespace backend.RepositoryPattern.Repositories
{
    public class RoomTypeRepository : IRoomTypeRepository
    {
        private readonly BookifyDbContext _context;
        public RoomTypeRepository(BookifyDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<RoomTypeDto>> GetAllRoomTypesAsync()
        {
           return await _context.RoomTypes.Select(rt => new RoomTypeDto
            {
                RoomTypeIdDto = rt.RoomTypeId,
                RoomTypeNameDto = rt.Name,
                RoomTypeDescriptionDto = rt.Description,
                RoomTypeCapacityDto = rt.Capacity,
                RoomTypePricePerNightDto = rt.PricePerNight
            }).ToListAsync();
        }
        public async Task<RoomTypeDto?> GetRoomTypeDtoByIdAsync(int roomTypeId)
        {
            return await _context.RoomTypes.Select(Rt=> new RoomTypeDto { 
                RoomTypeIdDto = Rt.RoomTypeId,
                RoomTypeNameDto = Rt.Name,
                RoomTypeDescriptionDto = Rt.Description,
                RoomTypeCapacityDto = Rt.Capacity,
                RoomTypePricePerNightDto = Rt.PricePerNight
            }).FirstOrDefaultAsync(rtId => rtId.RoomTypeIdDto ==  roomTypeId);
        }
        public async Task<RoomType> GetRoomEntityByIdAsync(int roomTypeId)
        {
            return await _context.RoomTypes.FindAsync(roomTypeId);
        }
        public async Task AddRoomTypeAsync(CreateRoomTypeDto roomTypeDto)
        {
            var newRoomType = new RoomType
            {
                Name = roomTypeDto.RoomTypeName,
                Description = roomTypeDto.Description,
                Capacity = roomTypeDto.Capacity,
                PricePerNight = roomTypeDto.PricePerNight,
            };
            await _context.RoomTypes.AddAsync(newRoomType);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateRoomTypeAsync(int roomTypeId, CreateRoomTypeDto roomTypeDto)
        {
            var RoomTypeUpdate = _context.RoomTypes.Find(roomTypeId);
            if (RoomTypeUpdate != null)
            {
                RoomTypeUpdate.Name = roomTypeDto.RoomTypeName;
                RoomTypeUpdate.Description = roomTypeDto.Description;
                RoomTypeUpdate.Capacity = roomTypeDto.Capacity;
                RoomTypeUpdate.PricePerNight = roomTypeDto.PricePerNight;
                _context.Entry(RoomTypeUpdate).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException($"RoomType with ID {roomTypeId} not found.");
            }
        }

        public async Task<bool> DeleteRoomTypeAsync(int roomTypeId)
        {
            var RoomExist = await _context.RoomTypes.FindAsync(roomTypeId);
            if(RoomExist is null)
            {
                return false;
            }
            _context.RoomTypes.Remove(RoomExist);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
