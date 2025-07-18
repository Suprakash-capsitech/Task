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
        public  DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }

    /// <summary>
    /// Lead status types active / inactive
    /// </summary>
    public enum LeadStatus
    {
        Unknown,
        Active,
        Inactive
    }
    /// <summary>
    /// Lead catagorie Lead/Contact
    /// </summary>
    public enum LeadType
    {
       Unknown,
       lead,
       contact
    }
    /// <summary>
    /// DTO for Paginated Response of Getlead routes
    /// </summary>
    public class PaginatedLeadResult
    {
        public required List<LeadsModel> LeadList { get; set; }
        public required long TotalCount { get; set; }
    }
    public class LeadStatDto
    {
        public int Day { get; set; }
        public int LeadCount { get; set; }
        public int ContactCount { get; set; }
    }
}