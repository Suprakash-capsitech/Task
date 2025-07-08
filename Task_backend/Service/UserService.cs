
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
                
                string token = _jwtService.GenerateToken(exist.Id, exist.Role);
                string Refreshtoken = _jwtService.GenerateRefreshToken(exist.Id);
                //update the token in the database
                var options = new FindOneAndUpdateOptions<UsersModel>
                {
                    ReturnDocument = ReturnDocument.After
                };
                var updateDef = Builders<UsersModel>.Update.Set(x => x.Token, Refreshtoken);
                exist = await _dbContext.Users.FindOneAndUpdateAsync(x => x.Email == Request.Email, updateDef, options);
                UserServiceResponse response = new() { Id = exist.Id, Email = exist.Email, Token = token, RefreshToken = exist.Token, Name = exist.Name, Role = exist.Role };

                return response;
            }
        }
        public async Task<UserServiceResponse?> SignupUser(SignupRequest Request)
        {
            var filter = Builders<UsersModel>.Filter.Eq(x => x.Email, Request.Email);
            var exist = await _dbContext.Users.Find(filter).FirstOrDefaultAsync();

            if (exist != null)
            {
                throw new Exception("User Already exist");
            }
            string HashedPassword = _passwordService.HashedPassword(Request.Password);
            UsersModel newuser = new() { Email = Request.Email, Name = Request.Name, Password = HashedPassword ,Role= Request.Role};
            await _dbContext.Users.InsertOneAsync(newuser);

            string token = _jwtService.GenerateToken(newuser.Id, newuser.Role);
            string Refreshtoken = _jwtService.GenerateRefreshToken(newuser.Id);

            //update the token in the database
            var options = new FindOneAndUpdateOptions<UsersModel>
            {
                ReturnDocument = ReturnDocument.After
            };
            var updateDef = Builders<UsersModel>.Update.Set(x => x.Token, Refreshtoken);
            
            newuser = await _dbContext.Users.FindOneAndUpdateAsync(x => x.Email == Request.Email, updateDef, options);
            
            
            // Mapping
            
            UserServiceResponse response = new() { Id = newuser.Id, Email = newuser.Email, Token = token, RefreshToken = newuser.Token, Name = newuser.Name, Role = newuser.Role };

            return response;
        }
        public async Task<String> RefreshToken(string token)
        {

            UsersModel exist = await _dbContext.Users.Find(x => x.Token == token).FirstOrDefaultAsync() ?? throw new Exception("No Refresh Token in the Database");
            bool result = _jwtService.ValidateToken(exist.Token);
            if (result)
            {
                return _jwtService.GenerateToken(exist.Id, exist.Role);
            }
            else
            {
                throw new Exception("Refresh Token Expired Login in again");
            }

        }

        public async Task Logout(string token)
        {
            var updateDefinition = Builders<UsersModel>.Update.Set(t => t.Token, "");
            var options = new FindOneAndUpdateOptions<UsersModel> { ReturnDocument = ReturnDocument.After };
            await _dbContext.Users.FindOneAndUpdateAsync(x=> x.Token== token,updateDefinition,options);
            return;
        }
    }
}
