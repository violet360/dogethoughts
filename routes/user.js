const { Router } = require('express');
const router = Router();
const { database } = require('../models/modelExport');
var crypto = require('crypto');
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');


const users = database.users;
const Op = database.Sequelize.Op;


router.post('/login', (req, res) => {
    let obj = req.body;
    obj.password = crypto.createHash('sha256').update(obj.password).digest('hex');
    users.findOne({
        where: { [Op.and]: [obj] } //and operator
    })
        .then(user => {
            req.session.userId = user.userId;
            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
})



router.post('/signup', (req, res) => {
    let obj = req.body;
    obj.password = crypto.createHash('sha256').update(obj.password).digest('hex');
    obj.userId = uuidv4();
    const user = obj;
    users.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
})

module.exports = router;
