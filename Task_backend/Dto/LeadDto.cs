using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Task_backend.Dto
{
    public class CreateLeadRequest
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Type { get; set; }
        public required string Phone_Number { get; set; }
        public required string Client_id { get; set; }


    }
    public class UpdateLeadRequest
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Type { get; set; }
        public required string Status { get; set; }
        public required string Phone_Number { get; set; }


    }
  
}
