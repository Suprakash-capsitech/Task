using FluentValidation;
using Task_backend.Dto;

namespace Task_backend.Validation
{
    public class SignupValidator : AbstractValidator<SignupRequest>
    {
        public SignupValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.Role).NotEmpty().WithMessage("Role is required.")
           .Must(role => role == "admin" || role == "user")
           .WithMessage("Role must be either 'admin' or 'user'.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required").EmailAddress().WithMessage("Must be a valid email"); ;
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("Password must be at least 6 characters"); 
           
        }
    }
}
