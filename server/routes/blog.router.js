const express = require('express');
const pool = require('../modules/pool.js');

const router = express.Router();


// GET /blog - - - - - - - Respond with all the blogs.
router.get('/', (req, res) => {
    const queryText = `
    SELECT * FROM "blogs";`
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(err);
        })
})

// GET /blog/:id - - - - - Respond with one thing.
router.get('/featured', (req, res) => {
    const queryText = `
    SELECT * FROM "blogs" ORDER BY "id" DESC LIMIT 1;`
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(err);
        })
})

// POST /blog - - - - - -  Create one thing.

// DELETE /blog/:id - - -  Delete one thing.

// PUT /blog/:id - - - - - Update one thing.


module.exports = router;
