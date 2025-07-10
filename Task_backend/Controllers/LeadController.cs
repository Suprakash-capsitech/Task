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
    public class LeadController(ILeadService leadService, IClientService clientService, IHistoryService historyService) : Controller
    {
        public readonly ILeadService _leadService = leadService;
        public readonly IClientService _clientService = clientService;
        public readonly IHistoryService _historyService = historyService;

        [HttpPost("createlead")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LeadsModel>> CreateLead(CreateLeadRequest Req)
        {
            LeadValidator validate = new();
            ValidationResult validationResult = validate.Validate(Req);
            if (validationResult.IsValid)
            {
                try
                {
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (!string.IsNullOrEmpty(userId))
                    {
                        var newLead = await _leadService.CreateLead(Req, userId);
                        CreatedHistoryDto historyRequest = new() { History_of = newLead.Id, Performed_By_Id = userId, Task_Performed = "Created", Description = $"New {newLead.Type} was created" };
                        await _historyService.CreatedHistory(historyRequest);
                        if (!String.IsNullOrEmpty(Req.Client_id))
                        {
                            var client = await _clientService.LinkLead(Req.Client_id, newLead.Id);
                            CreatedHistoryDto Linkedhistory = new() { History_of = Req.Client_id, Performed_By_Id = userId, Task_Performed = "Linked", Description = $"{newLead.Name} was Linked to client  " };
                            await _historyService.CreatedHistory(Linkedhistory);
                            CreatedHistoryDto LeadLinkRequest = new() { History_of = newLead.Id, Performed_By_Id = userId, Task_Performed = "Linked", Description = $"{newLead.Name} was Linked to client {client.Name}" };
                            await _historyService.CreatedHistory(LeadLinkRequest);
                        }

                        return Ok(newLead);
                    }
                    else
                    {
                        return StatusCode(500, "Internal Server Error");
                    }

                }
                catch (Exception)
                {

                    return StatusCode(500, "Internal Server Error");

                }
            }
            else
            {
                return BadRequest(validationResult.Errors.FirstOrDefault()?.ErrorMessage);
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
        public async Task<ActionResult<LeadsModel>> GetLeads([FromQuery] string? search)
        {
            try
            {

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                string type = "lead";
                if (!String.IsNullOrEmpty(role) && !String.IsNullOrEmpty(userId))
                {

                    var leadList = await _leadService.GetLeads(type, role, userId, search);
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
        public async Task<ActionResult<LeadsModel>> GetContacts([FromQuery] string? search)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                string type = "contact";
                if (!String.IsNullOrEmpty(role) && !String.IsNullOrEmpty(userId))
                {

                    var contactList = await _leadService.GetLeads(type, role, userId , search);
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
                    var lead = await _leadService.UpdateLead(Id, Req);
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (!string.IsNullOrEmpty(userId))
                    {
                        CreatedHistoryDto historyRequest = new() { History_of = lead.Id, Performed_By_Id = userId, Task_Performed = "Updated", Description = $"Lead Details were updated" };
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
