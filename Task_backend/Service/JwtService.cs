using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Task_backend.Interface;

namespace Task_backend.Service
{
    public class JwtService(IConfiguration config) : IJwtService
    {
        private readonly IConfiguration _config = config;
        /// <summary>
        /// Generats a JWT token with 3 hours validity
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <param name="role">User Role</param>
        /// <returns>Jwt token </returns>
        public string GenerateToken(string Id, string role)
        {
            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];
            var key = _config["JwtSettings:SecretKey"];
            var validity = _config.GetValue<int>("JwtSettings:Valid");
            var expiryTime = DateTime.UtcNow.AddHours(validity);
            var Descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {

                    new Claim(ClaimTypes.NameIdentifier, Id),
                    new Claim(ClaimTypes.Role, role)
                }),
                Issuer = issuer,
                Audience = audience,
                Expires = expiryTime,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256),
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(Descriptor);
            var accestoken = tokenHandler.WriteToken(securityToken);
            return accestoken;
        }
        /// <summary>
        /// Create a JWT token with 3 days validity
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>Jwt token </returns>
        public String GenerateRefreshToken(string Id)
        {
            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];
            var key = _config["JwtSettings:SecretKey"];
            var validity = _config.GetValue<int>("JwtSettings:Valid");
            var expiryTime = DateTime.UtcNow.AddDays(validity + 2);
            var Descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, Id),
                }),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256),
                Expires = expiryTime,
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(Descriptor);
            var accestoken = tokenHandler.WriteToken(securityToken);
            return accestoken;
        }
        /// <summary>
        /// Validate the Jwt token 
        /// </summary>
        /// <param name="token">Jwt Token</param>
        /// <returns>Boolena with the validated status</returns>
        public Boolean ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]);
            try
            {

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                }, out SecurityToken validatedToken);

                var jwtToken = validatedToken as JwtSecurityToken;
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }
    }
}

