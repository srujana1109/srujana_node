const http = require("http");
const fs = require("fs");
const path = require("path");
const {MongoClient} = require("mongodb");

// Port number that server listens to
const PORT = 1938;

const foodItemsDetails = async (client) =>{
    //Fetches records from given database
    const cursor = await client.db("RestarauntDB").collection("FoodItems").find({});
    const results = await cursor.toArray();
    return JSON.stringify(results);
}

const server = http.createServer(async (req,res) => {
    console.log(req.url);
    if(req.url === "/api"){
        const URL = "mongodb+srv://chinnolla:Srujana%401109@cluster0.dorddbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        // Creating a new client for connecting to database
        const client = new MongoClient(URL);
        try{
            // Connects to database
            await client.connect();
            console.log("Database is connected sucessfully");
            const foodData = await foodItemsDetails(client);
            // Handling CORS Issue
            res.setHeader("Access-Control-Allow-Origin", '*');
            res.writeHead(200,{"content-type":"application/json"});
            res.end(foodData);
        }
        catch(err){
            console.error("Error in connecting database",err);
        }
        finally{
            //Closing connection to database
            await client.close();
            console.log("Database connection is closed");
        }
    }
    else if(req.url === "/"){
        fs.readFile(path.join(__dirname,"public","index.html"),(err,content)=>{
            if(err){
                console.log("Error in opening/reading file",err);
            }
            else{
                res.writeHead(200,{"content-type":"text/html"});
                res.end(content);
            }
        });
    }
    else{
        res.writeHead(404,{"content-type":"text/html"});
        res.end("<h1>404 Page Not Found!</h1>");
    }
});

server.listen(PORT,()=>console.log(`Server is running on ${PORT}`));