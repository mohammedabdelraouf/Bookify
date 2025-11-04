namespace backend.Dtos
{
    public class RoomTypeDto
    {
        public int RoomTypeIdDto { get; set; }
        [Required]
        [MaxLength(100)]
        public string RoomTypeNameDto { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? RoomTypeDescriptionDto { get; set; }
        [Required]
        public int RoomTypeCapacityDto { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal RoomTypePricePerNightDto { get; set; }
    }
}
