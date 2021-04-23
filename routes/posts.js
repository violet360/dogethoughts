const { Router } = require('express');
const { posts, users } = require('./models');
const router = Router({ mergeParams: true }); //to get params from parent route
const { redirectLogin } = require('../middlewares/authenticate');

router.get('', (req, res) => {
    const { username } = req.params;
    let userObj = users.find(o => o.username === username);
    let userPosts = [];
    console.log(userObj);
    if (userObj) {
        let finalObj = {};
        finalObj.about = userObj;
        for (let post of posts) {
            console.log(post)
            if (post.username === username) {
                userPosts.push(post);
            }
        }
        finalObj.posts = userPosts;
        res.status(200).send(finalObj);
    } else {
        res.sendStatus(404);
    }
})


router.get('/posts', (req, res) => {
    const { username } = req.params;
    console.log(req.params);
    const userPosts = [];
    if (username) {
        let obj = users.find(o => o.username === username);
        let { userId } = obj;
        for (let post of posts) {
            if (post.userId === userId) {
                userPosts.push(post);
            }
        }
        res.status(200).send(userPosts);
    } else {
        res.sendStatus(404);
    }
})


router.post('/create', redirectLogin, (req, res) => {
    console.log(req.body);
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
    console.log(titleArray, postTitleProcessed);
    posts.push(obj);
    res.status(200).send(obj);
})


router.get('/:title', (req, res) => {
    const { username, title } = req.params;
    if (title && username) {
        console.log(title);
        const obj = posts.find(o => ((o.title === title) && (o.username === username)));
        res.status(200).json(obj);
    } else {
        res.status(404).send('no such post found');
    }
})


router.put('/:title/update', redirectLogin, (req, res) => {
    const { userId } = req.session;
    const { username, title } = req.params;
    console.log(title, userId);
    const userObj = users.find(o => ((o.userId === userId) && (o.username === username)))
    const postIndex = posts.findIndex(o => ((o.username === username) && (o.title === title)));
    if (userObj && postIndex >= 0) {
        console.log(posts[postIndex]);
        let updatedPost = req.body;
        posts[postIndex].title = updatedPost.title;
        posts[postIndex].content = updatedPost.content;
        res.sendStatus(200);
    } else if (userObj == undefined && postIndex >= 0) {
        res.sendStatus(403);
    } else {
        res.sendStatus(404);
    }
})



router.delete('/:title/delete', redirectLogin, (req, res) => {
    const { userId } = req.session;
    const { username, title } = req.params;
    console.log(title, userId);
    const userObj = users.find(o => ((o.userId === userId) && (o.username === username)))
    const postIndex = posts.findIndex(o => ((o.username === username) && (o.title === title)));
    if (userObj && postIndex >= 0) {
        console.log(postIndex);
        posts.splice(postIndex, 1);
        res.sendStatus(200);
    } else if (userObj == undefined && postIndex >= 0) {
        res.sendStatus(403);
    } else {
        res.sendStatus(404);
    }
})

module.exports = router;



