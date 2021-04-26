const { Router } = require('express');
const router = Router();
const { database } = require('../models/modelExport');
const posts = database.posts;

router.use((req, res, next) => {
    console.log(`${req.method} + ${req.url}`);
    next();
});


router.get('', async (req, res) => {
    try {
        const allPosts = await database.sequelize.query('SELECT * FROM posts', {
            type: database.sequelize.QueryTypes.SELECT
        })
        res.send(allPosts);
    } catch (err) {
        res.status(500).send({
            err,
            msg: "some internal err"
        })
    }
})

module.exports = router;



