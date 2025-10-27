namespace backend.OptionsPattern.Settings
{
    public class JWTSettings
    {
        public const string SectionName = "JWT";

        public string Secret { get; set; }
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
        public int ExpiryInDays { get; set; }
    }
}
