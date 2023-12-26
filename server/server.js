const express = require('express');

const thingsRouter = require('./routes/things.router.js');

const PORT = 5001;

const app = express();

app.use(express.json())
app.use(express.static('server/public'));
app.use('/things', thingsRouter);

app.listen(PORT, () => {
  console.log(`server is up and running at http://localhost:${PORT}`)
});
