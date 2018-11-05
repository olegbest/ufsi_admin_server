const express = require('express');
const app = express();
const port = process.env.PORT || 8082;
const fs = require('fs');
const bodyParser = require('body-parser');
const https = require('https');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const routes = require('./routes/posts');

app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080', 'http://www.admin.ufsi24.com', 'http://admin.ufsi24.com', 'https://ufsi24.com', 'https://www.ufsi24.com', 'http://ufsi24.com', 'http://www.ufsi24.com', 'http://localhost:8081']
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'ilovescotchscotchyscotchscotch123UFSI123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    }
}))


let Routes = new routes(app);
Routes.setup();

app.listen(port);
console.log('The magic happens on port ' + port);

// https.createServer({
//     key: fs.readFileSync(__dirname+'/keys/server.key'),
//     cert: fs.readFileSync(__dirname+'/keys/server.cert')
// }, app)
//     .listen(port, function () {
//         console.log('Example app listening on port 3000! Go to https://localhost:/'+port)
//     })





