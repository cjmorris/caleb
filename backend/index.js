// Dependencies
require('dotenv').config();
const request = require('request')
const OAuth = require('oauth-1.0a')
const crypto = require('crypto')

const express = require('express')
const app = express()
const port = 3000


app.use(express.static('../frontend'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Initialize
const oauth = OAuth({
    consumer: {
        key: process.env.consumer_key,
        secret: process.env.consumer_secret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})

const request_data = {
    url: 'https://api.twitter.com/1/statuses/update.json?include_entities=true',
    method: 'POST',
    data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
}

request(
    {
        url: request_data.url,
        method: request_data.method,
        form: oauth.authorize(request_data),
    },
    function(error, response, body) {
        // Process your data here
    }
)
