namespace backend.Dtos
{
    public class UserWithRolesDto
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
