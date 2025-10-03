require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')
const { AboutUs } = require('./models/AboutUs')

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(
    async data => {
      console.log(`Connected to MongoDB`)
      await seedBio();
    }
  )
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about-us', async (req, res) => {
  try {
    const profile = await AboutUs.findOne().sort({ updatedAt: -1 }).lean();
    if (!profile) {
      return res.status(404).json({ error: 'bio not found' });
    }
    res.json({
      profile: profile,
      status: "all good",
    })

  } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: error,
        status: "something wrong",
      })
  }
})

async function seedBio(){
  const bio = {
    bio: "Hi, I'm Muyao (Jerry) Kong. I'm 20 years old, currently majoring CS at NYU Courant. Please reach out to me at mk9014@nyu.edu, or text me at +971 56 125 3818 or +1 (914)-893 7586",
    photo: "http://localhost:5002/assets/muyao-jerry-kong.jpeg"
  }
   await AboutUs.findOneAndUpdate(
    {},
    bio,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Seeded default profile');
}

const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, 'assets');
console.log('[assetsDir]', assetsDir);
console.log('[has file?]', fs.existsSync(path.join(assetsDir, 'muyao-jerry-kong.jpeg')));

app.use('/assets', express.static(assetsDir));
// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
