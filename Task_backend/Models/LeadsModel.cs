using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Dto;

namespace Task_backend.Models
{
    public class LeadsModel
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [BsonElement("name"), BsonRepresentation(BsonType.String)]
        public required string Name { get; set; }
        [BsonElement("email"), BsonRepresentation(BsonType.String)]
        public required string Email { get; set; }
        [BsonElement("type"), BsonRepresentation(BsonType.String)]
        public required string Type { get; set; }
        [BsonElement("status"), BsonRepresentation(BsonType.String)]
        public string Status { get; set; } = "active";
        [BsonElement("phone_number"), BsonRepresentation(BsonType.String)]
        public required string Phone_Number { get; set; }
        [BsonElement("created_by_id"), BsonRepresentation(BsonType.ObjectId)]
        public required string Created_By_Id { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [BsonIgnore]
        public UserMaskedResponse? Created_By { get; set; }
    }
    public enum TypeEnum
    {
        contact,
        lead,
    }
}
