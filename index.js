const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

port = 7000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("GeniusMechanic2");
    const Servicescollection = database.collection("Services");

    //   post api
    app.post("/services", async (req, res) => {
      const data = req.body;
      const result = await Servicescollection.insertOne(data);
      res.send(result);
    });

    // get api
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = Servicescollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get singel services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Servicescollection.findOne(query);
      res.send(result);
    });

    // update api
    app.put("/services/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          name: data.name,
          price: data.price,
        },
      };
      const result = await Servicescollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // delete api

    app.delete(`/services/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log(id);
      const result = await Servicescollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server runing in PORT :", port);
});
