const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.whptl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        console.log(" Runig my database");
        const database = client.db("geniusMechanic");
        const serviceCollection = database.collection("services");

        // get api 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray()
            res.send(services)
        })

        // get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })


        // post api 
        app.post('/service', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.send(result)

        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Genius Car')
})

app.listen(port, () => {
    console.log('Runig Genius Server', port)
})