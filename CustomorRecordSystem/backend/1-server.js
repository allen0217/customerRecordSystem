 'use strict';
const express    = require('express');        
const bodyParser = require('body-parser');
const multer  = require('multer');


//const fileUpload = require('express-fileupload');
const path = require('path');

const app        = express();                 

const router = require('./1-router');

const mongoose   = require('mongoose');










mongoose.connect('mongodb://allen123:allen123@ds155263.mlab.com:55263/employ'),{ useNewUrlParser: true };
//mongoose.connect('mongodb://allen123:allen123@ds147681.mlab.com:47681/userlist'),{ useNewUrlParser: true };
//mongoose.connect('mongodb://admin:admin@ds056789.mlab.com:56789/dev'),{ useNewUrlParser: true };
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(fileUpload());
app.use('/static', express.static(path.join(__dirname, 'public')));   // serve static files



const port = process.env.PORT || 8888;    

app.use('/api', router);

app.use(express.static("uploads"));




app.get('/', (req, res) => {
                res.json({ message: 'hooray! welcome to our home!' });   
});

app.listen(port, () => {
                console.log('Magic happens on port ' + port)}
);  
/* 
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongodbConnect = require('./config/database');
const env = require('./config/env');
const routes = require('./routes');

const app = express();
mongodbConnect();


// middlewares
app.use(bodyParser.json());
app.use(fileUpload());
app.use('/static', express.static(path.join(__dirname, 'public')));   // serve static files

// routes
app.use('/api/employees', routes.employees);

app.use(function(req, res, next) {
    res.status(404).send('404 Not Found.');
});

module.exports = app; */