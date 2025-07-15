using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;
using Task_backend.Service;
using Task_backend.Validation;

namespace Task_backend.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class ClientController(IClientService clientService, IHistoryService historyService, IUserService userService, ILeadService leadService) : Controller
    {
        public readonly IClientService _clientService = clientService;

        public readonly IHistoryService _historyService = historyService;
        public readonly IUserService _userService = userService;
        public readonly ILeadService _leadService = leadService;


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
                    var user = await _userService.GetUserById(userId);
                    CreateHistory historyRequest = new()
                    {
                        HistoryOf = new TargetModel { Id = newClient.Id, Name = newClient.Name },
                        TaskPerformed = NoteType.Created,
                        Description = $"New Client was creaeted",
                        PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name }
                    };
                    await _historyService.CreatedHistory(historyRequest);
                    if (newClient.ContactDetails != null && newClient.ContactDetails.Count != 0)
                    {
                        var leadlinks = newClient.ContactIds.Select(leadId =>
                                   _leadService.LinkClientToLead(leadId, newClient.Id)
                               );

                        await Task.WhenAll(leadlinks);


                        var historyEntries = newClient.ContactDetails
                            .SelectMany(contact => new[]
                            {
                                    new CreateHistory
                                    {
                                        HistoryOf = new TargetModel { Id = newClient.Id, Name = newClient.Name },
                                        PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name },
                                        TaskPerformed = NoteType.Linked,
                                        Description = $"Contact {contact.Name} was linked to Client"
                                    },
                                    new CreateHistory
                                    {
                                        HistoryOf = new TargetModel { Id = contact.Id, Name = contact.Name },
                                        PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name },
                                        TaskPerformed = NoteType.Linked,
                                        Description = $"{contact.Name} was linked to Client {newClient.Name}"
            }
                            });

                        var historyTasks = historyEntries.Select(_historyService.CreatedHistory);
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
        public async Task<IActionResult> GetAllClients([FromQuery] string? search, [FromQuery] string? filtertype, [FromQuery] string? filtervalue, [FromQuery] int pageNumber=1, [FromQuery] int pageSize=1000)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (String.IsNullOrEmpty(userId) || String.IsNullOrEmpty(role))
                {
                    return Unauthorized();
                }


                var newClient = await _clientService.GetAllClients(userId, role, search, filtertype, filtervalue, pageNumber, pageSize);
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
                    var oldClient = await _clientService.GetClientById(Id);
                    // check for the updated fields then update description

                    string description = string.Empty;
                    var newClient = await _clientService.UpdateClient(Id, Req);

                    if (oldClient.Name != newClient.Name)
                        description += $"Name Updated from {oldClient.Name} to {newClient.Name}/";
                    if (oldClient.Email != newClient.Email)
                        description += $"Email Updated from {oldClient.Email} to {newClient.Email}/";
                    if (oldClient.Type != newClient.Type)
                        description += $"Type Updated from {oldClient.Type} to {newClient.Type}/";
                    if (oldClient.Status != newClient.Status)
                        description += $"Status Updated from {oldClient.Status} to {newClient.Status}/";
                    var user = await _userService.GetUserById(userId);
                    CreateHistory historyRequest = new()
                    {
                        HistoryOf = new TargetModel { Id = newClient.Id, Name = newClient.Name },
                        TaskPerformed = NoteType.Updated,
                        Description = description,
                        PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name }
                    };
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
        public async Task<IActionResult> Unlinklead(string Id, string leadId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (String.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }
                var client = await _clientService.UnLinkLead(Id, leadId);
                var user = await _userService.GetUserById(userId);
                var lead = await _leadService.UnLinkClientToLead(leadId, client.Id);
                CreateHistory LinkRequest = new()
                {
                    HistoryOf = new TargetModel { Id = client.Id, Name = client.Name },
                    PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name },
                    TaskPerformed = NoteType.Unlinked,
                    Description = $"{lead.Name} was Unlinked from client "
                };
                CreateHistory LeadUnlinkRequest = new()
                {
                    HistoryOf = new TargetModel
                    {
                        Id = lead.Id,
                        Name = lead.Name,
                    },
                    PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name },
                    TaskPerformed = NoteType.Unlinked,
                    Description = $"{lead.Name} was Unlinked from client {client.Name}"
                };
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



                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (String.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var client = await _clientService.LinkLead(Id, lead_id);

                var lead = await _leadService.LinkClientToLead(lead_id, client.Id);
                var user = await _userService.GetUserById(userId);
                if (lead != null)
                {
                    var clientHistory = new CreateHistory
                    {
                        HistoryOf = new TargetModel { Id = client.Id, Name = client.Name },
                        PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name },
                        TaskPerformed = NoteType.Linked,
                        Description = $"{lead.Name} was linked to client  "
                    };

                    var leadHistory = new CreateHistory
                    {
                        HistoryOf = new TargetModel
                        {
                            Id = lead.Id,
                            Name = lead.Name,
                        },
                        PerformedBy = new UserMaskedResponse { Id = userId, Name = user.Name },
                        TaskPerformed = NoteType.Linked,
                        Description = $"{lead.Name} was linked to client {client.Name}"
                    };

                    await Task.WhenAll(
                        _historyService.CreatedHistory(clientHistory),
                        _historyService.CreatedHistory(leadHistory)
                    );
                }

                return Ok(client);
            }
            catch (Exception ex)
            {

                return StatusCode(500,ex.Message);
            }
        }
    }
}