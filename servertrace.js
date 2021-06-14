// https://nodesource.com/blog/microservices-in-nodejs/

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const routes = require('./api/routestrace');
routes(app);
app.listen(port, function() {
  console.log('Server started on port: ' + port);
});
