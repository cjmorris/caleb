

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const crypto = require('crypto')
const OAuth = require('oauth-1.0a')


// Dependencies
const request = require('request')
const OAuth = require('oauth-1.0a')
const crypto = require('crypto')

// Initialize
const oauth = OAuth({
    consumer: {
        key: 'xvz1evFS4wEEPTGEFPHBog',
        secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
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
        form: oauth.authorize(request_data, token),
    },
    function(error, response, body) {
        // Process your data here
    }
) () => console.log(`Example app listening on port ${port}!`))