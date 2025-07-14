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
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required LeadType Type { get; set; }
        public LeadStatus Status { get; set; } = LeadStatus.Active;
        [BsonRepresentation(BsonType.String)]
        public required string PhoneNumber { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public required string CreatedById { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string>? ClientIds { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [BsonIgnore]
        public UserMaskedResponse? CreatedBy { get; set; }
    }
    public enum TypeEnum
    {
        contact,
        lead,
    }
}