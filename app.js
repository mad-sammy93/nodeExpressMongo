const express = require("express");

const { connectToDb, getDb } = require('./db-config');

const app = express();

let db;
connectToDb((err)=> {
  if(!err) {
    app.listen(3001, () => {
      console.log('Server is running...')
    });
    db = getDb();
  }
})

