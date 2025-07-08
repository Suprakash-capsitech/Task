using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Task_backend.Dto
{
    public class CreatedHistoryDto
    {
        public required string History_of { get; set; }
        public required string Description { get; set; }
        public required string Task_Performed { get; set; }

        public required string Performed_By_Id { get; set; }

    }
   
}
