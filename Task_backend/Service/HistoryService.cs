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
        /// <summary>
        /// Creates History
        /// </summary>
        /// <param name="historyRequest"> Dto for history object </param>
        /// <returns></returns>
        public async Task CreatedHistory(CreateHistory historyRequest)
        {
            HistoryModel newHistory = new() { HistoryOf = historyRequest.HistoryOf, PerformedBy = historyRequest.PerformedBy, TaskPerfoemed = historyRequest.TaskPerformed, Description = historyRequest.Description };

            await _dbContext.History.InsertOneAsync(newHistory);
        }
        /// <summary>
        /// Gets the history objects list for the target Id
        /// </summary>
        /// <param name="id">Trget Id</param>
        /// <returns>List of History Objects</returns>
        /// <exception cref="Exception"></exception>
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
