// Dependencies
require('dotenv').config();
const request = require('request-promise-native')

const express = require('express')
const app = express()
const port = 3000

// Serves the frontend.
app.use(express.static('../frontend'));
app.use(express.json())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


const request_data = {
    // region=15 gets the retals from the greater wellington region.
    url: 'https://api.trademe.co.nz/v1/Search/Property/Rental.json?region=15',
    headers: {
        'Authorization': `OAuth oauth_consumer_key="${process.env.consumer_key}", oauth_signature_method="PLAINTEXT", oauth_signature="${process.env.consumer_secret}&"`
    },
    method: 'GET',
}

app.get('/listings', async function(req, res) {
    try {
        let body = await request(request_data)
        body = JSON.parse(body)
        // Trim the data.
        const slimData = body.List.map((listing) => {
            // Takes the geo location and calculates the rent per room for listing.
            return {
                geoLoc: listing.GeographicLocation,
                rentPerRoom: Math.ceil(listing.RentPerWeek / listing.Bedrooms)
            }
        })
        // return Trade Me response body to web client
        res.json(slimData);
    } catch(err) {
        // If an error happens log it
        console.error(err);
    }
})

