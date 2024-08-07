import express from "express"
import cors from "cors"
import pg from "pg"
import env from "dotenv";
import bcrypt from "bcrypt"
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";

const app = express()
const port = 3000
const saltRounds = 5;

env.config()

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
  
db.connect();


//passport and session setup



async function showNotes(user) {
    try {
        console.log(user)
        const response = await db.query("SELECT b.nid, b.title, b.content FROM notes b INNER JOIN users a ON b.user_name = a.user_name WHERE a.user_name = $1", [user])
        console.log(response)
        return response.rows
    } catch (err) {
        console.log("ERROR DB FOR", err)
    } 
}

async function deleteNotes(id) {
    try {
        await db.query("DELETE FROM notes WHERE nid = $1", [id])
    } catch (err) {
        console.log("ERROR DB FOR", err)
    }
}

async function editNotes(content) {
    try {
        await db.query("UPDATE notes SET title = $1, content = $2 WHERE nid = $3", [content.title, content.content, content.uid])
    } catch (err) {
        console.log("ERROR DB FOR", err)
    }
}

async function createNotes(content) {
    try {
        await db.query("INSERT INTO notes (user_name, title, content) VALUES($1, $2, $3)", [content.user_name, content.title, content.content])
    } catch (err) {
        console.log("ERROR DB FOR", err)
    }
}


app.get("/api/show-data/:user", async (req, res) => {
    try {
      const user = req.params.user
      const notes = await showNotes(user);
      res.status(200).json(notes);
    } catch (err) {
      console.log("Error fetching notes", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete("/api/delete-data/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await deleteNotes(id)
      res.status(200).json({ message: `Note with id ${id} deleted successfully` });
    } catch (err) {
      console.log("Error deleting note", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.patch("/api/edit-data/note", async (req, res) => {
    try {
      const note = req.body
      await editNotes(note)
      res.status(200).json({ message: `Note edited successfully` });
    } catch (err) {
      console.log("Error fetching notes", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/api/post-data/note/:user", async (req, res) => {
    try {
      const note = {
        ...req.body,
        user_name: req.params.user
      }
      await createNotes(note)
      res.status(200).json({ message: `Note added added successfully` });
    } catch (err) {
      console.log("Error fetching notes", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //signUp route with hash and salting
  app.post("/api/signUp/submit", async (req, res) => {
    const uname = req.body.uname;
    const password = req.body.password;
  
    try {
      const checkResult = await db.query(
        "SELECT * FROM users WHERE user_name = $1",
        [uname]
      );
  
      if (checkResult.rows.length > 0) {
        res.status(200).json({ message: 'User already exists' });
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            res.status(500).json({ message: 'Server Error hashing password' });

          } else {
            const result = await db.query(
              "INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING *",
              [uname, hash]
            );
            res.status(200).json({message: 'Sign Up Success'})
          }
        });
      }
    } catch (err) {
      res.status(500).json({message: 'Database Error'})
    }
  })

  app.post('/api/logIn/submit', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Handle error
      }
      if (!user) {
        return res.status(200).json({ message: info.message || "Login failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err); // Handle error
        }
        return res.status(200).json({ message: "Login success" });
      });
    })(req, res, next);
  });
  


  passport.use(
    "local",
    new Strategy(
        {
            usernameField: 'uname',  
            passwordField: 'password'  
          },
          async function verify(uname, password, cb) {
      try {
        const result = await db.query(
          "SELECT * FROM users WHERE user_name = $1 ",
          [uname]
        );
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                return cb(null, user);
              } else {
                return cb(null, false, { message: 'Wrong password' });
              }
            }
          });
        } else {
          return cb(null, false, { message: 'User Not found' });
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  
  app.get("/api/verify", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({message: "user verified", user: req.user.user_name})
    } else {
        res.status(401).json({message: "unauthorized"})
    }
  })

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
  



app.listen(port, () => {
    console.log("listening on", port)
})