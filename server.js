import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
dotenv.config();

const dbUrl = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
//const dbUrl = `mongodb+srv://${process.env.DB_HOST}@${process.env.DB_NAME}.mongodb.net/test?retryWrites=true&w=majority`;
const validate = data => {
  let errors = {};
  if (data.title === '') errors.title = "Can't be empty";
  if (data.cover === '') errors.cover = "Can't be empty";
  if (data.desc === '') errors.desc = "Can't be empty";
  if (data.imbd === '') errors.imbd = "Can't be empty";
  const isValid = Object.keys(errors).length === 0;
  return { errors, isValid };
};

mongodb.MongoClient.connect(dbUrl, (err, db) =>  {
  
  if (err) {
    throw new Error(err);
  }

  app.get('/api/movies', (req, res) => {
    setTimeout(() => {
      db.collection('movies').find({}).toArray((err, movies) => {
        res.json({ movies });
      });
    }, 2000)
  });

  app.post('/api/movies', (req, res) => {
    const { errors, isValid } = validate(req.body);
    if (isValid) {
      const { title, cover, desc, imbd } = req.body;
      db.collection('movies').insert({ title, cover, desc, imbd }, (err, result) => {
        if (err) {
          res.status(500).json({ errors: { global: "Hata oluştu" }});
        } else {
          res.json({ movie: result.ops[0] });
        }
      });
    } else {
      res.status(400).json({ errors });
    }
  });

  app.put('/api/movies/:_id', (req, res) => {
    const { errors, isValid } = validate(req.body);

    if (isValid) {
      const { title, cover, desc, imbd } = req.body;
      db.collection('movies').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params._id) },
        { $set: { title, cover, desc, imbd } },
        { returnOriginal: false },
        (err, result) => {
          if (err) { res.status(500).json({ errors: { global: err }}); return; }

          res.json({ movie: result.value });
        }
      );
    } else {
      res.status(400).json({ errors });
    }
  });

  app.get('/api/movies/:_id', (req, res) => {
    setTimeout(() => {
      db.collection('movies').findOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, movie) => {
        res.json({ movie });
      })
    },2000)  
  });

  app.delete('/api/movies/:_id', (req, res) => {
    db.collection('movies').deleteOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, r) => {
      if (err) { res.status(500).json({ errors: { global: err }}); return; }

      res.json({});
    })
  });
/*
  app.use((req, res) => {
    res.status(404).json({
      errors: {
        global: "Still working on it. Please try again later when we implement it."
      }
    });
  });
*/
  app.get('/api/actors', (req, res) => {
    setTimeout(() => {
      db.collection('actors').find({}).toArray((err, actors) => {
        res.json({ actors });
      });
    }, 2000)
  });

  app.post('/api/actors', (req, res) => {
    const { errors, isValid } = validate(req.body);
    if (isValid) {
      const { title, cover, desc, imbd } = req.body;
      db.collection('actors').insert({ title, cover, desc, imbd }, (err, result) => {
        if (err) {
          res.status(500).json({ errors: { global: "Hata oluştu" }});
        } else {
          res.json({ actor: result.ops[0] });
        }
      });
    } else {
      res.status(400).json({ errors });
    }
  });

  app.put('/api/actors/:_id', (req, res) => {
    const { errors, isValid } = validate(req.body);

    if (isValid) {
      const { title, cover, desc, imbd } = req.body;
      db.collection('actors').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params._id) },
        { $set: { title, cover, desc, imbd } },
        { returnOriginal: false },
        (err, result) => {
          if (err) { res.status(500).json({ errors: { global: err }}); return; }

          res.json({ actor: result.value });
        }
      );
    } else {
      res.status(400).json({ errors });
    }
  });

  app.get('/api/actors/:_id', (req, res) => {
    setTimeout(() => {
      db.collection('actors').findOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, actor) => {
        res.json({ actor });
      })
    },2000)  
  });

  app.delete('/api/actors/:_id', (req, res) => {
    db.collection('actors').deleteOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, r) => {
      if (err) { res.status(500).json({ errors: { global: err }}); return; }

      res.json({});
    })
  });

  app.use((req, res) => {
    res.status(404).json({
      errors: {
        global: "Still working on it. Please try again later when we implement it."
      }
    });
  });

  app.listen(process.env.PORT || 8080, () => console.log('Server is running on localhost:8080'));

});
