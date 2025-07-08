using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Task_backend.Dto
{
    public class SignupRequest
    {

        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }

    }
    public class LoginRequest
    {

        public required string Email { get; set; }
        public required string Password { get; set; }

    }
    public class UserServiceResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Token { get; set; }
        public required string RefreshToken { get; set; }
        public required string Role { get; set; }
    }
    public class AuthticatedResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Token { get; set; }
        public required string Role { get; set; }
    }
   public class UserMaskedResponse
    {

        public required string Id { get; set; }
        public required string Name { get; set; }
    }

}
