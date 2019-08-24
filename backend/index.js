// Dependencies
require('dotenv').config();
const request = require('request-promise-native')

const express = require('express')
const app = express()
const port = 3000

const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};

// Serves the frontend.
app.use(allowCrossOriginRequests)
app.use(express.static('../frontend'));
app.use(express.json())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// The body from the GET request.
let body;

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
        body = await request(request_data)
        body = JSON.parse(body)
        // Trim the data.
        const slimData = body.List.map((listing) => {
            // Takes the geo location and calculates the rent per room for listing.
            return {
                geoLoc: listing.GeographicLocation,
                rentPerRoom: Math.ceil(listing.RentPerWeek / listing.Bedrooms),
                id: listing.ListingId,
            }
        })
        // return Trade Me response body to web client
        res.json(slimData);
    } catch(err) {
        // If an error happens log it
        console.error(err);
    }
})

