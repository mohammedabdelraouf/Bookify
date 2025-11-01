using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.OptionsPattern.Settings;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

// telling the app to use the ApplicationUser and IdentityRole for identity management
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BookifyDbContext>().AddDefaultTokenProviders(); // here to store all the user information in the database BookifyDbContext

// add DbContext service to the application
builder.Services.AddDbContext<BookifyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// bind the JWT settings from appsettings.json
builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection(JWTSettings.SectionName));
var jwtSettings = new JWTSettings();
builder.Configuration.GetSection(JWTSettings.SectionName).Bind(jwtSettings);
//--- الجزء ده لسا هذاكره --------------------------------------------------
// --- 3. إعداد الـ Authentication والـ JWT (لـ React) ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; //scheme for 401 error
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
//الجزء ده علشان اعرفه مكان ال key و ازاي هيعمل validation للتوكن
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // خليه false في التطوير بس
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = jwtSettings.ValidAudience,
        ValidIssuer = jwtSettings.ValidIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
    };
});
//---------------------------------------------------------------------------
builder.Services.AddControllers();// this line is for directing the request to controllers
builder.Services.AddEndpointsApiExplorer(); // <-- بديل/أفضل من AddOpenApi
builder.Services.AddSwaggerGen(); // <-- بيولد ملف Swagger

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>(); 
var app = builder.Build();

// adding the rules of the user

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    string[] roles = { "Admin", "Customer"};
    foreach (var role in roles)
    {
        var roleExist = await roleManager.RoleExistsAsync(role);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // <-- بيشغل Swagger
    app.UseSwaggerUI(); // <-- بيعمل صفحة الـ UI لـ Swagger
}
// this middleware to redirect http request to https
app.UseHttpsRedirection();

// --- 6. إضافة الـ Authentication (مهم جداً!) ---
app.UseAuthentication(); // <-- لازم ييجي قبل الـ Authorization // لان اصلا الطبيعي انا بشوف انت مسموح تسنخدم السيستم ولا لا

// this middleware to use authorization verification of user roles
app.UseAuthorization();
// this line is for directing the request to controllers
app.MapControllers();

app.Run();
