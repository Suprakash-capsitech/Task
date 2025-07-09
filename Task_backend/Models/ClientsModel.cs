using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Dto;

namespace Task_backend.Models
{
    public class ClientsModel
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
        public required string Status { get; set; }
        [BsonElement("address"), BsonRepresentation(BsonType.String)]
        public required string Address { get; set; }
        [BsonElement("created_by"), BsonRepresentation(BsonType.ObjectId)]
        public required string Created_By_Id { get; set; }
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonIgnore]
        public UserMaskedResponse? Created_By { get; set; }
        [BsonElement("contact_ids"), BsonRepresentation(BsonType.ObjectId)]
        public  string[]? Contact_Ids { get; set; }

    }
    public enum ClientTypeEnum
    {
        limited,
        LLP,
        Partnarship,
        individual
    }
}
