const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const passportJWT = require('./middlewares/passportJWT')();

// Configuring the database
const dbConfig = require('./configs/config.js');
const mongoose = require('mongoose');

const app = express();

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const config = require('./configs/config.js');

app.use(cors());
// app.use("/uploads/", express.static(path.join(__dirname, "public")));
// Connecting to the database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to the database");    
  })
  .catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(passportJWT.initialize());


app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);
// app.use('/api/movie', passportJWT.authenticate(), movieRoutes);
app.use(errorHandler);

var PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => {
	console.log("Running at port", PORT);
});