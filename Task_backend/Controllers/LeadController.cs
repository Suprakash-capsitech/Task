using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;
using Task_backend.Dto;
using Task_backend.Interface;
using Task_backend.Models;
using Task_backend.Validation;

namespace Task_backend.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class LeadController(ILeadService leadService, IClientService clientService, IHistoryService historyService, IUserService userService) : Controller
    {
        public readonly ILeadService _leadService = leadService;
        public readonly IClientService _clientService = clientService;
        public readonly IHistoryService _historyService = historyService;
        public readonly IUserService _userService = userService;
        [HttpPost("createlead")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> CreateLead(CreateLeadRequest req)
        {
            var validator = new LeadValidator();
            var validationResult = validator.Validate(req);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.FirstOrDefault()?.ErrorMessage);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            try
            {
                var newLead = await _leadService.CreateLead(req, userId);
                var user = await _userService.GetUserById(userId);
                await _historyService.CreatedHistory(new CreateHistory
                {
                    HistoryOf = new TargetModel { Id = newLead.Id, Name = newLead.Name },
                    PerformedBy = new UserMaskedResponse { Id = user.Id, Name = user.Name },
                    TaskPerformed = NoteType.Created,
                    Description = $"New {newLead.Type}, {newLead.Name} was created"
                });

                if (!string.IsNullOrEmpty(req.ClientId))
                {
                    try
                    {
                        var client = await _clientService.LinkLead(req.ClientId, newLead.Id);
                        var linkedLead = await _leadService.LinkClientToLead(newLead.Id, req.ClientId);

                        await _historyService.CreatedHistory(new CreateHistory
                        {
                            HistoryOf = new TargetModel { Id = client.Id, Name = client.Name },
                            PerformedBy = new UserMaskedResponse { Id = user.Id, Name = user.Name },
                            TaskPerformed = NoteType.Linked,
                            Description = $"{linkedLead.Name} was linked to client"
                        });

                        await _historyService.CreatedHistory(new CreateHistory
                        {
                            HistoryOf = new TargetModel { Id = linkedLead.Id, Name = linkedLead.Name },
                            PerformedBy = new UserMaskedResponse { Id = user.Id, Name = user.Name },
                            TaskPerformed = NoteType.Linked,
                            Description = $"{linkedLead.Name} was linked to client {client.Name}"
                        });
                    }
                    catch (Exception)
                    {
                        return StatusCode(500, "Failed to link lead to client");
                    }
                }

                

                return CreatedAtAction(nameof(CreateLead), new { id = newLead.Id }, newLead);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }




        [HttpGet("getall")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> GetAll()
        {
            try
            {

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (!String.IsNullOrEmpty(role) && !String.IsNullOrEmpty(userId))
                {

                    var contactList = await _leadService.GetAll(role, userId);
                    return Ok(contactList);
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

        [HttpGet("getleads")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> GetLeads([FromQuery] string? search, [FromQuery] string? filtertype, [FromQuery] string? filtervalue, [FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            try
            {

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                string type = "lead";
                if (!String.IsNullOrEmpty(role) && !String.IsNullOrEmpty(userId))
                {

                    var leadList = await _leadService.GetLeads(type, role, userId, search, filtertype, filtervalue, pageNumber, pageSize);
                    return Ok(leadList);
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




        [HttpGet("getcontacts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> GetContacts([FromQuery] string? search, [FromQuery] string? filtertype, [FromQuery] string? filtervalue, [FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                string type = "contact";
                if (!String.IsNullOrEmpty(role) && !String.IsNullOrEmpty(userId))
                {

                    var contactList = await _leadService.GetLeads(type, role, userId, search, filtertype, filtervalue ,pageNumber, pageSize );
                    return Ok(contactList);
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



        [HttpGet("lead/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> GetLeadById(string Id)
        {
            try
            {
                LeadsModel lead = await _leadService.GetLeadById(Id);
                return Ok(lead);
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }

        [HttpGet("leadbyclient/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> GetLeadByClientId(string Id)
        {
            try
            {
                var lead = await _leadService.GetLeadByClientId(Id);
                return Ok(lead);
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }



        [HttpDelete("deletelead/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> DeleteLead(string Id)
        {
            try
            {
                var leadList = await _leadService.DeleteLead(Id);
                return Ok(leadList);
            }
            catch (Exception)
            {

                return StatusCode(500);
            }
        }


        [HttpPut("updatelead/{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> UpdateLead(string Id, UpdateLeadRequest Req)
        {
            UpdateLeadValidator validate = new();
            ValidationResult validationResult = validate.Validate(Req);
            if (validationResult.IsValid)
            {
                try
                {
                    var leadOld = await _leadService.GetLeadById(Id);
                    var lead = await _leadService.UpdateLead(Id, Req);
                    string description = string.Empty;
                    //var type = Enum.Parse<LeadType>(Req.Type, true);
                    //var status = Enum.Parse<LeadStatus>(Req.Status, true);
                    if (leadOld.Name != lead.Name)
                        description += $"Name Updated from {leadOld.Name} to {lead.Name}/";
                    if (leadOld.Email != lead.Email)
                        description += $"Email Updated from {leadOld.Email} to {lead.Email}/";
                    if (leadOld.PhoneNumber != lead.PhoneNumber)
                        description += $"Phone Number Updated from {leadOld.PhoneNumber} to {lead.PhoneNumber}/";
                    if (leadOld.Type != lead.Type)
                        description += $"Type Updated from {leadOld.Type} to {lead.Type}/";
                    if (leadOld.Status != lead.Status)
                        description += $"Status Updated from {leadOld.Status} to {lead.Status}/";
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (!string.IsNullOrEmpty(userId))

                    {
                        var user = await _userService.GetUserById(userId);
                        CreateHistory historyRequest = new()
                        {
                            HistoryOf = new TargetModel { Id = lead.Id, Name = lead.Name },
                            PerformedBy = new UserMaskedResponse { Id = user.Id, Name = user.Name },
                            TaskPerformed = NoteType.Updated,
                            Description = description
                        };
                        await _historyService.CreatedHistory(historyRequest);
                    }
                    return Ok(lead);
                }
                catch (Exception)
                {

                    return StatusCode(500);
                }

            }
            else
            {
                return BadRequest(validationResult.Errors.FirstOrDefault()?.ErrorMessage);
            }
        }
    }
}