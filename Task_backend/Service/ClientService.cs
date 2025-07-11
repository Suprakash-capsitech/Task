using FluentValidation.Results;
using MongoDB.Bson;
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
                ClientsModel newClient = new() { Name = Req.Name, Created_By_Id = userId, Email = Req.Email, Status = Req.Status, Type = Req.Type, Address = Req.Address, Contact_Ids = Req.Contact_Ids };
                await _dbContext.Clients.InsertOneAsync(newClient);
                UsersModel? user = await _dbContext.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();
                if (user is not null)
                {
                    newClient.Created_By = new UserMaskedResponse
                    {
                        Id = user.Id,
                        Name = user.Name
                    };
                }
                if ((Req.Contact_Ids?.Any()) != true)
                {
                    return newClient;
                }
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, Req.Contact_Ids);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                newClient.Contact_Details = contacts;
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

        public async Task<IEnumerable<ClientsModel>> GetAllClients(string userId, string role, string? search, string? filtertype, string? filtervalue)
        {
            try
            {
                if (role == "admin")
                {
                    var filter = Builders<ClientsModel>.Filter.Empty;

                    if (!string.IsNullOrEmpty(search))
                    {
                        var searchFilter = Builders<ClientsModel>.Filter.Or(
                            Builders<ClientsModel>.Filter.Regex("name", new BsonRegularExpression(search, "i")),
                            Builders<ClientsModel>.Filter.Regex("email", new BsonRegularExpression(search, "i"))
                        );

                        filter = Builders<ClientsModel>.Filter.And(filter, searchFilter);
                    }
                    if (!string.IsNullOrEmpty(filtertype) && !string.IsNullOrEmpty(filtervalue))
                    {
                        var fieldfilter = Builders<ClientsModel>.Filter.Eq(filtertype, filtervalue);

                        filter = Builders<ClientsModel>.Filter.And(filter, fieldfilter);
                    }
                    var clientList = await _dbContext.Clients.Find(filter).ToListAsync();
                    var userIds = clientList.Select(l => l.Created_By_Id).Distinct().ToList();
                    var allContactIds = clientList
                                            .Where(c => c.Contact_Ids != null)
                                            .SelectMany(c => c.Contact_Ids!)
                                            .Distinct()
                                            .ToList();
                    var userFilter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(userFilter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        })
                        .ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);
                    var contactFilter = Builders<LeadsModel>.Filter.In(l => l.Id, allContactIds);
                    var contacts = await _dbContext.Leads.Find(contactFilter).ToListAsync();
                    var contactDict = contacts.ToDictionary(c => c.Id, c => c);

                    foreach (var client in clientList)
                    {
                        if (userDict.TryGetValue(client.Created_By_Id, out var maskedUser))
                        {
                            client.Created_By = maskedUser;
                        }

                        if (client.Contact_Ids is { Length: > 0 })
                        {
                            client.Contact_Details = client.Contact_Ids
                                .Where(id => contactDict.ContainsKey(id))
                                .Select(id => contactDict[id])
                                .ToArray();
                        }
                    }


                    return clientList;

                }
                else
                {
                    var filter = Builders<ClientsModel>.Filter.Eq(x => x.Created_By_Id, userId);

                    if (!string.IsNullOrEmpty(search))
                    {
                        var searchFilter = Builders<ClientsModel>.Filter.Or(
                            Builders<ClientsModel>.Filter.Regex("name", new BsonRegularExpression(search, "i")),
                            Builders<ClientsModel>.Filter.Regex("email", new BsonRegularExpression(search, "i"))
                        );

                        filter = Builders<ClientsModel>.Filter.And(filter, searchFilter);
                    }
                    if (!string.IsNullOrEmpty(filtertype) && !string.IsNullOrEmpty(filtervalue))
                    {
                        var fieldfilter = Builders<ClientsModel>.Filter.Eq(filtertype, filtervalue);

                        filter = Builders<ClientsModel>.Filter.And(filter, fieldfilter);
                    }
                    var clientList = await _dbContext.Clients.Find(filter).ToListAsync();
                    var userIds = clientList.Select(l => l.Created_By_Id).Distinct().ToList();
                    var allContactIds = clientList
                                            .Where(c => c.Contact_Ids != null)
                                            .SelectMany(c => c.Contact_Ids!)
                                            .Distinct()
                                            .ToList();
                    var userFilter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(userFilter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        })
                        .ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);
                    var contactFilter = Builders<LeadsModel>.Filter.In(l => l.Id, allContactIds);
                    var contacts = await _dbContext.Leads.Find(contactFilter).ToListAsync();
                    var contactDict = contacts.ToDictionary(c => c.Id, c => c);

                    foreach (var client in clientList)
                    {
                        if (userDict.TryGetValue(client.Created_By_Id, out var maskedUser))
                        {
                            client.Created_By = maskedUser;
                        }

                        if (client.Contact_Ids is { Length: > 0 })
                        {
                            client.Contact_Details = client.Contact_Ids
                                .Where(id => contactDict.ContainsKey(id))
                                .Select(id => contactDict[id])
                                .ToArray();
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
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, client.Contact_Ids);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                client.Contact_Details = contacts;
                return client;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        public async Task<ClientsModel> LinkLead(string Id, string lead_id)
        {
            try
            {
                ClientsModel client = await _dbContext.Clients.Find(x => x.Id == Id).FirstOrDefaultAsync();

                var updateDefination = Builders<ClientsModel>.Update.Push(x => x.Contact_Ids, lead_id);
                var options = new FindOneAndUpdateOptions<ClientsModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                client = await _dbContext.Clients.FindOneAndUpdateAsync(x => x.Id == Id, updateDefination, options);
                UsersModel user = await _dbContext.Users.Find(x => x.Id == client.Created_By_Id).FirstOrDefaultAsync();
                client.Created_By = new UserMaskedResponse { Id = user.Id, Name = user.Name };
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, client.Contact_Ids);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                client.Contact_Details = contacts;
                return client;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        public async Task<ClientsModel> UnLinkLead(string Id, string lead_id)
        {
            try
            {
                ClientsModel client = await _dbContext.Clients.Find(x => x.Id == Id).FirstOrDefaultAsync();

                var updateDefination = Builders<ClientsModel>.Update.Pull(x => x.Contact_Ids, lead_id);
                var options = new FindOneAndUpdateOptions<ClientsModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                client = await _dbContext.Clients.FindOneAndUpdateAsync(x => x.Id == Id, updateDefination, options);
                UsersModel user = await _dbContext.Users.Find(x => x.Id == client.Created_By_Id).FirstOrDefaultAsync();
                client.Created_By = new UserMaskedResponse { Id = user.Id, Name = user.Name };
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, client.Contact_Ids);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                client.Contact_Details = contacts;
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
