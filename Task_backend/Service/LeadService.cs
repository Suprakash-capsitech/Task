using MongoDB.Bson;
using MongoDB.Driver;
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
        public async Task<LeadsModel> CreateLead(CreateLeadRequest Req, string userId)
        {
            try
            {
                if (!Enum.TryParse<LeadType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                LeadsModel newLead = new() { Name = Req.Name, Email = Req.Email, CreatedById = userId, Type = typeEnum, PhoneNumber = Req.PhoneNumber, ClientIds = string.IsNullOrEmpty(Req.ClientId) ? new List<string>() : new List<string> { Req.ClientId } };
                await _dbContext.Leads.InsertOneAsync(newLead);
                UsersModel user = await _dbContext.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();
                newLead.CreatedBy = new UserMaskedResponse() { Id = user.Id, Name = user.Name };
                return newLead;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }


        }

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

        public async Task<IEnumerable<LeadsModel>> GetAll(string role, string userId)
        {
            try
            {
                if (role == "admin")
                {

                    var leadslist = await _dbContext.Leads.Find(x => true).ToListAsync();

                    var userIds = leadslist.Select(l => l.CreatedById).Distinct().ToList();

                    var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(filter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        }).ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);

                    foreach (var lead in leadslist)
                    {
                        if (userDict.TryGetValue(lead.CreatedById, out var maskedUser))
                        {
                            lead.CreatedBy = maskedUser;
                        }
                    }



                    return (leadslist);
                }
                else
                {
                    var leadslist = await _dbContext.Leads.Find(x => x.CreatedById == userId).ToListAsync();
                    var userIds = leadslist.Select(l => l.CreatedById).Distinct().ToList();

                    var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(filter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        }).ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);

                    foreach (var lead in leadslist)
                    {
                        if (userDict.TryGetValue(lead.CreatedById, out var maskedUser))
                        {
                            lead.CreatedBy = maskedUser;
                        }
                    }



                    return (leadslist);
                }


            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

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

        //public async Task<IEnumerable<LeadsModel>> GetContacts(string type, string role, string userId)
        //{
        //    try
        //    {
        //        if (role == "admin")
        //        {

        //            var leadslist = await _dbContext.Leads.Find(x => x.Type == "contact").ToListAsync();
        //            var userIds = leadslist.Select(l => l.Created_By_Id).Distinct().ToList();

        //            var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
        //            var users = await _dbContext.Users.Find(filter)
        //                .Project(u => new UserMaskedResponse
        //                {
        //                    Id = u.Id,
        //                    Name = u.Name
        //                }).ToListAsync();

        //            var userDict = users.ToDictionary(u => u.Id, u => u);

        //            foreach (var lead in leadslist)
        //            {
        //                if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
        //                {
        //                    lead.Created_By = maskedUser;
        //                }
        //            }
        //            return (leadslist);
        //        }
        //        else
        //        {
        //            var leadslist = await _dbContext.Leads.Find(x => x.Type == "contact" && x.Created_By_Id == userId).ToListAsync();
        //            var userIds = leadslist.Select(l => l.Created_By_Id).Distinct().ToList();

        //            var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
        //            var users = await _dbContext.Users.Find(filter)
        //                .Project(u => new UserMaskedResponse
        //                {
        //                    Id = u.Id,
        //                    Name = u.Name
        //                }).ToListAsync();

        //            var userDict = users.ToDictionary(u => u.Id, u => u);

        //            foreach (var lead in leadslist)
        //            {
        //                if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
        //                {
        //                    lead.Created_By = maskedUser;
        //                }
        //            }
        //            return (leadslist);
        //        }


        //    }
        //    catch (Exception)
        //    {

        //        throw new Exception("Database Error");
        //    }
        //}

        public async Task<LeadsModel> GetLeadById(string Id)
        {

            try
            {
                LeadsModel lead = await _dbContext.Leads.Find(x => x.Id == Id).FirstOrDefaultAsync();
                UsersModel user = await _dbContext.Users.Find(x => x.Id == lead.CreatedById).FirstOrDefaultAsync();
                lead.CreatedBy = new UserMaskedResponse() { Id = user.Id, Name = user.Name };

                return lead;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }

        }

        public async Task<IEnumerable<LeadsModel>> GetLeads(string type, string role, string userId, string? search, string? filtertype, string? filtervalue)
        {
            try
            {
                if (role == "admin")
                {
                    if (!Enum.TryParse<LeadType>(type, true, out var typeEnum))
                        throw new ArgumentException("Invalid type value");
                    var leadfilter = Builders<LeadsModel>.Filter.Eq(x => x.Type, typeEnum);

                    if (!string.IsNullOrEmpty(search))
                    {
                        var searchFilter = Builders<LeadsModel>.Filter.Or(
                            Builders<LeadsModel>.Filter.Regex("name", new BsonRegularExpression(search, "i")),
                            Builders<LeadsModel>.Filter.Regex("email", new BsonRegularExpression(search, "i"))
                        );

                        leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, searchFilter);
                    }
                    if (!string.IsNullOrEmpty(filtertype) && !string.IsNullOrEmpty(filtervalue))
                    {
                        var fieldfilter = Builders<LeadsModel>.Filter.Eq(filtertype, Enum.Parse<LeadStatus>(filtervalue,true));

                        leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, fieldfilter);
                    }

                    var leadslist = await _dbContext.Leads.Find(leadfilter).ToListAsync();

                    var userIds = leadslist.Select(l => l.CreatedById).Distinct().ToList();

                    var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(filter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        }).ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);

                    foreach (var lead in leadslist)
                    {
                        if (userDict.TryGetValue(lead.CreatedById, out var maskedUser))
                        {
                            lead.CreatedBy = maskedUser;
                        }
                    }



                    return (leadslist);
                }
                else
                {
                    if (!Enum.TryParse<LeadType>(type, true, out var typeEnum))
                        throw new ArgumentException("Invalid type value");
                    var leadfilter = Builders<LeadsModel>.Filter.And(
                                        Builders<LeadsModel>.Filter.Eq(x => x.Type, typeEnum),
                                        Builders<LeadsModel>.Filter.Eq(x => x.CreatedById, userId)
                                    );

                    if (!string.IsNullOrEmpty(search))
                    {
                        var searchFilter = Builders<LeadsModel>.Filter.Or(
                            Builders<LeadsModel>.Filter.Regex("name", new BsonRegularExpression(search, "i")),
                            Builders<LeadsModel>.Filter.Regex("email", new BsonRegularExpression(search, "i"))
                        );

                        leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, searchFilter);
                    }
                    if (!string.IsNullOrEmpty(filtertype) && !string.IsNullOrEmpty(filtervalue))
                    {
                        var fieldfilter = Builders<LeadsModel>.Filter.Eq(filtertype, Enum.Parse<LeadStatus>(filtervalue,true));

                        leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, fieldfilter);
                    }
                    var leadslist = await _dbContext.Leads.Find(leadfilter).ToListAsync();
                    var userIds = leadslist.Select(l => l.CreatedById).Distinct().ToList();

                    var filter = Builders<UsersModel>.Filter.In(u => u.Id, userIds);
                    var users = await _dbContext.Users.Find(filter)
                        .Project(u => new UserMaskedResponse
                        {
                            Id = u.Id,
                            Name = u.Name
                        }).ToListAsync();

                    var userDict = users.ToDictionary(u => u.Id, u => u);

                    foreach (var lead in leadslist)
                    {
                        if (userDict.TryGetValue(lead.CreatedById, out var maskedUser))
                        {
                            lead.CreatedBy = maskedUser;
                        }
                    }



                    return (leadslist);
                }


            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

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

                if (lead == null)
                {
                    throw new Exception("Lead not found");
                }

                return lead;
            }
            catch (Exception ex)
            {
                throw new Exception("Database Error", ex);
            }
        }

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

        public async Task<LeadsModel> UpdateLead(string Id, UpdateLeadRequest Req)
        {
            try
            {
                if (!Enum.TryParse<LeadType>(Req.Type, true, out var typeEnum))
                    throw new ArgumentException("Invalid type value");
                if (!Enum.TryParse<LeadStatus>(Req.Status, true, out var statusEnum))
                    throw new ArgumentException("Invalid type value");
                var updateDefinations = Builders<LeadsModel>.Update
                    .Set(x => x.Name, Req.Name)
                    .Set(x => x.Email, Req.Email)
                    .Set(x => x.Type, typeEnum)
                    .Set(x => x.Status, statusEnum)
                    .Set(x => x.PhoneNumber, Req.PhoneNumber);
                var options = new FindOneAndUpdateOptions<LeadsModel> { ReturnDocument = ReturnDocument.After };

                LeadsModel deletedLead = await _dbContext.Leads.FindOneAndUpdateAsync(x => x.Id == Id, updateDefinations, options);
                return deletedLead;
            }
            catch (Exception)
            {

                throw new Exception("Database error");
            }
        }
    }
}