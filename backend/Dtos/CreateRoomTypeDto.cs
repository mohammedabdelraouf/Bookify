namespace backend.Dtos
{
    public class CreateRoomTypeDto
    {
        [Required]
        [MaxLength(100)]
        public string RoomTypeName { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        [Range(1,5)] 
        public int Capacity { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(10.0, 10000.0)] 
        public decimal PricePerNight { get; set; }
    }
}
