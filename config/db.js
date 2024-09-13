const mongoose = require("mongoose");


async function dbInitialization() {
    // console.log("data base ");
    try {
        console.log(process.env.DB_URI);
        const dbURI =
            "mongodb+srv://divyendhsuresh:JG37zCckFeCj8DPd@clusterfortodo.bjylg.mongodb.net/todoapp?retryWrites=true&w=majority&appName=ClusterForToDo";
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(dbURI, options);
        console.log("Connected to MongoDB");

        // Handle MongoDB connection errors
        mongoose.connection.on(
            "error",
            console.error.bind(console, "MongoDB connection error:")
        );
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }
}

dbInitialization();

module.exports = mongoose.connection;
