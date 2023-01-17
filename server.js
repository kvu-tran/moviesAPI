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
* Cyclic Link:  https://mysterious-bull-undershirt.cyclic.app
* Code Repository: https://github.com/kvu-tran/moviesAPI
*
********************************************************************************/
/*
const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const BodyParser = require('body-parser');
app.use(BodyParser.json());

const { celebrate, Joi, errors, Segments } = require('celebrate');

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

require("dotenv").config();

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Ready to handle requests on port ' + HTTP_PORT);
  });
}).catch((err) => {
  console.log(err);
});

app.post("/api/movies",(req, res) => {
    db.addNewMovie(req.body)
      .then(() => {
        res.status(201).json("New movie added!");
      })
      .catch((err) => {
        res.status(500).json('Error has occured : ${err}');
      });
  });

app.get("/api/movies", (req, res) => {
    if (!req.query.page || !req.query.perPage)
      res.status(500).json({ error: "Query Parameters Needed." });
    else {
      db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((data) => {
          if (!data) res.status(204).json({ message: "No data found" });
          else res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
});

app.use((error, req, res, next) => {
  if (error.joi) {
    return res.status(400).json({
      error: error.joi.message
    });
  }
  return res.status(500).send(error)
})

app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});


app.put("/api/movies/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then(() => {
      res.status(200).json('Movie (${req.params.id}) successfully updated');
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then(() => {
      res.status(200).json('Movie (${req.params.id}) successfully deleted');
    })
    .catch((err) => {
      res.status(500).json('Error has occured : ${err}');
    });
});

app.get('/', (req, res) => {
  res.json(({message: "API Listening"}));
})

app.get("/home", (req, res) => {
  res.json({ message: "API Listening" });
});
*/

// Setup
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const MoviesDB = require("./modules/moviesDB.js");
require("dotenv").config();

const app = express();
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, function () {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Routes

// Home
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.get("/home", (req, res) => {
  res.json({ message: "API Listening" });
});

// Movies API
app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get("/api/movies", (req, res) => {
  if (!req.query.page || !req.query.perPage)
    res.status(500).json({ error: "Query Parameters Needed." });
  else {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
      .then((data) => {
        if (!data) res.status(204).json({ message: "No data found" });
        else res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.put("/api/movie/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: err });
    });
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// 404 Page
app.use((req, res) => {
  res.status(404).send("404 Page Not Found!");
});