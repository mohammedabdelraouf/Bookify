namespace backend.Data.SeedData
{
    public static class RoomSeedData
    {
        public static List<Room> GetRooms()
        {
            return new List<Room>
            {
                // Standard Rooms (8 rooms: 101-108, Floor 1)
                new Room { RoomId = 1, RoomNumber = "101", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 2, RoomNumber = "102", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 3, RoomNumber = "103", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 4, RoomNumber = "104", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 5, RoomNumber = "105", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 6, RoomNumber = "106", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 7, RoomNumber = "107", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },
                new Room { RoomId = 8, RoomNumber = "108", Floor = 1, RoomTypeId = 1, status = RoomStatus.Available },

                // Deluxe Rooms (6 rooms: 201-206, Floor 2)
                new Room { RoomId = 9, RoomNumber = "201", Floor = 2, RoomTypeId = 2, status = RoomStatus.Available },
                new Room { RoomId = 10, RoomNumber = "202", Floor = 2, RoomTypeId = 2, status = RoomStatus.Available },
                new Room { RoomId = 11, RoomNumber = "203", Floor = 2, RoomTypeId = 2, status = RoomStatus.Available },
                new Room { RoomId = 12, RoomNumber = "204", Floor = 2, RoomTypeId = 2, status = RoomStatus.Available },
                new Room { RoomId = 13, RoomNumber = "205", Floor = 2, RoomTypeId = 2, status = RoomStatus.Available },
                new Room { RoomId = 14, RoomNumber = "206", Floor = 2, RoomTypeId = 2, status = RoomStatus.Available },

                // Suite Rooms (4 rooms: 301-304, Floor 3)
                new Room { RoomId = 15, RoomNumber = "301", Floor = 3, RoomTypeId = 3, status = RoomStatus.Available },
                new Room { RoomId = 16, RoomNumber = "302", Floor = 3, RoomTypeId = 3, status = RoomStatus.Available },
                new Room { RoomId = 17, RoomNumber = "303", Floor = 3, RoomTypeId = 3, status = RoomStatus.Available },
                new Room { RoomId = 18, RoomNumber = "304", Floor = 3, RoomTypeId = 3, status = RoomStatus.Available },

                // Presidential Rooms (2 rooms: 401-402, Floor 4)
                new Room { RoomId = 19, RoomNumber = "401", Floor = 4, RoomTypeId = 4, status = RoomStatus.Available },
                new Room { RoomId = 20, RoomNumber = "402", Floor = 4, RoomTypeId = 4, status = RoomStatus.Available }
            };
        }
    }
}
