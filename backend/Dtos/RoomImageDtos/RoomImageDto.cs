namespace backend.Dtos.RoomImageDtos
{
    public class RoomImageDto
    {
        public int ImageId { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; }
    }
}
