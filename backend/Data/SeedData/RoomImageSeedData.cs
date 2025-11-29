namespace backend.Data.SeedData
{
    public static class RoomImageSeedData
    {
        public static List<RoomImage> GetRoomImages()
        {
            var images = new List<RoomImage>();

            // Define hotel room images from Unsplash
            var cloudinaryImages = new List<(string Url, string PublicId)>
            {
                // Modern hotel rooms
                ("https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80", "modern-hotel-room-1"),
                ("https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", "luxury-bedroom-1"),
                ("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", "hotel-suite-1"),

                // Standard rooms
                ("https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", "standard-room-1"),
                ("https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", "standard-room-2"),
                ("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", "cozy-room-1"),

                // Deluxe rooms
                ("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80", "deluxe-room-1"),
                ("https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", "deluxe-room-2"),
                ("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", "modern-bedroom-1"),

                // Suite rooms
                ("https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80", "suite-room-1"),
                ("https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80", "suite-room-2"),
                ("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", "luxury-suite-1"),

                // Presidential/Luxury rooms
                ("https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", "presidential-room-1"),
                ("https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80", "luxury-room-1"),
                ("https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80", "elegant-room-1")
            };

            // Assign 3-4 images to each of the 20 rooms
            for (int roomId = 1; roomId <= 20; roomId++)
            {
                int imagesPerRoom = (roomId <= 8) ? 3 : 4; // Standard rooms get 3, others get 4

                for (int i = 0; i < imagesPerRoom; i++)
                {
                    // Cycle through available images
                    var imageIndex = ((roomId - 1) * imagesPerRoom + i) % cloudinaryImages.Count;
                    var (url, publicId) = cloudinaryImages[imageIndex];

                    images.Add(new RoomImage
                    {
                        // Don't set ImageId - let database auto-generate it
                        RoomId = roomId,
                        ImageUrl = url,
                        PublicId = publicId,
                        IsMain = (i == 0) // First image is main
                    });
                }
            }

            return images;
        }
    }
}
