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
                LeadsModel newLead = new() { Name = Req.Name, Email = Req.Email, Created_By_Id = userId, Type = Req.Type, Phone_Number = Req.Phone_Number };
                await _dbContext.Leads.InsertOneAsync(newLead);
                UsersModel user = await _dbContext.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();
                newLead.Created_By = new UserMaskedResponse() { Id = user.Id, Name = user.Name };
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

                    var userIds = leadslist.Select(l => l.Created_By_Id).Distinct().ToList();

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
                        if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
                        {
                            lead.Created_By = maskedUser;
                        }
                    }



                    return (leadslist);
                }
                else
                {
                    var leadslist = await _dbContext.Leads.Find(x => x.Created_By_Id == userId).ToListAsync();
                    var userIds = leadslist.Select(l => l.Created_By_Id).Distinct().ToList();

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
                        if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
                        {
                            lead.Created_By = maskedUser;
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
                UsersModel user = await _dbContext.Users.Find(x => x.Id == lead.Created_By_Id).FirstOrDefaultAsync();
                lead.Created_By = new UserMaskedResponse() { Id = user.Id, Name = user.Name };

                return lead;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }

        }

        public async Task<IEnumerable<LeadsModel>> GetLeads(string type, string role, string userId, string? search , string? filtertype, string? filtervalue)
        {
            try
            {
                if (role == "admin")
                {
                    var leadfilter = Builders<LeadsModel>.Filter.Eq(x => x.Type, type);

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
                        var fieldfilter = Builders<LeadsModel>.Filter.Eq(filtertype, filtervalue);

                        leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, fieldfilter);
                    }

                    var leadslist = await _dbContext.Leads.Find(leadfilter).ToListAsync();

                    var userIds = leadslist.Select(l => l.Created_By_Id).Distinct().ToList();

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
                        if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
                        {
                            lead.Created_By = maskedUser;
                        }
                    }



                    return (leadslist);
                }
                else
                {
                    var leadfilter = Builders<LeadsModel>.Filter.And(
                                        Builders<LeadsModel>.Filter.Eq(x => x.Type, type),
                                        Builders<LeadsModel>.Filter.Eq(x => x.Created_By_Id, userId)
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
                        var fieldfilter = Builders<LeadsModel>.Filter.Eq(filtertype, filtervalue);

                        leadfilter = Builders<LeadsModel>.Filter.And(leadfilter, fieldfilter);
                    }
                    var leadslist = await _dbContext.Leads.Find(leadfilter).ToListAsync();
                    var userIds = leadslist.Select(l => l.Created_By_Id).Distinct().ToList();

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
                        if (userDict.TryGetValue(lead.Created_By_Id, out var maskedUser))
                        {
                            lead.Created_By = maskedUser;
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

        public async Task<LeadsModel> UpdateLead(string Id, UpdateLeadRequest Req)
        {
            try
            {
                var updateDefinations = Builders<LeadsModel>.Update
                    .Set(x => x.Name, Req.Name)
                    .Set(x => x.Email, Req.Email)
                    .Set(x => x.Type, Req.Type)
                    .Set(x => x.Status, Req.Status)
                    .Set(x => x.Phone_Number, Req.Phone_Number);
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
