# dogethoughts

### API routes:

##### CRUD operations

| API endpoint             | method |                                     description | auth required |       input fields |
|--------------------------|:------:|------------------------------------------------:|--------------:|-------------------:|
| /posts                   |  GET   |               fetched all posts in the database |         false |                N/A |
| /:username               |  GET   | fetches the profile description of the username |         false |                N/A |
| /:username/posts         |  GET   |           fetches all the posts by the username |         false |                N/A |
| /:username/create        |  POST  |                                  creates a post |          true | { title, content } |
| /:username/:title        |  GET   |     fetches the post with that particular title |         false |                N/A |
| /:username/:title/update |  PUT   |            updates the post with the title name |          true | { title, content } |
| /:username/:title/delete | DELETE |              deletes a post with the title name |          true |                N/A |


##### AUTH operations (session based authentication)

| API endpoint | method |                              description | auth required |                                       input fields |
|--------------|:------:|-----------------------------------------:|--------------:|---------------------------------------------------:|
| /user/signup |  POST  |             adds profile to the database |         false | { firstName, lastName, username, password, email } |
| /user/login  |  POST  | logs the user in and creates the session |         false |                             { username, password } |
| /user/logout |  POST  |                        logs the user out |          true |                                                N/A |
