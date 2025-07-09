using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Models;

namespace Task_backend.Dto
{
    public class CreateClientRequestDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Type { get; set; }
        public required string Status { get; set; } = "active";

        public required AddressType Address { get; set; }
        public required string[] Contact_Ids { get; set; } 

    }
   
}
