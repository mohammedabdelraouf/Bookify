using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Interfaces;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// add DbContext service to the application
builder.Services.AddDbContext<BookifyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// telling the app to use the ApplicationUser and IdentityRole for identity management
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BookifyDbContext>().AddDefaultTokenProviders(); // here to store all the user information in the database BookifyDbContext


//--- الجزء ده لسا هذاكره --------------------------------------------------
// --- 3. إعداد الـ Authentication والـ JWT (لـ React) ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // خليه false في التطوير بس
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});
//---------------------------------------------------------------------------
builder.Services.AddControllers();// this line is for directing the request to controllers
builder.Services.AddEndpointsApiExplorer(); // <-- بديل/أفضل من AddOpenApi
builder.Services.AddSwaggerGen(); // <-- بيولد ملف Swagger

builder.Services.AddScoped<ITokenService, TokenService>(); // <-- تسجيل خدمة الـ TokenService
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
app.UseAuthentication(); // <-- لازم ييجي قبل الـ Authorization

// this middleware to use authorization verification of user roles
app.UseAuthorization();
// this line is for directing the request to controllers
app.MapControllers();

app.Run();
