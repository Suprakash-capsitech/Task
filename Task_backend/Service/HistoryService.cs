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
        public async Task CreatedHistory(CreatedHistoryDto historyRequest)
        {
            HistoryModel newHistory = new() { History_of = historyRequest.History_of, Performed_By_Id = historyRequest.Performed_By_Id, Task_Performed = historyRequest.Task_Performed, Description = historyRequest.Description };

            await _dbContext.History.InsertOneAsync(newHistory);
        }

        public async Task<IEnumerable<HistoryModel>> GetHistory(string id)
        {
            try
            {

                var historyList = await _dbContext.History.Find(x => x.History_of == id).ToListAsync();
                var userIds = historyList.Select(l => l.Performed_By_Id).Distinct().ToList();

                var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                var users = await _dbContext.Users.Find(filter)
                    .Project(u => new UserMaskedResponse
                    {
                        Id = u.Id,
                        Name = u.Name
                    }).ToListAsync();

                var userDict = users.ToDictionary(u => u.Id, u => u);

                foreach (var history in historyList)
                {
                    if (userDict.TryGetValue(history.Performed_By_Id, out var maskedUser))
                    {
                        history.Performed_By= maskedUser;
                    }
                }
                return historyList;
            }
            catch (Exception)
            {
                throw new Exception("Database Error");
                
            }
        }
    }
}
