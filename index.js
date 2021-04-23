const express = require('express');
const session = require('./middlewares/session')
const postRoute = require('./routes/posts')
const allPostRoute = require('./routes/allpost');
const userRoute = require('./routes/user');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session);
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});

app.use('/posts', allPostRoute);
app.use('/:username', postRoute);

app.use('/user', userRoute);


app.listen(3000, () => console.log('server is running on port 3000'));

