const { Router } = require('express');
const { posts } = require('../models/models');
const router = Router();


router.use((req, res, next) => {
    console.log(`${req.method} + ${req.url}`);
    next();
});
router.get('', (req, res) => {
    res.status(200).send(posts);
})

module.exports = router;



