const { Router } = require('express');
const { posts } = require('./models');
const router = Router();
// console.log(posts);


router.use((req, res, next) => {
    // console.log(req.session);
    console.log(`${req.method} + ${req.url}`);
    next();
});
router.get('', (req, res) => {
    res.status(200).send(posts);
})

module.exports = router;



