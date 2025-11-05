namespace backend.Dtos
{
    public class CreateBookingDto
    {
        // user ID will come from the JWT token, so no need to include it here
        public int RoomId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        // Price per night will be fetched from the room details (RoomRepository) on the server side
        // No Cost or amount field here; it will be calculated on the server side
    }
}
