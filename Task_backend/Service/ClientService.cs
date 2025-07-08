using FluentValidation.Results;
using MongoDB.Driver;
using System.Net;
using Task_backend.Data;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;
using Task_backend.Validation;

namespace Task_backend.Service
{
    public class ClientService(DbContext dbContext) : IClientService
    {
        public readonly DbContext _dbContext = dbContext;
        public async Task<ClientsModel> CreateClient(CreateClientRequestDto Req, string userId)

        {
            

                try
                {
                    ClientsModel newClient = new() { Name = Req.Name, Created_By_Id = userId, Email = Req.Email, Status = Req.Status, Type = Req.Type, Address = Req.Address };
                    await _dbContext.Clients.InsertOneAsync(newClient);
                    UsersModel user = await _dbContext.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();
                    newClient.Created_By = new UserMaskedResponse { Id = user.Id, Name = user.Name };
                    return newClient;

                }
                catch (Exception)
                {

                    throw new Exception("Database Error");
                }
            
            
        }

        public async Task<ClientsModel> DeleteClient(string Id)
        {
            try
            {
                ClientsModel client = await _dbContext.Clients.FindOneAndDeleteAsync(x => x.Id == Id);
                return client;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        public async Task<IEnumerable<ClientsModel>> GetAllClients(string userId, string role)
        {
            try
            {
                if (role == "admin")
                {
                    var clientList = await _dbContext.Clients.Find(x => true).ToListAsync();
                    var userIds = clientList.Select(l => l.Created_By_Id).Distinct().ToList();

                    var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(filter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        }).ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);

                    foreach (var lead in clientList)
                    {
                        if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
                        {
                            lead.Created_By = maskedUser;
                        }
                    }

                    return clientList;

                }
                else
                {
                    var clientList = await _dbContext.Clients.Find(x => x.Created_By_Id == userId).ToListAsync();
                    var userIds = clientList.Select(l => l.Created_By_Id).Distinct().ToList();

                    var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(filter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        }).ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);

                    foreach (var lead in clientList)
                    {
                        if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
                        {
                            lead.Created_By = maskedUser;
                        }
                    }
                    return clientList;
                }
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }

        }

        public async Task<ClientsModel> GetClientById(string Id)
        {
            try
            {
                ClientsModel client = await _dbContext.Clients.Find(x => x.Id == Id).FirstOrDefaultAsync();
                UsersModel user = await _dbContext.Users.Find(x => x.Id == client.Created_By_Id).FirstOrDefaultAsync();
                client.Created_By = new UserMaskedResponse { Id = user.Id, Name = user.Name };
                return client;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        public async Task<ClientsModel> UpdateClient(string Id, CreateClientRequestDto Req)
        {
            try
            {
                var updateDefination = Builders<ClientsModel>.Update.Set(x => x.Name, Req.Name)
                    .Set(x => x.Email, Req.Email)
                    .Set(x => x.Type, Req.Type)
                    .Set(x => x.Status, Req.Status)
                    .Set(x => x.Address, Req.Address);
                var options = new FindOneAndUpdateOptions<ClientsModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                return await _dbContext.Clients.FindOneAndUpdateAsync(x => x.Id == Id, updateDefination, options);
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
    }
}
