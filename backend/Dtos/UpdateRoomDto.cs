namespace backend.Dtos
{
    public class UpdateRoomDto
    {
        [Required]
        [MaxLength(20)]
        public string RoomNumber { get; set; } = string.Empty;
        [Required]
        public int Floor { get; set; }
        public RoomStatus status { get; set; } = RoomStatus.Available;
        [Required]

        public int RoomTypeId { get; set; } // To change Room Type if needed
    }
}
