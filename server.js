const express = require('express');
const app = express();
const port = 3000;

// serve static files from the root of the project
app.use(express.static(__dirname));

// start the express web server
app.listen(port, () => { console.log(`server started at http://localhost:${port}`) });