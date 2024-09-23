const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const uri =  "mongodb+srv://venkatesh:INXHZXwWJps4AzLy@cluster0.vsxlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middlewares
app.use(express.json());
app.use(cors());

async function startServer() {
  try {

    await client.connect();

    console.log("Connected to MongoDB!");

    const database = client.db("doc-app"); 
    const usersCollection = database.collection("users"); 

    
    app.get("/users", async (req, res) => {
      try {
        const userSort = { createdAt: -1, updatedAt: -1 };
        const users = await usersCollection.find({}).sort(userSort).toArray();
        console.log(users);
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
      }
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const users = await usersCollection.find({ _id: new ObjectId(id) }).toArray();
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
      }
    });
    
    app.post("/users", async (req, res) => {
      try {
        const { email, password } = req.body;
        const newUser = {
          email: email,
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log(newUser);
        const result = await usersCollection.insertOne(newUser);
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
      }
    });

    app.put("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { email, password } = req.body;
        const newUser = {
          email: email,
          password: password,
          updatedAt: new Date(),
        };

        const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: newUser });
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Updated Successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
        //   console.log(usersCollection.updateOne({_id : new ObjectId(id)}, {$set : newUser}))
      } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
      }
    });

    app.delete("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Deleted Successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
      }
    });
    
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();
