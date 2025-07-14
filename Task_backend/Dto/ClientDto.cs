using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Models;

namespace Task_backend.Dto
{
    public class CreateClientRequestDto
    {
        /// <summary>
        /// Client Name
        /// </summary>
        public required string Name { get; set; }

        /// <summary>
        /// Client Email
        /// </summary>
        public required string Email { get; set; }
        /// <summary>
        /// Type of client "limited" , "LLP", "Partnarship" , "Individuals"
        /// </summary>
        public required string Type { get; set; }
        /// <summary>
        /// Status of client "active" or "Passive"
        /// </summary>
        public required string Status { get; set; } = "Active";
        /// <summary>
        /// Address of client in object {street,area,city,county,pincode,country}
        /// </summary>

        public required AddressType Address { get; set; }
        /// <summary>
        /// Id's of the contacts linked with client
        /// </summary>
        public required string[] ContactIds { get; set; }

    }
    public enum ClientType
    {
        Unknown,
        limited,
        individual,
        LLP,
        Partnersihp
    }
    public enum ClientStatus
    {
        Unknown,
        Active,
        Inactive
    }

}