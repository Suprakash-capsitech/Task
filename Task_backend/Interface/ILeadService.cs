﻿using Task_backend.Dto;
using Task_backend.Models;

namespace Task_backend.Interface
{
    public interface ILeadService
    {
        Task<LeadsModel> CreateLead(CreateLeadRequest Req, string userId);
        Task<PaginatedLeadResult> GetLeads(string type, string role, string userId, string? search, string? filtertype, string? filtervalue, int? pageNumber, int? pageSize);
        Task<IEnumerable<LeadsModel>> GetAll(string role, string userId);
        Task<LeadsModel> LinkClientToLead(string LeadId, string ClientId);
        Task<LeadsModel> UnLinkClientToLead(string LeadId, string ClientId);
        Task<LeadsModel> GetLeadById(string Id);
        Task<IEnumerable<LeadsModel>> GetLeadByClientId(string Id);
        //Task<IEnumerable<LeadsModel>> GetContacts(string type, string role, string userId);
        Task<LeadsModel> DeleteLead(string Id);
        Task<LeadsModel> UpdateLead(string Id, UpdateLeadRequest Req, bool isTypeChanged);
        Task<List<LeadStatDto>> GetStats(int month, int year);
    }
}
