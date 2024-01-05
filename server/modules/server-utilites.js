const dayjs = require('dayjs')

/**
 * Format an array of objects with properties 'inserted_at' and
 * 'updated_at' and changes them to MMM-DD-YYYY format.
 * @param {Array} arr
 */

function formatDate (arr) {
    for (i of arr) {
        i.inserted_at = dayjs(i.inserted_at).format('MMM-DD-YYYY')
        i.updated_at = dayjs(i.updated_at).format('MMM-DD-YYYY')
    }
}

/**
 * Takes an array of objects and shortens the title to
 * 7 characters and an elypsis. 
 * @param {Array} arr Array of objects with property 'title'
 */
function shortenTitle (arr) {
    for (i of arr) {
        let nTitle = ''
        if (i.title.length > 10) {
            for (let j = 0; j < 7; j++) {
                nTitle += i.title[j]
            }
            nTitle += '...'
            i.title = nTitle
        }

    }
}

module.exports = {formatDate, shortenTitle}