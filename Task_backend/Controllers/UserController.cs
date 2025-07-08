using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Service;
using Task_backend.Validation;

namespace Task_backend.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class UserController(IUserService userService) : Controller
    {
        public readonly IUserService _userService = userService;
        [HttpPost("signup")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthticatedResponse?>> SignupUser(SignupRequest dto)
        {
            SignupValidator validator = new();
            ValidationResult result = validator.Validate(dto);
            if (result.IsValid)
            {

                try
                {
                    var user = await _userService.SignupUser(dto);
                    if (user == null)
                    {
                        return BadRequest("Invalid Credentials");
                    }


                    AuthticatedResponse res = new()
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = user.Role,
                        Token = user.Token,
                    };
                    Response.Cookies.Append("AuthToken", user.RefreshToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTimeOffset.UtcNow.AddDays(3)
                    });

                    return CreatedAtAction(nameof(SignupUser), res);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }

            }
            else
            {
                return BadRequest(result.Errors.FirstOrDefault()?.ErrorMessage);
            }
        }
        [HttpPost("login")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthticatedResponse>> LoginUser(LoginRequest dto)
        {
            LoginValidator validator = new();
            ValidationResult result = validator.Validate(dto);
            if (result.IsValid)
            {
                try
                {
                    var user = await _userService.LoginUser(dto);
                    if (user == null)
                    {
                        return BadRequest("Invalid Credentials");
                    }


                    AuthticatedResponse userResponse = new()
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Role = user.Role,
                        Token = user.Token,
                    };
                    Response.Cookies.Append("AuthToken", user.RefreshToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTimeOffset.UtcNow.AddDays(3)
                    });
                    return Ok(userResponse);

                }
                catch (Exception ex)
                {

                    return StatusCode(500, ex.Message);
                }

            }
            else
            {
                return BadRequest(result.Errors.FirstOrDefault());
            }
        }
        [HttpPost("logout")]

        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Logout()
        {
            if (!string.IsNullOrEmpty(Request.Cookies["AuthToken"]))
            {
                var token = Request.Cookies["AuthToken"]!;
                await _userService.Logout(token);

                Response.Cookies.Delete("AuthToken", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                });

                return NoContent();
            }

            return BadRequest("Auth token not found.");
        }

        [HttpGet("refresh")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> RefreshToken()
        {
            try
            {
                if (Request.Cookies.TryGetValue("AuthToken", out var token) && !string.IsNullOrEmpty(token))
                {
                    var newToken = await _userService.RefreshToken(token);
                    return Ok(newToken);
                }

                return BadRequest("Refresh token does not exist.");
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
        }
    }
}
