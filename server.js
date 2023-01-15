/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*
* Name:         Kevin Vu-Tran 
* Student ID:   111314209
* Date:         2023/01/15
*
* Cyclic Link:  https://sheltered-sierra-02714.herokuapp.com/
*
********************************************************************************/

const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

const BodyParser = require('body-parser');
app.use(BodyParser.json());
// const HTTP_PORT = process.env.PORT || 8080;

const { celebrate, Joi, errors, Segments } = require('celebrate');

const MovieDB = require("./modules/movieDB.js");
const db = new MovieDB();

require("dotenv").config({ path: "./config/config.env" });

// db.initialize('mongodb+srv://${process.env.dbUser}:${process.env.dbPass}@cluster0-apgkj.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority')
db.initialize("mongodb+srv://ykim232:gusdn0649@cluster0.3kdsn.mongodb.net/sample_movies?retryWrites=true&w=majority")
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log('server listening');
  });
}).catch((err) => {
  console.log(err);
});

// ------------------------------------------------------------------------------------------

app.post("/api/movies",(req, res) => {
    db.addNewMovie(req.body)
      .then(() => {
        res.status(201).json("New movie added!");
      })
      .catch((err) => {
        res.status(500).json('Error has occured : ${err}');
      });
  });

app.get("/api/movies", celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().required(),
    perPage: Joi.number().required(),
    borough: Joi.string()
  })
}), (req, res) => {
  db.getAllMovies(req.query.page, req.query.perPage, req.query.borough)
    .then((movies) => {
      res.status(200).json(movies).sort(movies.movie_id);
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});

app.use((error, req, res, next) => {
  if (error.joi) {
    return res.status(400).json({
      error: error.joi.message
    });
  }
  return res.status(500).send(error)
})

app.get("/api/movies/:_id", (req, res) => {
  db.getMovieById(req.params._id)
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});


app.put("/api/movies/:_id", (req, res) => {
  db.updateMovieById(req.body, req.params._id)
    .then(() => {
      res.status(200).json('Movie (${req.params._id}) successfully updated');
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});

app.delete("/api/movies/:_id", (req, res) => {
  db.deleteMovieById(req.params._id)
    .then(() => {
      res.status(200).json('Movie (${req.params._id}) successfully deleted');
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"))
})
