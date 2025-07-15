using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Dto;

namespace Task_backend.Models
{
    public class UsersModel
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [BsonElement("name"), BsonRepresentation(BsonType.String)]
        public required string Name { get; set; }
        [BsonElement("email"), BsonRepresentation(BsonType.String)]
        public required string Email { get; set; }
        [BsonElement("role")]
        public required UserRoles Role { get; set; }
        [BsonElement("password"), BsonRepresentation(BsonType.String)]
        public required string Password { get; set; }
        [BsonElement("token"), BsonRepresentation(BsonType.String)]
        public string Token { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public enum UserTypeEnum
    {
        admin,
        user,
    }
}
