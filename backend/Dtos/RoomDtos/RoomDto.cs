using backend.Dtos.RoomImageDtos;

namespace backend.Dtos.RoomDtos
{
    public class RoomDto
    {
        public int roomId { get; set; }
        public string roomNumber { get; set; } = string.Empty;
        public int floor { get; set; }
        public string Status { get; set; } = string.Empty;

        // flatted from RoomType --> this will make it easier for front-end to consume the data
        public string roomTypeName { get; set; } = string.Empty;
        public string? roomTypeDescription { get; set; }
        public int roomTypeCapacity { get; set; }
        public decimal roomTypePricePerNight { get; set; }
        // list of image urls
        public List<RoomImageDto> Images { get; set; } = new List<RoomImageDto>();
    }
}
