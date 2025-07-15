using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Globalization;
using Task_backend.Dto;

namespace Task_backend.Models
{
    public class ClientsModel
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [ BsonRepresentation(BsonType.String)]
        public required string Name { get; set; }
        [ BsonRepresentation(BsonType.String)]
        public required string Email { get; set; }
        public required ClientType Type { get; set; }
        public required ClientStatus Status { get; set; }
        public required AddressType Address { get; set; }
        [ BsonRepresentation(BsonType.ObjectId)]
        public required string CreatedById { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [ BsonRepresentation(BsonType.ObjectId)]
        public required List<string> ContactIds { get; set; }

        [BsonElement("CreatedBy")]
        public UserMaskedResponse? CreatedBy { get; set; }


        [BsonElement("ContactDetails")]
        public List<LeadsModel>? ContactDetails { get; set; }

    }
    public enum ClientTypeEnum
    {
        limited,
        LLP,
        Partnarship,
        individual
    }
    public class AddressType
    {
        [BsonElement("street")]
        public required string Street { get; set; }

        [BsonElement("area")]
        public required string Area { get; set; }

        [BsonElement("city")]
        public required string City { get; set; }

        [BsonElement("county")]
        public required string County { get; set; }

        [BsonElement("pincode")]
        public required string Pincode { get; set; }

        [BsonElement("country")]
        public required string Country { get; set; }
    }
}