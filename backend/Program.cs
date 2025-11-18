

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


// bind the admin settings from appsettings.json

builder.Services.Configure<AdminSettings>(
    builder.Configuration.GetSection(AdminSettings.SectionName));


// bind the JWT settings from appsettings.json
builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection(JWTSettings.SectionName));
var jwtSettings = new JWTSettings();
builder.Configuration.GetSection(JWTSettings.SectionName).Bind(jwtSettings);
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
// to enable CORS policy for the frontend application
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>(); 
builder.Services.AddScoped<IRoomTypeRepository, RoomTypeRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
var app = builder.Build();

// adding the rules of the user manually 

//using (var scope = app.Services.CreateScope())
//{
//    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
//    string[] roles = { "Admin", "Customer"};
//    foreach (var role in roles)
//    {
//        var roleExist = await roleManager.RoleExistsAsync(role);
//        if (!roleExist)
//        {
//            await roleManager.CreateAsync(new IdentityRole(role));
//        }
//    }
//}

// seeding default admin user 
using (var scope = app.Services.CreateScope())
{
    var Services = scope.ServiceProvider;
    var userManager = Services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = Services.GetRequiredService<RoleManager<IdentityRole>>();
    var adminSettings = Services.GetRequiredService<IOptions<AdminSettings>>().Value;
    var logger = Services.GetRequiredService<ILogger<Program>>();

    //create roles
    string[] roles = { "Admin", "Customer" };
    foreach (var role in roles)
    {
        var roleExist = await roleManager.RoleExistsAsync(role);
        if (!roleExist)
        {
           var result = await roleManager.CreateAsync(new IdentityRole(role));
            if (result.Succeeded)
              {
                logger.LogInformation($"Role '{role}' created successfully.");
              }
              else
              {
                logger.LogError($"Error creating role '{role}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }
    //create default admin credentials
    if(!string.IsNullOrEmpty(adminSettings.Email) && !string.IsNullOrEmpty(adminSettings.Password))
    {
        var adminEmail = adminSettings.Email;
        var adminPassword = adminSettings.Password;
        var adminUser = await userManager.FindByEmailAsync(adminSettings.Email);
        if (adminUser == null)
        {
            var newAdminUser = new ApplicationUser
            {
                UserName = adminSettings.Email,
                Email = adminSettings.Email,
                EmailConfirmed = true,
                FirstName="Admin",
                LastName = "test"
            };
            var createAdminResult = await userManager.CreateAsync(newAdminUser, adminSettings.Password);
            if (createAdminResult.Succeeded)
            {
                await userManager.AddToRoleAsync(newAdminUser, "Admin");
                logger.LogInformation("Default admin user created successfully.");
            }
            else
            {
                logger.LogError($"Error creating default admin user: {string.Join(", ", createAdminResult.Errors.Select(e => e.Description))}");
            }

        }
        else
        {
            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                logger.LogInformation("Existing user assigned to Admin role.", adminEmail);
            }
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

// ensure routing is set up (explicit; optional in minimal apps but recommended)
app.UseRouting();

// this middleware to use the CORS policy
app.UseCors("AllowFrontend");

// --- 6. إضافة الـ Authentication (مهم جداً!) ---
app.UseAuthentication(); // <-- لازم ييجي قبل الـ Authorization // لان اصلا الطبيعي انا بشوف انت مسموح تسنخدم السيستم ولا لا

// this middleware to use authorization verification of user roles
app.UseAuthorization();
// this line is for directing the request to controllers
app.MapControllers();

app.Run();
