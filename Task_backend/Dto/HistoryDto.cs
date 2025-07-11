using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Task_backend.Dto
{
    public class CreatedHistoryDto
    {
        public required string History_of { get; set; }
        public required string Description { get; set; }
        public required string Task_Performed { get; set; }

        public required string Performed_By_Id { get; set; }
    }

    //public class CreatedHistor
    //{
    //    public required TargetModel History_of { get; set; }
    //    public required string Description { get; set; }
    //    /// <summary>
    //    /// Action performed on client/lead/contact
    //    /// </summary>
    //    public required NoteType Task_Performed { get; set; }

    //    public required CreatedModel Performed_By_Id { get; set; }
    //}

    //public class CreatedModel
    //{
    //    /// <summary>
    //    /// User Id
    //    /// </summary>
    //    [BsonId]
    //    public string Id { get; set; }
    //    /// <summary>
    //    /// User name
    //    /// </summary>
    //    public string Name { get; set; }
    //    public DateTime Date { get; set; }
    //}

    //public class TargetModel
    //{
    //    /// <summary>
    //    /// Client / Lead /Contact Id
    //    /// </summary>
    //    [BsonId]
    //    public string Id { get; set; }
    //    /// <summary>
    //    /// Client / Lead /Contact Name
    //    /// </summary>
    //    public string Name { get; set; }
    //}

    //public enum NoteType
    //{
    //    [Display(Name = "", ShortName ="")]
    //    Unknown,
    //    [Display(Name = "Created", ShortName = "")]
    //    Created,
    //    [Display(Name = "Edit", ShortName = "")]
    //    Edit,
    //    Delete,
    //    Link,
    //    Unlink
    //}
   
}
