namespace backend.Services
{
    public class TokenService : ITokenService
    {
        private readonly JWTSettings _jwtSettings;
        private readonly SymmetricSecurityKey _key;      // to store the secret key
        public TokenService(IOptions<JWTSettings> jWTSettings)
        {
            _jwtSettings = jWTSettings.Value;
            //here we get the secret key from appSetting.json and hashing it
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)); 
        }
        public string CreateToken(ApplicationUser user, List<string> roles)
        {
            // 1. إعداد الـ "Claims" (المعلومات التي نريد وضعها داخل التوكن)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            // إضافة الأدوار (Roles) إلى الـ Claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }


            // 2. إعداد الـ "Credentials" (توقيع التوكن بالمفتاح السري)
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            // 3. إعداد وصف التوكن (Token Descriptor)
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
               
                Issuer = _jwtSettings.ValidIssuer, //server url
                Audience = _jwtSettings.ValidAudience, // frontend framework url
                Expires = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryInHours),
                SigningCredentials = creds
            };

            // 4. إنشاء التوكن
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // 5. إرجاع التوكن كـ string
            return tokenHandler.WriteToken(token);
        
        }
    }
}
