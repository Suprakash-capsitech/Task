﻿
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Task_backend.Data;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;

namespace Task_backend.Service
{
    public class UserService(DbContext dbcontext, IPasswordService passwordService, IJwtService jwtService) : IUserService
    {
        public readonly DbContext _dbContext = dbcontext;
        public readonly IPasswordService _passwordService = passwordService;
        public readonly IJwtService _jwtService = jwtService;

        /// <summary>
        /// Login user using email and password
        /// </summary>
        /// <param name="Request">Dto to Login</param>
        /// <returns>User Response with name, role,token</returns>
        public async Task<UserServiceResponse?> LoginUser(LoginRequest Request)
        {
            var filter = Builders<UsersModel>.Filter.Eq(x => x.Email, Request.Email);
            var exist = await _dbContext.Users.Find(filter).FirstOrDefaultAsync();
            if (exist == null || !_passwordService.VerifyPassowrd(Request.Password, exist.Password))
            {
                return null;
            }
            else
            {

                string token = _jwtService.GenerateToken(exist.Id, exist.Role.ToString());
                string Refreshtoken = _jwtService.GenerateRefreshToken(exist.Id);
                //update the token in the database
                var options = new FindOneAndUpdateOptions<UsersModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                var updateDef = Builders<UsersModel>.Update.Set(x => x.Token, Refreshtoken);
                exist = await _dbContext.Users.FindOneAndUpdateAsync(x => x.Email == Request.Email, updateDef, options);
                UserServiceResponse response = new() { Id = exist.Id, Email = exist.Email, Token = token, RefreshToken = exist.Token, Name = exist.Name, Role = exist.Role.ToString() };

                return response;
            }
        }
        /// <summary>
        /// Create a user and login 
        /// </summary>
        /// <param name="Request">User dto</param>
        /// <returns>a new user with name ,role and token </returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="Exception"></exception>
        public async Task<UserServiceResponse?> SignupUser(SignupRequest Request)
        {
            if (!Enum.TryParse<UserRoles>(Request.Role, true, out var typeEnum))
                throw new ArgumentException("Invalid type value");
            var filter = Builders<UsersModel>.Filter.Eq(x => x.Email, Request.Email);
            var exist = await _dbContext.Users.Find(filter).FirstOrDefaultAsync();

            if (exist != null)
            {
                throw new Exception("User Already exist");
            }
            string HashedPassword = _passwordService.HashedPassword(Request.Password);
            UsersModel newuser = new() { Email = Request.Email, Name = Request.Name, Password = HashedPassword, Role = typeEnum };
            await _dbContext.Users.InsertOneAsync(newuser);

            string token = _jwtService.GenerateToken(newuser.Id, newuser.Role.ToString());
            string Refreshtoken = _jwtService.GenerateRefreshToken(newuser.Id);

            //update the token in the database
            var options = new FindOneAndUpdateOptions<UsersModel>
            {
                ReturnDocument = ReturnDocument.After
            };
            var updateDef = Builders<UsersModel>.Update.Set(x => x.Token, Refreshtoken);

            newuser = await _dbContext.Users.FindOneAndUpdateAsync(x => x.Email == Request.Email, updateDef, options);


            // Mapping

            UserServiceResponse response = new() { Id = newuser.Id, Email = newuser.Email, Token = token, RefreshToken = newuser.Token, Name = newuser.Name, Role = newuser.Role.ToString() };

            return response;
        }
        /// <summary>
        /// Validate Refresh token and Generate a new Token if validated
        /// </summary>
        /// <param name="token">refresh token</param>
        /// <returns>New Jwt Token with 3 hours validity</returns>
        /// <exception cref="Exception"></exception>
        public async Task<String> RefreshToken(string token)
        {

            UsersModel exist = await _dbContext.Users.Find(x => x.Token == token).FirstOrDefaultAsync() ?? throw new Exception("No Refresh Token in the Database");
            bool result = _jwtService.ValidateToken(exist.Token);
            if (result)
            {
                return _jwtService.GenerateToken(exist.Id, exist.Role.ToString());
            }
            else
            {
                throw new Exception("Refresh Token Expired Login in again");
            }

        }

        /// <summary>
        /// Logout a user and remove refresh token from DB
        /// </summary>
        /// <param name="token">Refresh token</param>
        /// <returns></returns>
        public async Task Logout(string token)
        {
            var updateDefinition = Builders<UsersModel>.Update.Set(t => t.Token, "");
            var options = new FindOneAndUpdateOptions<UsersModel> { ReturnDocument = ReturnDocument.After };
            await _dbContext.Users.FindOneAndUpdateAsync(x => x.Token == token, updateDefinition, options);
            return;
        }

