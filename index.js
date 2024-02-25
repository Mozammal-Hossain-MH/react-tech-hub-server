const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4zcowrs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const brandsCollection = client.db('TechHub').collection('brands');
const productsCollection = client.db('TechHub').collection('products');
const cartCollection = client.db('TechHub').collection('cart');

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray()
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:brandName', async (req, res) => {
            const brandName = req.params.brandName;
            const query = { brandName: brandName };
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:brandName/:id', async (req, res) => {
            const { brandName, id } = req.params;
            const query = {
                _id: new ObjectId(id),
                brandName: brandName
            };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const gadget = req.body;
            const result = await productsCollection.insertOne(gadget);
            res.send(result);
        })

        app.put('/products/:id', async (req, res) => {
            const gadget = req.body;
            const id = req.params.id;
            console.log(gadget);
            const filter = { _id: new ObjectId(id) }
            const updateGadget = {
                $set: {
                    name: gadget.name,
                    brandName: gadget.brandName,
                    type: gadget.type,
                    imageURL: gadget.imageURL,
                    price: gadget.price,
                    deletedPrice: gadget.deletedPrice,
                    rating: gadget.rating,
                    description: gadget.description,
                }
            }
            const result = await productsCollection.updateOne(filter, updateGadget);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/cart-products', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get(`/cart-products/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            const result = await cartCollection.findOne(query);
            res.send(result);
        })

        app.post('/cart-products', async (req, res) => {
            const cartProductId = req.body;
            console.log(cartProductId);
            const result = await cartCollection.insertOne(cartProductId);
            res.send(result);
        })

        app.delete('/cart-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send({
        message: 'Tech server is running'
    })
})

app.listen(port, () => {
    console.log(`Tech Hub listening on port ${port}`)
})