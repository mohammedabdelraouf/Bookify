namespace backend.Data.SeedData
{
    public static class RoomImageSeedData
    {
        public static List<RoomImage> GetRoomImages()
        {
            var images = new List<RoomImage>();
            int imageId = 1;

            // Define available Cloudinary images
            var cloudinaryImages = new List<(string Url, string PublicId)>
            {
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004494/cld-sample.jpg", "cld-sample"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004493/cld-sample-2.jpg", "cld-sample-2"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004494/cld-sample-3.jpg", "cld-sample-3"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004494/cld-sample-4.jpg", "cld-sample-4"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004494/cld-sample-5.jpg", "cld-sample-5"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004494/main-sample.png", "main-sample"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763100880/rooms/1/jkg6dmaxua3xob0yf6zc.jpg", "rooms/1/jkg6dmaxua3xob0yf6zc"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763107615/rooms/2/gri5mktfci5dfezpsvos.jpg", "rooms/2/gri5mktfci5dfezpsvos"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763130969/rooms/2/nuspny4ibnalni5lpuqx.jpg", "rooms/2/nuspny4ibnalni5lpuqx"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004490/samples/dessert-on-a-plate.jpg", "samples/dessert-on-a-plate"),
                ("https://res.cloudinary.com/dr8j0welk/image/upload/v1763004489/samples/cup-on-a-table.jpg", "samples/cup-on-a-table")
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
                        ImageId = imageId++,
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
