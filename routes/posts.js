const { Router } = require('express');
const router = Router({ mergeParams: true }); //to get params from parent route
const { redirectLogin } = require('../middlewares/authenticate');
const { database } = require('../models/modelExport');
const { users, posts } = database;
const Op = database.Sequelize.Op;

router.get('', async (req, res) => {
    const { username } = req.params;
    let userObj = {};
    const user = await users.findOne({ where: { username } });
    const userPosts = await posts.findAll({ where: { username } });
    userObj.about = user;
    userObj.posts = userPosts;
    res.status(200).send(userObj);
})


router.get('/posts', (req, res) => {
    const { username } = req.params;
    const userPosts = [];
    if (username) {
        posts.findAll({ where: { username } })
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials."
                });
            });
    } else {
        res.sendStatus(404);
    }
})


router.post('/create', redirectLogin, (req, res) => {
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
    posts.create(obj)
        .then(post => {
            res.status(201).send(post);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
})


router.get('/:title', (req, res) => {
    const { username, title } = req.params;
    if (title && username) {
        posts.findOne({
            where: { [Op.and]: [{ title, username }] } //and operator
        })
            .then(post => {
                res.status(200).send(post);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Tutorial."
                });
            });
    } else {
        res.status(404).send('no such post found');
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



