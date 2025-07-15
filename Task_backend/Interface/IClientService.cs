using Task_backend.Dto;
using Task_backend.Models;

namespace Task_backend.Interface
{
    public interface IClientService
    {
        Task<ClientsModel> CreateClient(CreateClientRequestDto Req, string userId);
        Task<PaginatedResult> GetAllClients(string userId, string role, string? search, string? filtertype, string? filtervalue, int pageNumber, int pageSize);
        Task<ClientsModel> GetClientById( string Id);
        Task<ClientsModel> DeleteClient( string Id);
        Task<ClientsModel> UnLinkLead(string Id, string lead_id);
        Task<ClientsModel> LinkLead(string Id, string lead_id);
        Task<ClientsModel> UpdateClient( string Id , CreateClientRequestDto Req);
    }
}
