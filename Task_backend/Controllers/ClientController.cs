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
        /// Creates a new client with optional linked contacts and logs creation history.
        /// </summary>
        /// <param name="Req">Client creation request object</param>
        /// <returns>The created client object</returns>
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
                    if (String.IsNullOrEmpty(userId))
                    {
                        return Unauthorized();
                    }


                    var newClient = await _clientService.CreateClient(Req, userId);
                    CreatedHistoryDto historyRequest = new() { History_of = newClient.Id, Performed_By_Id = userId, Task_Performed = "Created", Description = $"Created Client by {newClient.Created_By.Name}" };
                    await _historyService.CreatedHistory(historyRequest);

                    if (newClient.Contact_Details?.Any() == true)
                    {
                        var contactHistories = newClient.Contact_Details.Select(contact => new[]
                        {
                                    new CreatedHistoryDto
                                    {
                                        History_of = newClient.Id,
                                        Performed_By_Id = userId,
                                        Task_Performed = "Linked",
                                        Description = $"Contact {contact.Name} was linked to Client"
                                    },
                                    new CreatedHistoryDto
                                    {
                                        History_of = contact.Id,
                                        Performed_By_Id = userId,
                                        Task_Performed = "Linked",
                                        Description = $"{contact.Name} was linked to Client {newClient.Name}"
                                    }
                         }).SelectMany(x => x).ToList();

                        var historyTasks = contactHistories.Select(_historyService.CreatedHistory);
                        await Task.WhenAll(historyTasks);
                    }

                    return Ok(newClient);

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


        /// <summary>
        /// Retrieves all clients created by the logged-in user, with optional search.
        /// </summary>
        /// <param name="search">Search keyword</param>
        /// <returns>List of clients</returns>
        [HttpGet("clients")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllClients([FromQuery] string? search, [FromQuery] string? filtertype, [FromQuery] string? filtervalue)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (String.IsNullOrEmpty(userId) )
                {
                    return Unauthorized();
                }


                var newClient = await _clientService.GetAllClients(userId, role, search,   filtertype,    filtervalue);
                return Ok(newClient);

            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }


        /// <summary>
        /// Retrieves a client by its unique ID.
        /// </summary>
        /// <param name="Id">Client ID</param>
        /// <returns>The client object</returns>
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


        /// <summary>
        /// Deletes a client by its ID.
        /// </summary>
        /// <param name="Id">Client ID</param>
        /// <returns>Deleted client object or result</returns>
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


        /// <summary>
        /// Updates an existing client's information and logs update history.
        /// </summary>
        /// <param name="Id">Client ID</param>
        /// <param name="Req">Updated client data</param>
        /// <returns>Updated client object</returns>
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
                    if (String.IsNullOrEmpty(userId))
                    {
                        return Unauthorized();
                    }


                    var newClient = await _clientService.UpdateClient(Id, Req);

                    CreatedHistoryDto historyRequest = new() { History_of = newClient.Id, Performed_By_Id = userId, Task_Performed = "Updated", Description = $"Clients Details were updated" };
                    await _historyService.CreatedHistory(historyRequest);

                    return Ok(newClient);

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

        /// <summary>
        /// Unlinks a lead/contact from the client and logs the unlinking activity.
        /// </summary>
        /// <param name="Id">Client ID</param>
        /// <param name="lead_id">Lead/Contact ID to unlink</param>
        /// <returns>Client object after unlinking</returns>
        [HttpPut("unlinklead/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Unlinklead(string Id, string lead_id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (String.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }
                var client = await _clientService.UnLinkLead(Id, lead_id);

                CreatedHistoryDto LinkRequest = new() { History_of = client.Id, Performed_By_Id = userId, Task_Performed = "Unlinked", Description = $"Contact was Unlinked from client " };
                CreatedHistoryDto LeadUnlinkRequest = new() { History_of = lead_id, Performed_By_Id = userId, Task_Performed = "Unlinked", Description = $"lead was Unlinked from client {client.Name}" };
                await _historyService.CreatedHistory(LinkRequest);
                await _historyService.CreatedHistory(LeadUnlinkRequest);

                return Ok(client);
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }

        /// <summary>
        /// Links a lead/contact to the client and logs the linking activity.
        /// </summary>
        /// <param name="Id">Client ID</param>
        /// <param name="lead_id">Lead/Contact ID to link</param>
        /// <returns>Client object after linking</returns>
        [HttpPut("linklead/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Linklead(string Id, string lead_id)
        {
            try
            {



                var client = await _clientService.LinkLead(Id, lead_id);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (String.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }
                var lead = client.Contact_Details.FirstOrDefault(x => x.Id == lead_id);
                if (lead != null)
                {
                    var clientHistory = new CreatedHistoryDto
                    {
                        History_of = client.Id,
                        Performed_By_Id = userId,
                        Task_Performed = "Linked",
                        Description = $"Contact {lead.Name} was linked to Client"
                    };

                    var leadHistory = new CreatedHistoryDto
                    {
                        History_of = lead.Id,
                        Performed_By_Id = userId,
                        Task_Performed = "Linked",
                        Description = $"{lead.Name} was linked to Client {client.Name}"
                    };

                    await Task.WhenAll(
                        _historyService.CreatedHistory(clientHistory),
                        _historyService.CreatedHistory(leadHistory)
                    );
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
