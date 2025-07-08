namespace Task_backend.Data
{
    public class MongoDBSettings
    {
        public string MongoString { get; set; } = null!;
        public string MongoCollection { get; set; } = null!;
        public string MongoDataBaseUser { get; set; } = null!;
        public string MongoDataBaseClient { get; set; } = null!;
        public string MongoDataBaseLead { get; set; } = null!;
        public string MongoDataBaseHistory { get; set; } = null!;

    }
}
