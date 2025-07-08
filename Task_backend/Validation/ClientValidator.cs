using FluentValidation;
using Task_backend.Dto;

namespace Task_backend.Validation
{
    public class ClientValidator : AbstractValidator<CreateClientRequestDto>
    {
        public ClientValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Must be a valid email address");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Type).NotEmpty().WithMessage("Type is required.").Must(type => type == "limited" || type == "individual" || type == "LLP" || type == "Partnersihp")
                .WithMessage("type must be either limited, individual, LLP or Partnership");
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status is required.").Must(status => status == "active" || status == "inactive" )
                .WithMessage("type must be either active or inactive");

        }
    }
}
