const expressEdge = require('express-edge');
const express = require('express');
const edge = require("edge.js");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require("connect-flash");

const criaPostControle = require('./control/criaPost')
const homeControle = require('./control/home')
const storePostControle = require('./control/storePost')
const getPostControle = require('./control/getPost')
const criaUserControle = require('./control/criaUser')
const storeUserControle = require('./control/storeUser');
const loginControle = require("./control/login");
const loginUserControle = require('./control/loginUser');
const logoutControle = require("./control/logout");
const jsoncontrole = require("./control/jsonpost");
const jsonPostscontrole = require("./control/jsonposts");
const renderajax = require("./control/ajax");
 
const app = new express();
app.use(express.static(__dirname + '/public/'));
app.use(connectFlash());
app.use(expressSession({
    secret: 'secret'
}));
 
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

const mongoStore = connectMongo(expressSession);

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));
 
app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set('views', __dirname + '/views');

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
const storePost = require('./middleware/storePost');
const auth = require("./middleware/auth");
const redirecionaLogado = require('./middleware/redirecionaLogado')
 
app.get("/", homeControle);
app.get("/post/:id", getPostControle);
app.get("/posts/new",auth, criaPostControle);
app.post("/posts/store", storePostControle);
app.get('/auth/login', loginControle);
app.post('/users/login', loginUserControle);
app.get("/auth/register", criaUserControle);
app.post("/users/register", storeUserControle);
app.get("/auth/logout", redirecionaLogado, logoutControle);
app.get("/post/json/:id",jsoncontrole);
app.get("/posts/json",jsonPostscontrole);
app.get("/postajaxnew/:id",renderajax);
 
app.listen(3000, () => {
  console.log("Conectando na porta 3000");
});