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
            RuleFor(x => x.Status).NotEmpty().WithMessage("Status is required.").Must(status => status == "active" || status == "inactive")
                .WithMessage("type must be either active or inactive");
            RuleFor(x => x.Address).NotNull().WithMessage("Address is required");

            RuleFor(x => x.Address.Street)
                .NotEmpty()
                .WithMessage("Street is required");

            RuleFor(x => x.Address.Area)
                .NotEmpty()
                .WithMessage("Area is required");

            RuleFor(x => x.Address.City)
                .NotEmpty()
                .WithMessage("City is required");

            RuleFor(x => x.Address.County)
                .NotEmpty()
                .WithMessage("County is required");

            RuleFor(x => x.Address.Pincode)
                .NotEmpty()
                .WithMessage("Pincode is required");

            RuleFor(x => x.Address.Country)
                .NotEmpty()
                .WithMessage("Country is required");
        }
    }
}
