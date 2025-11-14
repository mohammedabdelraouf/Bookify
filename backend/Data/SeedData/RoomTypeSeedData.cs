namespace backend.Data.SeedData
{
    public static class RoomTypeSeedData
    {
        public static List<RoomType> GetRoomTypes()
        {
            return new List<RoomType>
            {
                new RoomType
                {
                    Name = "Standard",
                    Capacity = 2,
                    PricePerNight = 80,
                    Description = "Cozy room with essential amenities including a comfortable bed, private bathroom, and free Wi-Fi. Perfect for budget-conscious travelers."
                },
                new RoomType
                {
                    Name = "Deluxe",
                    Capacity = 3,
                    PricePerNight = 150,
                    Description = "Spacious room with premium amenities including a king-size bed, mini-bar, flat-screen TV, and city view. Ideal for couples or small families."
                },
                new RoomType
                {
                    Name = "Suite",
                    Capacity = 4,
                    PricePerNight = 250,
                    Description = "Luxurious suite with separate living area, kitchenette, premium bedding, and stunning views. Perfect for families or extended stays."
                },
                new RoomType
                {
                    Name = "Presidential",
                    Capacity = 6,
                    PricePerNight = 500,
                    Description = "Ultimate luxury suite with panoramic views, Jacuzzi, private terrace, and personalized concierge service. The pinnacle of comfort and elegance."
                }
            };
        }
    }
}
