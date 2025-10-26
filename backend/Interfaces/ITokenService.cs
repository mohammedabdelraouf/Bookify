using backend.Models;

namespace backend.Interfaces
{
    public interface ITokenService
    {
        // هذه الميثود ستأخذ بيانات المستخدم والأدوار الخاصة به
        // وترجع "string" وهو الـ Token
        string CreateToken(ApplicationUser user, List<string> roles);
    }
}
