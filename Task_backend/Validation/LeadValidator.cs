using FluentValidation;
using Task_backend.Dto;

namespace Task_backend.Validation
{
    public class LeadValidator : AbstractValidator<CreateLeadRequest>
    {
        public LeadValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required").EmailAddress().WithMessage("Must be a valid email"); ;
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Phone Number is required").MinimumLength(10);
            RuleFor(x => x.Type).NotEmpty().WithMessage("Role is required.").Must(role => role == "lead" || role == "contact").WithMessage("Role must be either 'lead' or 'contact'.");

        }
    }
    public class UpdateLeadValidator : AbstractValidator<UpdateLeadRequest>
    {
        public UpdateLeadValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required").EmailAddress().WithMessage("Must be a valid email"); ;
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Phone Number is required").MinimumLength(10);
            RuleFor(x => x.Type).NotEmpty().WithMessage("Role is required.").Must(role => role == "lead" || role == "contact").WithMessage("Role must be either 'lead' or 'contact'.");
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status is required.").Must(stauts => stauts == "active" || stauts == "inactive").WithMessage("Staus must be either 'active' or 'inactive'.");

        }
    }
}