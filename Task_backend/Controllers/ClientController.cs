using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Service;
using Task_backend.Validation;

namespace Task_backend.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class ClientController(IClientService clientService, IHistoryService historyService) : Controller
    {
        public readonly IClientService _clientService = clientService;

        public readonly IHistoryService _historyService = historyService;


        /// <summary>
        /// 
        /// </summary>
        /// <param name="Req"></param>
        /// <returns></returns>
        [HttpPost("createclient")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateClient(CreateClientRequestDto Req)
        {
            ClientValidator validator = new();
            ValidationResult validatedResult = validator.Validate(Req);
            if (validatedResult.IsValid)
            {

                try
                {
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (!String.IsNullOrEmpty(userId))
                    {


                        var newClient = await _clientService.CreateClient(Req, userId);
                        CreatedHistoryDto historyRequest = new() { History_of = newClient.Id, Performed_By_Id = userId, Task_Performed = "Created", Description = $"Created Client by {newClient.Created_By.Name}" };
                        await _historyService.CreatedHistory(historyRequest);
                        if (Req.Contact_Ids?.Length != 0)
                        {

                            CreatedHistoryDto LinkRequest = new() { History_of = newClient.Id, Performed_By_Id = userId, Task_Performed = "Linked", Description = $"Contacts Linked by {newClient.Created_By.Name}" };
                            await _historyService.CreatedHistory(LinkRequest);
                        }
                        return Ok(newClient);
                    }
                    else
                    {
                        return StatusCode(500);
                    }
                }
                catch (Exception)
                {

                    return StatusCode(500);
                }
            }
            else
            {

                return BadRequest(validatedResult.Errors.FirstOrDefault()?.ErrorMessage);
            }
        }



        [HttpGet("clients")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllClients()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (!String.IsNullOrEmpty(role) && !String.IsNullOrEmpty(userId))
                {


                    var newClient = await _clientService.GetAllClients(userId, role);
                    return Ok(newClient);
                }
                else
                {
                    return StatusCode(500);
                }
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }



        [HttpGet("client/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetClientById(string Id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!String.IsNullOrEmpty(userId))
                {


                    var newClient = await _clientService.GetClientById(Id);
                    return Ok(newClient);
                }
                else
                {
                    return StatusCode(500);
                }
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }



        [HttpDelete("deleteclient/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteClient(string Id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!String.IsNullOrEmpty(userId))
                {


                    var newClient = await _clientService.DeleteClient(Id);
                    return Ok(newClient);
                }
                else
                {
                    return StatusCode(500);
                }
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }



        [HttpPut("updateclient/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateClient(string Id, CreateClientRequestDto Req)
        {

            ClientValidator validator = new();
            ValidationResult validatedResult = validator.Validate(Req);
            if (validatedResult.IsValid)
            {
                try
                {
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (!String.IsNullOrEmpty(userId))
                    {


                        var newClient = await _clientService.UpdateClient(Id, Req);

                        CreatedHistoryDto historyRequest = new() { History_of = newClient.Id, Performed_By_Id = userId, Task_Performed = "Updated", Description = $"Clients Details were updated" };
                        await _historyService.CreatedHistory(historyRequest);

                        return Ok(newClient);
                    }
                    else
                    {
                        return StatusCode(500);
                    }
                }
                catch (Exception ex)
                {

                    return StatusCode(500, ex.Message);
                }
            }
            else
            {

                return BadRequest(validatedResult.Errors.FirstOrDefault()?.ErrorMessage);
            }

        }
        [HttpPut("unlinklead/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Unlinklead(string Id, string lead_id)
        {
            try
            {



                var client = await _clientService.UnLinkLead(Id, lead_id);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!String.IsNullOrEmpty(userId))
                {

                    CreatedHistoryDto LinkRequest = new() { History_of = client.Id, Performed_By_Id = userId, Task_Performed = "Unlinked", Description = $"Contact was Unlinked " };
                    await _historyService.CreatedHistory(LinkRequest);
                }
                return Ok(client);
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }
    }
}
