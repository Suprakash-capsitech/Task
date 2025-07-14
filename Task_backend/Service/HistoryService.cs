using MongoDB.Driver;
using Task_backend.Data;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;

namespace Task_backend.Service
{
    public class HistoryService(DbContext dbContext) : IHistoryService
    {
        public readonly DbContext _dbContext = dbContext;
        public async Task CreatedHistory(CreateHistory historyRequest)
        {
            HistoryModel newHistory = new() { HistoryOf = historyRequest.HistoryOf, PerformedBy = historyRequest.PerformedBy, TaskPerfoemed = historyRequest.TaskPerformed, Description = historyRequest.Description };

            await _dbContext.History.InsertOneAsync(newHistory);
        }

        public async Task<IEnumerable<HistoryModel>> GetHistory(string id)
        {
            try
            {
                var sortdefination = Builders<HistoryModel>.Sort.Descending("CreatedAt");
                var historyList = await _dbContext.History.Find(x => x.HistoryOf.Id == id).Sort(sortdefination).ToListAsync();
                
                return historyList;
            }
            catch (Exception)
            {
                throw new Exception("Database Error");

            }
        }
    }
}
