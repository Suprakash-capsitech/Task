using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task_backend.Interface;
using Task_backend.Models;
using Task_backend.Service;

namespace Task_backend.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class HistoryController(IHistoryService historyService) : Controller
    {
        public readonly IHistoryService _historyService = historyService;


        [HttpGet("history/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> GetHistory(string Id)
        {
            try
            {
                var history = await _historyService.GetHistory(Id);
                return Ok(history);

            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.Message);
            }
        }
    }
}
