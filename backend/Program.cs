

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

// telling the app to use the ApplicationUser and IdentityRole for identity management
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<BookifyDbContext>().AddDefaultTokenProviders(); // here to store all the user information in the database BookifyDbContext

// add DbContext service to the application
builder.Services.AddDbContext<BookifyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//bind the cloudinary settings from appsettings.json
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection(CloudinarySettings.SectionName));
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

// Add CORS policy to allow frontend (React) to access the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();// this line is for directing the request to controllers
builder.Services.AddEndpointsApiExplorer(); // <-- بديل/أفضل من AddOpenApi
builder.Services.AddSwaggerGen(options =>
{
// 1. تعريف نظام الأمان (Security Definition)
// هنا بنقول لـ Swagger: "إحنا عندنا نظام أمان اسمه 'Bearer'"
options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
{
    Name = "Authorization", // اسم الـ Header اللي هنبعت فيه التوكن
    Description = "Please enter token (JWT) with Bearer prefix: Bearer {token}",
    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
    Scheme = "Bearer"
});
    // 2. تطبيق نظام الأمان ده
    // هنا بنقول لـ Swagger: "اعرض أيقونة القفل 🔒 على كل الـ Endpoints
    // وخليهم يستخدموا نظام 'Bearer' اللي عرفناه فوق"
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>(); 
builder.Services.AddScoped<IRoomTypeRepository, RoomTypeRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
var app = builder.Build();

// adding the rules of the user

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Create roles
    string[] roles = { "Admin", "Customer"};
    foreach (var role in roles)
    {
        var roleExist = await roleManager.RoleExistsAsync(role);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // Create default admin user
    var adminEmail = "admin@bookify.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        var newAdmin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(newAdmin, "Admin@123");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(newAdmin, "Admin");
            Console.WriteLine("Default admin user created successfully!");
            Console.WriteLine($"Email: {adminEmail}");
            Console.WriteLine("Password: Admin@123");
        }
    }
}

// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<BookifyDbContext>();
    var seeder = new DatabaseSeeder(context);
    await seeder.SeedAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // <-- بيشغل Swagger
    app.UseSwaggerUI(); // <-- بيعمل صفحة الـ UI لـ Swagger
}
// this middleware to redirect http request to https
// Commented out for development to avoid CORS preflight redirect issues
// app.UseHttpsRedirection();

// Use CORS policy (must come before Authentication and Authorization)
app.UseCors("AllowReactApp");

// --- 6. إضافة الـ Authentication (مهم جداً!) ---
app.UseAuthentication(); // <-- لازم ييجي قبل الـ Authorization // لان اصلا الطبيعي انا بشوف انت مسموح تسنخدم السيستم ولا لا

// this middleware to use authorization verification of user roles
app.UseAuthorization();
// this line is for directing the request to controllers
app.MapControllers();

app.Run();
