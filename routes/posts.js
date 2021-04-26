const { Router } = require('express');
const router = Router({ mergeParams: true }); //to get params from parent route
const { redirectLogin } = require('../middlewares/authenticate');
const { database } = require('../models/modelExport');
const { users, posts } = database;
const Op = database.Sequelize.Op;

router.get('', async (req, res) => {
    const { username } = req.params;
    let userObj = {};
    try {
        const user = await users.findOne({ where: { username } });
        const userPosts = await posts.findAll({ where: { username } });
        userObj.about = user;
        userObj.posts = userPosts;
        res.status(200).send(userObj);
    } catch (err) {
        res.status(500).send({
            err,
            msg: "some internal err"
        })
    }

})


router.get('/posts', async (req, res) => {
    const { username } = req.params;
    const userPosts = [];
    try {
        const postList = await posts.findAll({ where: { username } });
        res.status(200).send(postList);
    } catch (err) {
        res.status(500).send({
            err,
            msg: "some internal err"
        })
    }
})


router.post('/create', redirectLogin, async (req, res) => {
    const { username } = req.params;
    const postTitleArray = req.body.title.split(' ');
    let len = postTitleArray.length;
    let titleArray = [];
    for (let i = 0; i < len; ++i) {
        if (postTitleArray[i].length > 0) {
            titleArray.push(postTitleArray[i]);
        }
    }

    let postTitleProcessed = '';
    let len1 = titleArray.length;
    for (let i = 0; i < len1; ++i) {
        postTitleProcessed += titleArray[i];
        if (i < len1 - 1) {
            postTitleProcessed += '-';
        }
    }

    let obj = req.body;
    obj.title = postTitleProcessed;
    obj.userId = req.session.userId;
    obj.username = username;
    // posts.push(obj);
    try {

        const newPost = await posts.create(obj)
        if (newPost) {
            res.send(newPost);
        } else {
            res.status(500).send({
                msg: "some internal err"
            })
        }
    } catch (err) {
        res.status(500).send({
            err,
            msg: "some internal err"
        })
    }
})


router.get('/:title', async (req, res) => {
    const { username, title } = req.params;
    if (title && username) {
        try {
            const foundPost = await posts.findOne({
                where: { [Op.and]: [{ title, username }] } //and operator
            })

            if (foundPost) {
                res.send(foundPost);
            } else {
                res.status(404).send("not found")
            }

        } catch (err) {
            res.status(500).send({
                err,
                msg: "some internal error"
            });
        }
    } else {
        res.sendStatus(500);
    }
})


router.put('/:title/update', redirectLogin, async (req, res) => {
    const { userId } = req.session;
    const { username, title } = req.params;
    const userObj = await users.findOne({ where: { [Op.and]: [{ userId, username }] } });
    const postObj = await posts.findOne({ where: { [Op.and]: [{ title, username }] } });
    if (userObj && postObj) {
        const postTitleArray = req.body.title.split(' ');
        let len = postTitleArray.length;
        let titleArray = [];
        for (let i = 0; i < len; ++i) {
            if (postTitleArray[i].length > 0) {
                titleArray.push(postTitleArray[i]);
            }
        }

        let postTitleProcessed = '';
        let len1 = titleArray.length;
        for (let i = 0; i < len1; ++i) {
            postTitleProcessed += titleArray[i];
            if (i < len1 - 1) {
                postTitleProcessed += '-';
            }
        }
        postObj.title = postTitleProcessed;
        postObj.content = req.body.content;
        postObj.save();
        res.status(200).send(postObj);
    } else if (userObj === null && postObj) {
        res.sendStatus(403);
    } else {
        res.sendStatus(404);
    }
});



router.delete('/:title/delete', redirectLogin, async (req, res) => {
    const { userId } = req.session;
    const { username, title } = req.params;
    const userObj = await users.findOne({ where: { [Op.and]: [{ userId, username }] } });
    const postObj = await posts.findOne({ where: { [Op.and]: [{ title, username }] } });
    if (userObj && postObj) {
        const post = await posts.destroy({ where: { [Op.and]: [{ title, username }] } });
        res.sendStatus(200);
    } else if (userObj === null && postObj) {
        res.sendStatus(403);
    } else {
        res.sendStatus(404);
    }
})

module.exports = router;



