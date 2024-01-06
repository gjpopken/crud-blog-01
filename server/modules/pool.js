const pg = require('pg');
let pool

if (process.env.DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
} else {
  pool = new pg.Pool({
    database: 'blog-app-01',
    host: 'localhost',
    port: 5432,
  });
}

pool.on('connect', () => {
  console.log('Postgresql connected!');
});

pool.on('error', (error) => {
  console.log('Error with postgres pool!', error)
});


module.exports = pool;
