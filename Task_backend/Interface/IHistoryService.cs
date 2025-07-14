using Task_backend.Dto;
using Task_backend.Models;

namespace Task_backend.Interface
{
    public interface IHistoryService
    {
        Task CreatedHistory(CreateHistory historyRequest);
        Task<IEnumerable<HistoryModel>> GetHistory(string id);
    }
}
