const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9pclo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection('services');

        //Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get single service
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //Post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //Delete API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running genius server');
});
app.get('/hello', (req, res) => {
    res.send('Hello updated here');
});

app.listen(port, () => {
    console.log('Running genius server on port', port);
})

/*
one time:
1.Heroku account open
2.Heroku software install

Every project:
1. git init
2. .gitignore(node_module, .env)
3. Push everything to git
4. Make sure you have this script: "start": "node index.js"
5. Make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main

Update:
1. Save everything check locally
2. git add ., git commit -m "", git push
3.
*/