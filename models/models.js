const posts = (sequelize, Sequelize) => {
    const post = sequelize.define("posts", {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return post;
};


const users = (sequelize, Sequelize) => {
    const user = sequelize.define("users", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        }
    }, {
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
    });

    return user;
};

module.exports = {
    posts,
    users
}