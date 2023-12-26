const express = require('express');
const pool = require('../modules/pool.js');
const dayjs = require('dayjs')

const router = express.Router();


// GET /blog - - - - - - - Respond with all the blogs.
router.get('/', (req, res) => {
    const queryText = `
    SELECT * FROM "blogs" ORDER BY "id" DESC;`
    pool.query(queryText)
        .then((result) => {
            formatDate(result.rows)
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
router.post('/', (req, res) => {
    console.log(req.body);
    const queryText = `
    INSERT INTO "blogs" ("title", "body")
    VALUES ($1, $2);
    `
    const queryParams = [req.body.title, req.body.body]
    pool.query(queryText, queryParams)
        .then((result) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            console.log(err);
        })
})

// DELETE /blog/:id - - -  Delete one thing.

// PUT /blog/:id - - - - - Update one thing.


function formatDate (arr) {
    for (i of arr) {
        i.inserted_at = dayjs(i.inserted_at).format('MMM-DD-YYYY')
    }
}


module.exports = router;
