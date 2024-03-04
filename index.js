const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware to parse JSON body
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'skr-cleansing-db.cluster-cnuupdm1vvla.ap-southeast-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM demo."user"');
    const users = result.rows;
    client.release();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM demo."user" WHERE username = $1 AND password = $2', [username, password]);
        
      if (result.rows.length > 0) {
        console.log('Login successful')
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
  
      client.release();
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  app.post('/update', async (req, res) => {
    const { username,first_name,last_name,age } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(`
      UPDATE  demo."user"
      SET first_name = $2, last_name = $3, age = $4,etl_dttm = NOW()
      WHERE username = $1`, [username, first_name,last_name,age]);
      if (result.rowCount > 0) {
        console.log('Login successful')
        res.status(200).json({ message: 'update successful' });
      } else {
        res.status(404).json({ message: 'update Fail' });
      }
  
      client.release();
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
app.post('/add', async (req, res) => {
    const { username,first_name,last_name,age } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(`select now() ,`, [username, first_name,last_name,age]);
      if (result.rowCount > 0) {
        console.log('Login successful')
        res.status(200).json({ message: 'update successful' });
      } else {
        res.status(404).json({ message: 'update Fail' });
      }
  
      client.release();
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
