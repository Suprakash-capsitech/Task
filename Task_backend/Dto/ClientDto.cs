using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Task_backend.Dto
{
    public class CreateClientRequestDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Type { get; set; }
        public required string Status { get; set; } = "active";
        public required string Address { get; set; }

    }
   
}
