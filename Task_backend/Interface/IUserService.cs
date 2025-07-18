
using Microsoft.AspNetCore.Mvc;
using Task_backend.Dto;
using Task_backend.Models;

namespace Task_backend.Interface
{
    public interface IUserService
    {
        Task<UserServiceResponse?> SignupUser(SignupRequest Request);
        Task<UserServiceResponse?> LoginUser(LoginRequest Request);
        Task<UsersModel> GetUserById(string UserId);
        Task Logout(string token);
        Task<string> RefreshToken(string token);
        Task<PaginatedUserStatsDto> GetUserData(int month, int year, int pageSize, int pageNumber);
    }
}
