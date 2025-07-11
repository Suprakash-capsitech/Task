using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Dto;

namespace Task_backend.Models
{
    public class HistoryModel
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [BsonElement("history_of"), BsonRepresentation(BsonType.ObjectId)]
        public required string History_of { get; set; }
        [BsonElement("description"), BsonRepresentation(BsonType.String)]
        public required string Description { get; set; }
        [BsonElement("task_performed"), BsonRepresentation(BsonType.String)]
        public required string Task_Performed { get; set; }

        [BsonElement("performed_by"), BsonRepresentation(BsonType.ObjectId)]
        public required string Performed_By_Id { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonIgnore]
        public UserMaskedResponse? Performed_By { get; set; }

    }
    public enum TaskAction
    {
        Created,
        Updated,
        Deleted,
        Linked,
        Unlinked
    }
}
