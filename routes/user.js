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


router.post('/login', async (req, res) => {
    let obj = req.body;
    obj.password = crypto.createHash('sha256').update(obj.password).digest('hex');

    try {
        const detectedUser = await users.findOne({
            where: { [Op.and]: [obj] } //and operator
        })

        if (detectedUser) {
            req.session.userId = detectedUser.userId;
            res.status(200).send(detectedUser);
        } else {
            res.status(404).send({
                msg: "signin first"
            })
        }
    } catch (err) {
        res.status(500).send({
            err,
            msg: "some internal err"
        })
    }
});



router.post('/signup', async (req, res) => {
    let obj = req.body;
    obj.password = crypto.createHash('sha256').update(obj.password).digest('hex');
    obj.userId = uuidv4();

    try {
        const user = obj;
        const newUser = await users.create(user);
        if (newUser) {
            res.send(newUser);
        } else {
            res.status(500).send({
                msg: "signin first"
            });
        }
    } catch (err) {
        res.status(500).send({
            err,
            msg: "some internal err"
        })
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
})

module.exports = router;
