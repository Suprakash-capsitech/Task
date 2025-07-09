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
        [BsonElement("name"), BsonRepresentation(BsonType.String)]
        public required string Name { get; set; }
        [BsonElement("email"), BsonRepresentation(BsonType.String)]
        public required string Email { get; set; }
        [BsonElement("type"), BsonRepresentation(BsonType.String)]
        public required string Type { get; set; }
        [BsonElement("status"), BsonRepresentation(BsonType.String)]
        public required string Status { get; set; }
        [BsonElement("address")]
        public required AddressType Address { get; set; }
        [BsonElement("created_by"), BsonRepresentation(BsonType.ObjectId)]
        public required string Created_By_Id { get; set; }
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [BsonElement("contact_ids"), BsonRepresentation(BsonType.ObjectId)]
        public  string[]? Contact_Ids { get; set; }

        [BsonIgnore]
        public UserMaskedResponse? Created_By { get; set; }

        [BsonIgnore]
        public LeadsModel[]? Contact_Details { get; set; }

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
