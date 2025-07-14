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
        public required TargetModel HistoryOf { get; set; }
        [ BsonRepresentation(BsonType.String)]
        public required string Description { get; set; }
        public required NoteType TaskPerfoemed { get; set; }
        public required UserMaskedResponse PerformedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
   
}
