using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Data;
using Task_backend.Data;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;

namespace Task_backend.Service
{
    public class LeadService(DbContext dbcontext) : ILeadService
    {
        public readonly DbContext _dbContext = dbcontext;
        /// <summary>
        /// Creates a new lead and strores the user details 
        /// </summary>
        /// <param name="Req"></param>
        /// <param name="userId"></param>
        /// <returns>New Lead</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<LeadsModel> CreateLead(CreateLeadRequest Req, string userId)
        {
            try
            {
                if (!Enum.TryParse<LeadType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                LeadsModel newLead = new()
                {
                    Name = Req.Name,
                    Email = Req.Email,
                    CreatedById = userId,
                    Type = typeEnum,
                    PhoneNumber = Req.PhoneNumber,
                    ClientIds = string.IsNullOrEmpty(Req.ClientId) ? [] : [Req.ClientId],
                    CreatedBy = await _dbContext.Users.Find(x => x.Id == userId).Project(u => new UserMaskedResponse
                    {
                        Id = u.Id,
                        Name = u.Name
                    }).FirstOrDefaultAsync()
                };
                await _dbContext.Leads.InsertOneAsync(newLead);
                return newLead;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
        /// <summary>
        /// Soft Deletes the Lead
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>Updated Lead Response</returns>
        /// <exception cref="Exception"></exception>
        public async Task<LeadsModel> DeleteLead(string Id)
        {
            try
            {
                LeadsModel deletedLead = await _dbContext.Leads.FindOneAndDeleteAsync(x => x.Id == Id);
                return deletedLead;
            }
            catch (Exception)
            {

                throw new Exception("Database error");
            }
        }
        /// <summary>
        /// Gets all the entries of the Leads collections 
        /// </summary>
        /// <param name="role"> User Role</param>
        /// <param name="userId"> User Id</param>
        /// <returns>List of Leads</returns>
        /// <exception cref="Exception"></exception>
        public async Task<IEnumerable<LeadsModel>> GetAll(string role, string userId)
        {
            try
            {
                var AdminFilter = Builders<LeadsModel>.Filter.Empty;
                if (role != "Admin")
                {
                    var rolefilter = Builders<LeadsModel>.Filter.Eq(x => x.CreatedById, userId);
                    AdminFilter = Builders<LeadsModel>.Filter.And(AdminFilter, rolefilter);

                }

                var leadslist = await _dbContext.Leads.Find(AdminFilter).ToListAsync();

                return (leadslist);

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
        /// <summary>
        /// Get all the leads that are linked to the client Id
        /// </summary>
        /// <param name="Id">Client Id</param>
        /// <returns>List of Leads </returns>
        /// <exception cref="Exception"></exception>

        public async Task<IEnumerable<LeadsModel>> GetLeadByClientId(string Id)
        {
            try
            {

                var filter = Builders<LeadsModel>.Filter.AnyEq(l => l.ClientIds, Id);
                var leads = await _dbContext.Leads.Find(filter).ToListAsync();
                return leads;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        /// <summary>
        /// Finds and returns the unique lead requested using Id
        /// </summary>
        /// <param name="Id">Lead Id</param>
        /// <returns>Lead</returns>
        /// <exception cref="Exception"></exception>

        public async Task<LeadsModel> GetLeadById(string Id)
        {

            try
            {
                LeadsModel lead = await _dbContext.Leads.Find(x => x.Id == Id).FirstOrDefaultAsync();

                return lead;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }

        }

        /// <summary>
        /// Returns the leads/Contact of the loggedin user or all to admin
        /// </summary>
        /// <param name="type">Lead Type</param>
        /// <param name="role"> User Role</param>
        /// <param name="userId">User Id</param>
        /// <param name="search">Search Params</param>
        /// <param name="filtertype">Field Params</param>
        /// <param name="filtervalue">Field Value params</param>
        /// <returns>List of Leads</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<PaginatedLeadResult> GetLeads(string type, string role, string userId, string? search, string? filtertype, string? filtervalue, int? pageNumber, int? pageSize)
        {
            try
            {
                if (!Enum.TryParse<LeadType>(type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                var leadfilter = Builders<LeadsModel>.Filter.Eq(x => x.Type, typeEnum);
                if (role != "Admin")
                {

                    var showfilter = Builders<LeadsModel>.Filter.Eq(x => x.CreatedById, userId);
                    leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, showfilter);
                }

                if (!string.IsNullOrEmpty(search))
                {
                    var searchFilter = Builders<LeadsModel>.Filter.Or(
                        Builders<LeadsModel>.Filter.Regex("Name", new BsonRegularExpression(search, "i")),
                        Builders<LeadsModel>.Filter.Regex("Email", new BsonRegularExpression(search, "i"))
                    );

                    leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, searchFilter);
                }
                if (!string.IsNullOrEmpty(filtertype) && !string.IsNullOrEmpty(filtervalue))
                {
                    var fieldfilter = Builders<LeadsModel>.Filter.Eq(filtertype, Enum.Parse<LeadStatus>(filtervalue, true));

                    leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, fieldfilter);
                }
                var totalCount = await _dbContext.Leads.CountDocumentsAsync(leadfilter);
                var skip = pageNumber.HasValue && pageSize.HasValue ? (pageNumber.Value - 1) * pageSize.Value : 0;

                var leadsList = await _dbContext.Leads
                    .Find(leadfilter)
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();
                PaginatedLeadResult response = new() { LeadList = leadsList, TotalCount = totalCount };
                return response;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        public async Task<List<LeadStatDto>> GetStats(int month, int year)
        {
            try
            {
                var result = await _dbContext.Leads.AsQueryable()
                                        .Where(doc => (doc.Type == LeadType.lead || doc.Type == LeadType.contact)
                                                      && doc.CreatedAt.Month == month
                                                      && doc.CreatedAt.Year == year)
                                        .GroupBy(doc => doc.CreatedAt.Day)
                                        .Select(g => new LeadStatDto
                                        {
                                            Day = g.Key,
                                            LeadCount = g.Count(x => x.Type == LeadType.lead),
                                            ContactCount = g.Count(x => x.Type == LeadType.contact)
                                        })
                                        .OrderBy(r => r.Day).ToListAsync();

                return result;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        /// <summary>
        /// Links a lead to a client
        /// </summary>
        /// <param name="LeadId">Lead Id</param>
        /// <param name="ClientId">Client Id</param>
        /// <returns>Updated Lead</returns>
        /// <exception cref="Exception"></exception>
        public async Task<LeadsModel> LinkClientToLead(string LeadId, string ClientId)
        {
            try
            {
                var updateDefinition = Builders<LeadsModel>.Update.AddToSet(x => x.ClientIds, ClientId);

                var lead = await _dbContext.Leads.FindOneAndUpdateAsync(
                    x => x.Id == LeadId,
                     updateDefinition,
                    new FindOneAndUpdateOptions<LeadsModel>
                    {
                        ReturnDocument = ReturnDocument.After
                    });

                return lead ?? throw new Exception("Lead not found");
            }
            catch (Exception ex)
            {
                throw new Exception("Database Error", ex);
            }
        }
        /// <summary>
        /// Unlinks the client from the lead
        /// </summary>
        /// <param name="LeadId">Lead Id</param>
        /// <param name="ClientId">Client Id</param>
        /// <returns>Updated Lead</returns>
        /// <exception cref="Exception"></exception>

        public async Task<LeadsModel> UnLinkClientToLead(string LeadId, string ClientId)
        {
            try
            {

                var updateDefination = Builders<LeadsModel>.Update.Pull(x => x.ClientIds, ClientId);
                var options = new FindOneAndUpdateOptions<LeadsModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                LeadsModel lead = await _dbContext.Leads.FindOneAndUpdateAsync(x => x.Id == LeadId, updateDefination, options);

                return lead;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
        /// <summary>
        /// Update the details of the Lead/Contact
        /// </summary>
        /// <param name="Id">Lead Id</param>
        /// <param name="Req">Lead Update Dto</param>
        /// <returns>Updated Lead</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<LeadsModel> UpdateLead(string Id, UpdateLeadRequest Req, bool isTypeChanged)
        {
            try
            {
                if (!Enum.TryParse<LeadType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                if (!Enum.TryParse<LeadStatus>(Req.Status, true, out var statusEnum))
                    throw new ArgumentException("Invalid type value");
                var updateDefinitions = Builders<LeadsModel>.Update
                                            .Set(x => x.Name, Req.Name)
                                            .Set(x => x.Email, Req.Email)
                                            .Set(x => x.Type, typeEnum)
                                            .Set(x => x.Status, statusEnum)
                                            .Set(x => x.PhoneNumber, Req.PhoneNumber);

                if (isTypeChanged)
                {
                    updateDefinitions = updateDefinitions.Set(x => x.CreatedAt, Req.CreatedAt);
                }

                var options = new FindOneAndUpdateOptions<LeadsModel> { ReturnDocument = ReturnDocument.After };

                var updatedLead = await _dbContext.Leads.FindOneAndUpdateAsync(
                    x => x.Id == Id,
                    updateDefinitions,
                    options);
                return updatedLead;
            }
            catch (Exception)
            {

                throw new Exception("Database error");
            }
        }
    }
}