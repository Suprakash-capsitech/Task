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
                if (!Enum.TryParse<ClientType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                ClientsModel newClient = new() { Name = Req.Name, CreatedById = userId, Email = Req.Email, Status = ClientStatus.Active, Type = typeEnum, Address = Req.Address, ContactIds = Req.ContactIds };
                await _dbContext.Clients.InsertOneAsync(newClient);
                UsersModel? user = await _dbContext.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();
                if (user is not null)
                {
                    newClient.CreatedBy = new UserMaskedResponse
                    {
                        Id = user.Id,
                        Name = user.Name
                    };
                }
                if ((Req.ContactIds?.Any()) != true)
                {
                    return newClient;
                }
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, Req.ContactIds);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                newClient.ContactDetails = contacts;
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
                        var enumValue = filtertype == "Status" ? (object)Enum.Parse(typeof(ClientStatus), filtervalue, true)
                                                            : Enum.Parse(typeof(ClientType), filtervalue, true);
                        var fieldfilter = Builders<ClientsModel>.Filter.Eq(filtertype, enumValue);

                        filter = Builders<ClientsModel>.Filter.And(filter, fieldfilter);
                    }
                    var clientList = await _dbContext.Clients.Find(filter).ToListAsync();

                    // Extract distinct user and contact IDs
                    var userIds = clientList.Select(c => c.CreatedById).Distinct().ToList();
                    var allContactIds = clientList
                        .SelectMany(c => c.ContactIds ?? Array.Empty<string>())
                        .Distinct()
                        .ToList();

                    // Fetch users and contacts
                    var users = await _dbContext.Users
                        .Find(Builders<UsersModel>.Filter.In(u => u.Id, userIds))
                        .Project(u => new UserMaskedResponse { Id = u.Id, Name = u.Name })
                        .ToListAsync();

                    var contacts = await _dbContext.Leads
                        .Find(Builders<LeadsModel>.Filter.In(l => l.Id, allContactIds))
                        .ToListAsync();

                    // Create lookup dictionaries
                    var userDict = users.ToDictionary(u => u.Id);
                    var contactDict = contacts.ToDictionary(c => c.Id);

                    // Enrich clients with user and contact info
                    foreach (var client in clientList)
                    {
                        if (userDict.TryGetValue(client.CreatedById, out var maskedUser))
                        {
                            client.CreatedBy = maskedUser;
                        }

                        if (client.ContactIds?.Length > 0)
                        {
                            client.ContactDetails = client.ContactIds
                                .Select(id => contactDict.GetValueOrDefault(id))
                                .Where(contact => contact != null)
                                .ToArray()!;
                        }
                    }

                    return clientList;

                }
                else
                {
                    var filter = Builders<ClientsModel>.Filter.Eq(x => x.CreatedById, userId);

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
                        var enumValue = filtertype == "status"
                                                            ? (object)Enum.Parse(typeof(ClientStatus), filtervalue, true)
                                                            : Enum.Parse(typeof(ClientType), filtervalue, true);
                        var fieldfilter = Builders<ClientsModel>.Filter.Eq(filtertype, enumValue);

                        filter = Builders<ClientsModel>.Filter.And(filter, fieldfilter);
                    }
                    var clientList = await _dbContext.Clients.Find(filter).ToListAsync();
                    var userIds = clientList.Select(l => l.CreatedById).Distinct().ToList();
                    var allContactIds = clientList
                                            .Where(c => c.ContactIds != null)
                                            .SelectMany(c => c.ContactIds!)
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
                        if (userDict.TryGetValue(client.CreatedById, out var maskedUser))
                        {
                            client.CreatedBy = maskedUser;
                        }

                        if (client.ContactIds is { Length: > 0 })
                        {
                            client.ContactDetails = client.ContactIds
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
                UsersModel user = await _dbContext.Users.Find(x => x.Id == client.CreatedById).FirstOrDefaultAsync();
                client.CreatedBy = new UserMaskedResponse { Id = user.Id, Name = user.Name };
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, client.ContactIds);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                client.ContactDetails = contacts;
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
                // Fetch the client
                var client = await _dbContext.Clients.Find(x => x.Id == Id).FirstOrDefaultAsync();
                if (client == null)
                {
                    throw new Exception("Client not found.");
                }

                var updateDefinition = Builders<ClientsModel>.Update.AddToSet(x => x.ContactIds, lead_id);
                var options = new FindOneAndUpdateOptions<ClientsModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                client = await _dbContext.Clients.FindOneAndUpdateAsync(x => x.Id == Id, updateDefinition, options);
                if (client == null)
                {
                    throw new Exception("Failed to update client.");
                }

                var user = await _dbContext.Users.Find(x => x.Id == client.CreatedById).FirstOrDefaultAsync();
                client.CreatedBy = user != null
                    ? new UserMaskedResponse { Id = user.Id, Name = user.Name }
                    : null;

                if (client.ContactIds != null && client.ContactIds.Any())
                {
                    var leadFilter = Builders<LeadsModel>.Filter.In(x => x.Id, client.ContactIds);
                    var contactList = await _dbContext.Leads.Find(leadFilter).ToListAsync();
                    client.ContactDetails = [.. contactList];
                }
                else
                {
                    client.ContactDetails = Array.Empty<LeadsModel>();
                }

                return client;
            }
            catch (Exception ex)
            {
                throw new Exception("Database Error", ex);
            }

        }

        public async Task<ClientsModel> UnLinkLead(string Id, string lead_id)
        {
            try
            {
                ClientsModel client = await _dbContext.Clients.Find(x => x.Id == Id).FirstOrDefaultAsync();

                var updateDefination = Builders<ClientsModel>.Update.Pull(x => x.ContactIds, lead_id);
                var options = new FindOneAndUpdateOptions<ClientsModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                client = await _dbContext.Clients.FindOneAndUpdateAsync(x => x.Id == Id, updateDefination, options);
                UsersModel user = await _dbContext.Users.Find(x => x.Id == client.CreatedById).FirstOrDefaultAsync();
                client.CreatedBy = new UserMaskedResponse { Id = user.Id, Name = user.Name };
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, client.ContactIds);
                List<LeadsModel> contactList = await _dbContext.Leads.Find(filter).ToListAsync();
                LeadsModel[] contacts = [.. contactList];
                client.ContactDetails = contacts;
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
                if (!Enum.TryParse<ClientType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                if (!Enum.TryParse<ClientStatus>(Req.Status, true, out var statusEnum))
                    throw new ArgumentException("Invalid type value");
                var updateDefination = Builders<ClientsModel>.Update.Set(x => x.Name, Req.Name)
                    .Set(x => x.Email, Req.Email)
                    .Set(x => x.Type, typeEnum)
                    .Set(x => x.Status, statusEnum)
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