        /// <summary>
        /// Gets a specific user with id
        /// </summary>
        /// <param name="UserId">User Id</param>
        /// <returns>User Object</returns>
        /// <exception cref="Exception"></exception>
        public async Task<UsersModel> GetUserById(string UserId)
        {
            try
            {
                var user = await _dbContext.Users.Find(x => x.Id == UserId).FirstOrDefaultAsync();

                return user;

            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }

        public async Task<PaginatedUserStatsDto> GetUserData(int month, int year, int pageSize, int pageNumber)
        {
            try
            {
                int filterMonth = month;
                int filterYear = year;

                int skipCount = (pageNumber - 1) * pageSize;
                var pipeline = new[]
                                 {
                                    new BsonDocument
                                    {
                                        { "$lookup", new BsonDocument
                                            {
                                                { "from", "Leads" },
                                                { "localField", "_id" },
                                                { "foreignField", "CreatedById" },
                                                { "as", "LeadCount" },
                                                { "pipeline", new BsonArray
                                                    {
                                                      new BsonDocument
                                                       {
                                                            { "$match", new BsonDocument
                                                                {
                                                                    { "Type", 1 },
                                                                    { "$expr", new BsonDocument
                                                                        {
                                                                            { "$and", new BsonArray
                                                                                {
                                                                                    new BsonDocument("$eq", new BsonArray { new BsonDocument("$month", "$CreatedAt"), filterMonth }),
                                                                                    new BsonDocument("$eq", new BsonArray { new BsonDocument("$year", "$CreatedAt"), filterYear })
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    new BsonDocument
                                    {
                                        { "$lookup", new BsonDocument
                                            {
                                                { "from", "Leads" },
                                                { "localField", "_id" },
                                                { "foreignField", "CreatedById" },
                                                { "as", "ContactCount" },
                                                { "pipeline", new BsonArray
                                                    {
                                                        new BsonDocument
                                                        {
                                                            { "$match", new BsonDocument
                                                                {
                                                                    { "Type", 2 },
                                                                    { "$expr", new BsonDocument
                                                                        {
                                                                            { "$and", new BsonArray
                                                                                {
                                                                                    new BsonDocument("$eq", new BsonArray { new BsonDocument("$month", "$CreatedAt"), filterMonth }),
                                                                                    new BsonDocument("$eq", new BsonArray { new BsonDocument("$year", "$CreatedAt"), filterYear })
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    new BsonDocument
                                    {
                                        { "$lookup", new BsonDocument
                                            {
                                                { "from", "Clients" },
                                                { "localField", "_id" },
                                                { "foreignField", "CreatedById" },
                                                { "as", "ClientCount" },
                                                { "pipeline", new BsonArray
                                                    {
                                                        new BsonDocument
                                                        {
                                                            { "$match", new BsonDocument
                                                                {
                                                                    { "$expr", new BsonDocument
                                                                        {
                                                                            { "$and", new BsonArray
                                                                                {
                                                                                    new BsonDocument("$eq", new BsonArray { new BsonDocument("$month", "$CreatedAt"), filterMonth }),
                                                                                    new BsonDocument("$eq", new BsonArray { new BsonDocument("$year", "$CreatedAt"), filterYear })
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    new BsonDocument
                                        {
                                            { "$project", new BsonDocument
                                                {
                                                    { "_id", 1 },
                                                    { "name", 1 },
                                                    { "LeadCount", new BsonDocument("$size", "$LeadCount") },
                                                    { "ContactCount", new BsonDocument("$size", "$ContactCount") },
                                                    { "ClientCount", new BsonDocument("$size", "$ClientCount") }
                                                }
                                            }
                                        },
                                    new BsonDocument("$skip", skipCount),
                                    new BsonDocument("$limit", pageSize)

                                    };
                var totalCount = await _dbContext.Users.CountDocumentsAsync(x=> true);
                var result = await _dbContext.Users.Aggregate<BsonDocument>(pipeline).ToListAsync();
                var userList = result.Select(b => BsonSerializer.Deserialize<UserStatsDto>(b)).ToList();
                PaginatedUserStatsDto response = new() { UserList = userList, TotalCount = totalCount };
                return response;
            }
            catch (Exception)
            {

                throw new Exception("Database Error");
            }
        }
    }
}
