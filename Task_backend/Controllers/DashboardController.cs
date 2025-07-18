using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Task_backend.Dto;
using Task_backend.Interface;

namespace Task_backend.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize(Roles = "Admin")]


    public class DashboardController(ILeadService leadService, IClientService clientService, IHistoryService historyService, IUserService userService) : Controller
    {
        public readonly ILeadService _leadService = leadService;
        public readonly IClientService _clientService = clientService;
        public readonly IHistoryService _historyService = historyService;
        public readonly IUserService _userService = userService;
        [HttpGet("getuserdata")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PaginatedUserStatsDto>> GetUserData([FromQuery] string period, [FromQuery] int pageSize = 1000, [FromQuery] int pageNumber = 1)
        {
            try
            {
                int month;
                int year;
                switch (period)
                {
                    case "this-month":
                        {
                            var currentDate = DateTime.Today;
                            month = currentDate.Month;
                            year = currentDate.Year;
                            break;
                        }
                    case "last-month":
                        {
                            var currentDate = DateTime.Today.AddMonths(-1);
                            month = currentDate.Month;
                            year = currentDate.Year;
                            break;
                        }
                    default:
                        {
                            throw new ArgumentException("Invalid period specified.");
                        }
                }
                var userlist = await _userService.GetUserData(month, year, pageSize, pageNumber);
                return Ok(userlist);

            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
        [HttpGet("getstats")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetStats([FromQuery] string period)
        {
            try
            {
                int month;
                int year;
                switch (period)
                {
                    case "this-month":
                        {
                            var currentDate = DateTime.Today;
                            month = currentDate.Month;
                            year = currentDate.Year;
                            break;
                        }
                    case "last-month":
                        {
                            var currentDate = DateTime.Today.AddMonths(-1);
                            month = currentDate.Month;
                            year = currentDate.Year;
                            break;
                        }
                    default:
                        {
                            throw new ArgumentException("Invalid period specified.");
                        }
                }
                var leadStats = await _leadService.GetStats(month, year);
                var clientStats = await _clientService.GetStats(month, year);
                var daysInMonth = Enumerable.Range(1, DateTime.DaysInMonth(year, month));
                var combinedStats = daysInMonth
                                       .Select(day => {
                                           var leadDay = leadStats.FirstOrDefault(x => x.Day == day);
                                           var clientDay = clientStats.FirstOrDefault(x => x.Day == day);

                                           return new CombinedStatDto
                                           {
                                               Id = day,
                                               LeadCount = leadDay?.LeadCount ?? 0,
                                               ContactCount = leadDay?.ContactCount ?? 0,
                                               ClientCount = clientDay?.ClientCount ?? 0
                                           };
                                       })
                                       .ToList();

                return Ok(combinedStats);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

    }

}
