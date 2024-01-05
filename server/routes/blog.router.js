const express = require('express');
const pool = require('../modules/pool.js');
const utilities = require('../modules/server-utilites.js')

const router = express.Router();


// GET /blog - - - - - - - Respond with all the blogs.
router.get('/', (req, res) => {
    const queryText = `
    SELECT * FROM "blogs" ORDER BY "id" DESC;`
    pool.query(queryText)
        .then((result) => {
            utilities.formatDate(result.rows)
            utilities.shortenTitle(result.rows)
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(err);
        })
})

// GET /blog/:id - - - - - Respond with one thing.
router.get('/now/:id', (req, res) => {
    const queryText = `
    SELECT * FROM "blogs" WHERE "id" = $1;
    `
    pool.query(queryText, [req.params.id])
        .then((result) => {
            utilities.formatDate(result.rows)
            res.send(result.rows)
        }).catch((err) => {
            console.log(err);
        })
})

router.get('/featured', (req, res) => {
    const queryText = `
    SELECT * FROM "blogs" ORDER BY "id" DESC LIMIT 1;`
    pool.query(queryText)
        .then((result) => {
            utilities.formatDate(result.rows)
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(err);
        })
})

// POST /blog - - - - - -  Create one thing.
router.post('/', (req, res) => {
    const incomingPost = req.body
    const queryText = `
    INSERT INTO "blogs" ("title", "body", "delta")
    VALUES ($1, $2, $3);
    `
    const queryParams = [incomingPost.title, incomingPost.body, incomingPost.delta]
    pool.query(queryText, queryParams)
        .then((result) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            console.log(err);
        })
})

// DELETE /blog/:id - - -  Delete one thing.
router.delete('/:id', (req, res) => {
    const queryText = `
    DELETE FROM "blogs" WHERE "id" = $1
    `
    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.sendStatus(201)
        }).catch((err) => {
            console.log(err);
        })
})

// PUT /blog/:id - - - - - Update one thing.
router.put('/:id', (req, res) => {
    const incomingEdit = req.body
    const queryText = `
    UPDATE "blogs" SET "title" = $1, "body" = $2, "updated_at" = now(), "delta" = $4 WHERE "id" = $3;
    `
    const queryParams = [incomingEdit.title, incomingEdit.body, req.params.id, incomingEdit.delta]
    pool.query(queryText, queryParams)
        .then((result) => {
            res.sendStatus(201)
        }).catch((err) => {
            console.log(err);
        })
})

module.exports = router;
