const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9nw5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const databse = client.db("traveldb");
        const packageCollecton = databse.collection("package");
        const bookingCollection = databse.collection('booking');

        //get package api
        app.get('/package', async (req, res) => {
            const params = req.params;
            const cursor = packageCollecton.find({});
            const package = await cursor.toArray();
            console.log(package);
            res.json(package);
        })

        //post booking api
        app.post('/booking', async (req, res) => {
            const order = req.body;
            const result = await bookingCollection.insertOne(order)
            res.json(result)
        })

        //get booking api
        app.get('/booking', async (req, res) => {
            const params = req.params;

            const cursor = bookingCollection.find({});
            const order = await cursor.toArray();
            // console.log(order);
            res.json(order);
        })

        //Delete booking API

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await bookingCollection.deleteOne(query);
            // console.log("delet with id:", result);
            res.json(result);
        })

    }
    finally {

    }


}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running');
});
app.listen(port, () => {
    console.log('server running at port', port);
})