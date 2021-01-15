const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(require('cors')({ origin: 'http://localhost:3000', credentials: true }))
const auth = (req, res, next)=>{
    if(credentials.token!==req.cookies.auth_token) return res.sendStatus(401)
    next();
}

const port = 3001
const credentials = { login: 'api-test', pass: '1234', token: '32103012$30123910321faf1j901j$f19fj10ef' };
const resources = {};



app.post('/auth', (req, res)=>{
    if(credentials.login === req.body.login && credentials.pass === req.body.pass)
    {
        res.cookie('auth_token', credentials.token, { httpOnly: true });
        return res.sendStatus(204);
    }
    return res.sendStatus(401);
})
app.get('/keys', auth, (req, res)=>{
    const keys = Object.keys(resources); 
    return res.json(req.query.filter?keys.filter(key=>key.match(new RegExp(req.query.filter, req.query.flags))):keys);
})


app.route('*')
    .all(auth)
    .all((req, res, next)=>{
        req.resource=resources[req.originalUrl];
        req.issetResource = Object.keys(resources).includes(req.originalUrl);
        return next();
    })
    .get((req, res)=>{
        return req.issetResource?res.json(req.resource):res.sendStatus(404);
    })
    .post((req, res)=>{
        if(req.issetResource) return res.sendStatus(403);
        resources[req.originalUrl] = req.body;
        return res.sendStatus(204);
    })
    .all((req, res, next)=>{
        if(!req.issetResource) return res.sendStatus(404);
        next();
    })
    .delete((req, res)=>{
        delete resources[req.originalUrl];
        return res.sendStatus(204);
    })
    .patch((req, res)=>{
        const newResource = {...req.resource, ...req.body};
        resources[req.originalUrl] = newResource;
        return res.send(newResource);
    })
    .put((req, res)=>{
        resources[req.originalUrl] = req.body;
        return res.sendStatus(204);
    })

app.listen(port);