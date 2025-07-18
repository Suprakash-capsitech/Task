using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Task_backend.Dto
{

    public class CreateHistory
    {

        public required TargetModel HistoryOf { get; set; }
        /// <summary>
        /// Desctiption of the tasks performed on it
        /// </summary>
        public required string Description { get; set; }
        /// <summary>
        /// Action performed on client/lead/contact
        /// </summary>
        public required NoteType TaskPerformed { get; set; }

        /// <summary>
        /// Name and Id of the User
        /// </summary>
        public required UserMaskedResponse PerformedBy { get; set; }
    }



    public class TargetModel
    {
        /// <summary>
        /// Client / Lead /Contact Id
        /// </summary>
        [BsonId]
        public required string Id { get; set; }
        /// <summary>
        /// Client / Lead /Contact Name
        /// </summary>
        public required string Name { get; set; }
    }

    /// <summary>
    /// Task Performed Type Values
    /// </summary>
    public enum NoteType
    {
        [Display(Name = "Unknown", ShortName = "")]
        Unknown,

        [Display(Name = "Created", ShortName = "")]
        Created,

        [Display(Name = "Updated", ShortName = "")]
        Updated,

        [Display(Name = "Deleted", ShortName = "")]
        Deleted,

        [Display(Name = "Linked", ShortName = "")]
        Linked,

        [Display(Name = "Unlinked", ShortName = "")]
        Unlinked
    }
}
