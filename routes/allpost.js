const { Router } = require('express');
const router = Router();
const { database } = require('../models/modelExport');
const posts = database.posts;

router.use((req, res, next) => {
    console.log(`${req.method} + ${req.url}`);
    next();
});


router.get('', (req, res) => {
    database.sequelize.query('SELECT * FROM posts', {
        type: database.sequelize.QueryTypes.SELECT
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            })
        })
})

module.exports = router;



