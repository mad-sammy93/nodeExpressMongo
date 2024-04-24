const express = require("express")
const { connectToDb, getDb } = require('./db-config')
const app = express()

//middleware
app.use(express.json())

let db
connectToDb((err)=> {
  if(!err) {
    app.listen(3001, () => {
      console.log('Server is running...3001')
    })
    db = getDb()
  }
})

//Creating restful API points

//Defining routes

app.get('/api/people', (req, res) => {
  //logic
  //use pagination nd limit and skip
  //if someone is requesting /api/people = page 0

  const page = req.query.p || 0
  const peoplePerPage = 10
  // console.log(req);
  // console.log(res);

  let people = []
  db.collection('primary')
  .find()
  .sort({id:1})
  .skip(page * peoplePerPage)
  .limit(peoplePerPage)
  .forEach(pupil => people.push(pupil))
  .then(() => {
    res.status(200).json(people)
  })
  .catch(err => {
    res.status(500).json({error: 'Could not fetch people'})
    
  })
})


//Get single person using id
app.get('/api/people/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = db.collection('primary').findOne({id: id})
  person
  .then(person => {
    res.status(200).json(person)
  })
  .catch(err => {
    res.status(500).json({error: 'Could not find person'})
  }) 
})

//post
//Create a person
app.post('/api/people', (req, res) => {
  const person = req.body
  db.collection('primary').insertOne(person)
  .then(result => {
    res.status(201).json(result)
  })
  .catch(err => {
    res.status(500).json({error: 'Could not create person'})
  })
}) 

//Patch
//updating a person
app.patch('/api/people/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = req.body
  db.collection('primary').updateOne({id: id}, {$set: person})
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    res.status(500).json({error: 'Could not update person'})
  })
})

//Delete
//Remove a person
app.delete('/api/people/:id', (req, res) => {
  const id = Number(req.params.id)
  db.collection('primary').deleteOne({id: id})
  .then(result => {
    res.status(200).json(result) //204==delete successful
  })
  .catch(err => {
    res.status(500).json({error: 'Could not delete person'})
  })
})