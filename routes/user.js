const { Router } = require('express');
const router = Router();
const { users } = require('../models/models');
var crypto = require('crypto');
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');


router.post('/login', (req, res) => {
    console.log(req.body);
    let obj = req.body;
    const user = users.find(o => o.username === obj.username && o.password === crypto.createHash('sha256').update(obj.password).digest('hex'));
    req.session.userId = user.userId;
    if (user) {
        console.log(user);
        req.session.userId = user.userId;
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
})



router.post('/signup', (req, res) => {
    console.log(req.body);
    let obj = req.body;
    obj.password = crypto.createHash('sha256').update(obj.password).digest('hex');
    obj.userId = uuidv4();
    console.log(obj);
    res.status(200).send("login to your account");
    users.push(obj);
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
})

module.exports = router;
