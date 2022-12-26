const  {MongoClient}= require("mongodb")
const objectID = require("mongodb").ObjectId
const cors = require("cors")
// create express app
const express = require("express")
const app = express()
const port = process.env.PORT || 5000

// using middleware 
require("dotenv").config()
app.use(cors())
app.use(
    express.urlencoded({
      extended: true
    })
  )
app.use(express.json())
//mongodb connection setup
const ATLAS_URI=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtuf5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(ATLAS_URI)
const client = new MongoClient(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

async function main(){
    try{
        // database client connection setup
        await client.connect();
        const contents = client.db("cms").collection("contents")
        // specific route update post
        app.put("/posts/:id",async(req,res)=>{
            const id =await req.params.id
            const query =await {_id:objectID(id)}
            const docs =await req.body
            // this option instructs the method to create a document if no documents match the filter
            const options =await { upsert: true };
            // create a document that sets the plot of the movie
            const updateItem = {
                $set:docs,
            };
            const result =await contents.updateOne(query,updateItem,options)
            res.json(result)
        })
        // contents deleted request 
        app.delete('/posts/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:objectID(id)}
            const result = await contents.deleteOne(query)
            res.json(result)
        })

        // contents post 
        app.post('/posts',async(req,res)=>{
            const result =await contents.insertOne(req.body)
            res.json(result)
        })
        // get request 
        app.get("/posts",async(req,res)=>{
            const results =await contents.find({}).toArray()
            res.json(results)
        })
        // get request specific post
        app.get("/posts",async(req,res)=>{
            const results =await contents.find({}).toArray()
            res.json(results)
        })
    }finally{
        // perform actions on the collection object
        // client.close();
    }
}
main().catch(console.dir())
// root get request
app.get("/",(req,res)=>{
    res.send({message:"Server running!"})
})

// server port start
app.listen(port,()=>{
    console.log("Starting Server:",port)
})
