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
    url: 'https://api.trademe.co.nz/v1/Search/Property/Rental.json?region=15?photo_size=FullSize',
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
            // Takes the geo location, number of bedrooms, number of bathrooms, image and calculates the rent per room for listing.
            return {
                geoLoc: listing.GeographicLocation,
                houseImage: listing.PictureHref,
                rentPerRoom: Math.ceil(listing.RentPerWeek / listing.Bedrooms),
                bedrooms: listing.Bedrooms,
                bathrooms: listing.Bathrooms,
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

app.get('/listings/:id', async (req, res) => {
    try {
        // Check body exists.
        if (body === undefined){
            res.status(404).end();
        } else {
            // Find the listing with the id provided in the params.
            let listing = body.List.find( l => {
                return l.ListingId === parseInt(req.params.id);
            });
            return res.json(listing)
        }
    } catch(err) {
        // Log errors.
        console.error(err);
    }
})

