
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Task_backend.Data;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;

namespace Task_backend.Service
{
    public class ClientService(DbContext dbContext) : IClientService
    {
        public readonly DbContext _dbContext = dbContext;
        /// <summary>
        /// Create a new Client
        /// </summary>
        /// <param name="Req">Dto object to Create Client</param>
        /// <param name="userId">User's Id</param>
        /// <returns>New Created Client</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<ClientsModel> CreateClient(CreateClientRequestDto Req, string userId)

        {
            try
            {
                if (!Enum.TryParse<ClientType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                ClientsModel newClient = new()
                {
                    Name = Req.Name,
                    CreatedById = userId,
                    Email = Req.Email,
                    Status = ClientStatus.Active,
                    Type = typeEnum,
                    Address = Req.Address,
                    ContactIds = Req.ContactIds,
                    CreatedBy = await _dbContext.Users.Find(x => x.Id == userId).Project(u => new UserMaskedResponse { Id = u.Id, Name = u.Name }).FirstOrDefaultAsync()
                };
                await _dbContext.Clients.InsertOneAsync(newClient);

                if (Req.ContactIds?.Count == 0)
                {
                    return newClient;
                }
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, Req.ContactIds);
                newClient.ContactDetails = await _dbContext.Leads.Find(filter).ToListAsync();
                return newClient;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
        /// <summary>
        /// Delete a client from database
        /// </summary>
        /// <param name="Id">Client Id</param>
        /// <returns>Deleted Object of Client</returns>
        /// <exception cref="Exception"></exception>
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

        /// <summary>
        /// Get all the clients according to the role of the logged in user
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <param name="role">User's Role</param>
        /// <param name="search">Search parameter</param>
        /// <param name="filtertype">Filter Field Parameter</param>
        /// <param name="filtervalue">Filter value parameter</param>
        /// <param name="pageNumber">Page number </param>
        /// <param name="pageSize">Number of items in page</param>
        /// <returns>List of clients and total number of documents</returns>
        /// <exception cref="Exception"></exception>
        public async Task<PaginatedResult> GetAllClients(string userId, string role, string? search, string? filtertype, string? filtervalue, int pageNumber, int pageSize )
        {
            try
            {
                var pipeline = new List<BsonDocument>();

                var matchConditions = new List<BsonDocument>();

                if (role != "Admin")
                {

                    matchConditions.Add(new BsonDocument("CreatedById", new ObjectId(userId)));
                }

                if (!string.IsNullOrEmpty(search))
                {
                    var regex = new BsonRegularExpression(search, "i");
                    matchConditions.Add(new BsonDocument("$or", new BsonArray
                        {
                            new BsonDocument("Name", regex),
                            new BsonDocument("Email", regex)
                        }));
                }

                if (!string.IsNullOrEmpty(filtertype) && !string.IsNullOrEmpty(filtervalue))
                {
                    var enumValue = filtertype == "Status"
                        ? Enum.Parse(typeof(ClientStatus), filtervalue, true)
                        : Enum.Parse(typeof(ClientType), filtervalue, true);

                    matchConditions.Add(new BsonDocument(filtertype, BsonValue.Create(enumValue)));
                }

                if (matchConditions.Count > 0)
                {
                    var matchStage = new BsonDocument("$match", new BsonDocument("$and", new BsonArray(matchConditions)));
                    pipeline.Add(matchStage);
                }
                pipeline.Add(new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "Leads" },
                    { "localField", "ContactIds" },
                    { "foreignField", "_id" },
                    { "as", "ContactDetails" }
                }));

                var skip = (pageNumber - 1) * pageSize;
                pipeline.Add(new BsonDocument("$skip", skip));
                pipeline.Add(new BsonDocument("$limit", pageSize));
                var aggregatePipeline = pipeline.ToArray();
                var result = await _dbContext.Clients.Aggregate<BsonDocument>(aggregatePipeline).ToListAsync();
                var typedResult = result.Select(b => BsonSerializer.Deserialize<ClientsModel>(b)).ToList();
                var countFilter = matchConditions.Count > 0
                                        ? Builders<ClientsModel>.Filter.And(matchConditions.Select(c => new BsonDocumentFilterDefinition<ClientsModel>(c)))
                                        : Builders<ClientsModel>.Filter.Empty;

                var totalCount = await _dbContext.Clients.CountDocumentsAsync(countFilter);

                PaginatedResult response = new() { ClientList = typedResult, TotalCount = totalCount };
                return response;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }

        }
        /// <summary>
        /// Get the Client with the Specific Id
        /// </summary>
        /// <param name="Id">Client Id</param>
        /// <returns>Client Object</returns>
        /// <exception cref="Exception"></exception>
        public async Task<ClientsModel> GetClientById(string Id)
        {
            try
            {
                ClientsModel client = await _dbContext.Clients.Find(x => x.Id == Id).FirstOrDefaultAsync();
               
                var filter = Builders<LeadsModel>.Filter.In(x => x.Id, client.ContactIds);

                client.ContactDetails = await _dbContext.Leads.Find(filter).ToListAsync(); ;
                return client;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
        /// <summary>
        /// Links a lead/Contact with CLient
        /// </summary>
        /// <param name="Id">Client Id</param>
        /// <param name="lead_id">Lead Id</param>
        /// <returns>Client Object after Linking</returns>
        /// <exception cref="Exception"></exception>
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
                if (client.ContactIds?.Contains(lead_id) == true)
                    throw new Exception("This lead is already linked to the client.");


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
                return client;
            }
            catch (Exception ex)
            {
                throw new Exception("Database Error", ex);
            }

        }

        /// <summary>
        /// Unlinks a lead/Contact form the Client
        /// </summary>
        /// <param name="Id">Client Id</param>
        /// <param name="lead_id">Lead Id</param>
        /// <returns>Client Object after Unlinking</returns>
        /// <exception cref="Exception"></exception>

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
                
                return client;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
        /// <summary>
        /// Update the Details of the Client 
        /// </summary>
        /// <param name="Id">Client Id</param>
        /// <param name="Req">Dto for Client Field values</param>
        /// <returns>Updated Client Object</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
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