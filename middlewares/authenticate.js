const redirectLogin = (req, res, next) => {
    const { userId } = req.session;
    if (userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    redirectLogin
}