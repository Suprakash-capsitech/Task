namespace Task_backend.Interface
{
    public interface IJwtService
    {

        string GenerateToken(string Id, string role);
        string GenerateRefreshToken(string Id);
        Boolean ValidateToken(string token);
    }
}
