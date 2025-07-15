using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Task_backend.Models;

namespace Task_backend.Dto
{
    public class CreateLeadRequest
    {
        /// <summary>
        /// Name of Lead/Contact
        /// </summary>
        public required string Name { get; set; }
        /// <summary>
        /// Email of Lead/Contact
        /// </summary>
        public required string Email { get; set; }
        /// <summary>

        /// Type if Lead/Contact
        /// </summary>
        public required string Type { get; set; }
        /// <summary>
        /// Phone number of Lead/Contact
        /// </summary>

        public required string PhoneNumber { get; set; }

        /// <summary>
        /// Clients id of the client that is connect to the lead
        /// </summary>
        public required string ClientId { get; set; }


    }
    public class UpdateLeadRequest
    {
        /// <summary>
        /// Name of Lead/Contact
        /// </summary>
        public required string Name { get; set; }
        /// <summary>
        /// Email of Lead/Contact
        /// </summary>
        public required string Email { get; set; }
        /// <summary>

        /// Type if Lead/Contact
        /// </summary>
        public required string Type { get; set; }
        /// <summary>
        /// Phone number of Lead/Contact
        /// </summary>

        public required string PhoneNumber { get; set; }
        /// <summary>
        /// Status of lead active or inactive
        /// </summary>
        public required string Status { get; set; }


    }
    public enum LeadStatus
    {
        Unknown,
        Active,
        Inactive
    }
    public enum LeadType
    {
       Unknown,
       lead,
       contact
    }
    public class PaginatedLeadResult
    {
        public required List<LeadsModel> LeadList { get; set; }
        public required long TotalCount { get; set; }
    }
}