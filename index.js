require('dotenv').config()
const express = require('express')
const app = express()


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
app.get('/shubhu', (req, res) => {
    res.send('sneha ki ma ki chut bhsdiwali')
  })
app.get('/shubh', (req, res) => {
    res.json(git)
  })

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})