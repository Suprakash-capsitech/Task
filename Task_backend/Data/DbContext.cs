using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Task_backend.Models;

namespace Task_backend.Data
{
    public class DbContext
    {
        public IMongoCollection<UsersModel> Users { get; }
        public IMongoCollection<ClientsModel> Clients { get; }
        public IMongoCollection<LeadsModel> Leads { get; }
        public IMongoCollection<HistoryModel> History{ get; }


        public DbContext(IOptions<MongoDBSettings> settings)
        {
            // This is given us connection string 
            MongoClient client = new MongoClient(settings.Value.MongoString);

            // Connecting to the database name 
            IMongoDatabase database = client.GetDatabase(settings.Value.MongoCollection);


            //Connecting to the collection name
            Users = database.GetCollection<UsersModel>(settings.Value.MongoDataBaseUser);
            Clients = database.GetCollection<ClientsModel>(settings.Value.MongoDataBaseClient);
            Leads = database.GetCollection<LeadsModel>(settings.Value.MongoDataBaseLead);
            History = database.GetCollection<HistoryModel>(settings.Value.MongoDataBaseHistory);
        }
    }
}
