import dotenv from  'dotenv'
import express from 'express';
import connectDB from './db/index.js';


dotenv.config({
    path:"./env"
});
const app = express()
connectDB();



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(process.env.PORT, (req, res) => {
    console.log(`listening on port${process.env.PORT}`)
})

