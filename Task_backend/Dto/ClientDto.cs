﻿using MongoDB.Bson;
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
        public required List<string> ContactIds { get; set; }

    }
    /// <summary>
    /// Types for the Client
    /// </summary>
    public enum ClientType
    {
        Unknown,
        limited,
        individual,
        LLP,
        Partnersihp
    }
    /// <summary>
    /// Status for the Client active or inactive
    /// </summary>
    public enum ClientStatus
    {
        Unknown,
        Active,
        Inactive
    }

    /// <summary>
    /// DTO for the Response of paginated get route
    /// </summary>
    public class PaginatedResult
    {
        public required List<ClientsModel> ClientList { get; set; }
        public required long TotalCount { get; set; }
    }
    public class ClientStatDto
    {
        public int Day { get; set; }
        public int ClientCount { get; set; }
    }
}