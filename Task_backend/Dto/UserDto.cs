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
        [BsonElement("id"),BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }
        public required string Name { get; set; }
    }
    public class UserStatsDto
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        [BsonElement("name")]
        public required string Name { get; set; }

        public required int LeadCount { get; set; }

        //[BsonElement("ContactCount")]
        public required int ContactCount { get; set; }

        //[BsonElement("ClientCount")]
        public required int ClientCount { get; set; }
    }

    public class PaginatedUserStatsDto {
        public required List<UserStatsDto> UserList { get; set; }
        public required long TotalCount { get; set; }
    }
    public class CombinedStatDto
    {
        public int Id { get; set; } // Day of month
        public int LeadCount { get; set; }
        public int ContactCount { get; set; }
        public int ClientCount { get; set; }
    }
    /// <summary>
    /// Roles of the user for role based authorization
    /// </summary>
    public enum UserRoles
    {
        Unknown,
        Admin,
        User
    }

}
