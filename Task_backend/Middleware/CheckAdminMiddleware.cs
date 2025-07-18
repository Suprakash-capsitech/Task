using System.Security.Claims;

namespace Task_backend.Middleware
{
    public class CheckAdminMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated != true)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized");
                return;
            }

            var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(role) || role != "Admin")
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Forbidden: Admins only.");
                return;
            }

            context.Items["UserRole"] = role;

            await _next(context);
        }
    }
}
