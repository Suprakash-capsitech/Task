using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Task_backend.Data;
using Task_backend.Interface;
using Task_backend.Middleware;
using Task_backend.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen(options =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Enter Jwt Access Token",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    options.AddSecurityDefinition("Bearer", jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { { jwtSecurityScheme, Array.Empty<string>() } });
});
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = true;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"])),
        ClockSkew = TimeSpan.Zero

    };
});
builder.Services.AddAuthorization();

//Cors policy
builder.Services.AddCors(builder =>
{
    builder.AddPolicy(name: "CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173").AllowAnyMethod().AllowAnyHeader().AllowCredentials();

    });
});
//configuring of Mongodb Server
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoCoonetct"));
builder.Services.AddSingleton<DbContext>();

// Services
builder.Services.AddSingleton<IPasswordService, PasswordService>();
builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//if (app.Environment.IsProduction())
//{

//}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapWhen(
    ctx =>
        ctx.Request.Path.StartsWithSegments("/api/Lead/deletelead") ||
        ctx.Request.Path.StartsWithSegments("/api/Client/deleteclient"),
    appBuilder =>
    {
        appBuilder.UseMiddleware<CheckAdminMiddleware>(); appBuilder.UseRouting();
        appBuilder.UseAuthorization();
        appBuilder.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers(); 
        });
    });

app.Run();
