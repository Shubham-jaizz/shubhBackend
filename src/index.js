// require('dotenv').config()
import dotenv from  'dotenv'
// const express = require('express')
import express from 'express';
const app = express()
dotenv.config();

const git  = {
    name:"Shubham Jaiswal",
    "last-Name":200000,
    sayhello : ()=>{
        console.log("we wann live happily");
    }
}
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/api/jokes', (req, res) => {

    res.send([
        {
            id:1,
            desc:"this is a joke 1"
        },
        {
            id:2,
            desc:"this is a joke 2"
        },
        {
            id:3,
            desc:"this is a joke 3"
        },
        {
            id:4,
            desc:"this is a joke 4"
        },
        {
            id:5,
            desc:"this is a joke 5"
        }


    ])
  })
app.get('/shubh', (req, res) => {
    res.json(git)
  })

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})