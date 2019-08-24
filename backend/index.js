// Dependencies
require('dotenv').config();
const request = require('request')

const express = require('express')
const app = express()
const port = 3000

// Serves the frontend.
app.use(express.static('../frontend'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


const request_data = {
    // region=15 gets the retals from the greater wellington region.
    url: 'https://api.trademe.co.nz/v1/Search/Property/Rental.json?region=15',
    headers: {
        'Authorization': `OAuth oauth_consumer_key="${process.env.consumer_key}", oauth_signature_method="PLAINTEXT", oauth_signature="${process.env.consumer_secret}&"`
    },
    method: 'GET',
}

request(
    request_data,
    function(error, response, body) {
        // Log error if GET fails.
        if (error !== null) {
            console.log(error)
        }
        // JSON.parse(body) returns the JSON object of all rentals.
        console.log(JSON.parse(body))
    }
)
