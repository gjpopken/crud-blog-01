const express = require('express');

const blogRouter = require('./routes/blog.router.js');

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json())
app.use(express.static('server/public'));
app.use('/blog', blogRouter);

app.listen(PORT, () => {
  console.log(`server is up and running at http://localhost:${PORT}`)
});
