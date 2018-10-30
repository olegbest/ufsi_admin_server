const express = require('express');
const app = express();
const port = process.env.PORT || 8082;
const fs = require('fs');
const bodyParser = require('body-parser');
const https = require('https')

const cors = require('cors');

const routes = require('./routes/posts');

app.use(cors({origin: ['http://localhost:8080','http://www.admin.ufsi24.com', 'https://ufsi24.com', 'http://localhost:8081']}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


let Routes = new routes(app);
Routes.setup();

https.createServer({
    key: fs.readFileSync(__dirname+'/keys/server.key'),
    cert: fs.readFileSync(__dirname+'/keys/server.cert')
}, app)
    .listen(port, function () {
        console.log('Example app listening on port 3000! Go to https://localhost:/'+port)
    })







