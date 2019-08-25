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
    url: 'https://api.trademe.co.nz/v1/Search/Property/Rental.json?region=47?photo_size=FullSize',
    headers: {
        'Authorization': `OAuth oauth_consumer_key="${process.env.consumer_key}", oauth_signature_method="PLAINTEXT", oauth_signature="${process.env.consumer_secret}&"`
    },
    method: 'GET',
}

const request_region_data = {
    // Get the regions with rentals listed.
    url: 'https://api.trademe.co.nz/v1/Localities.json?listing_type=HOUSES_TO_RENT',
    headers: {
    'Authorization': `OAuth oauth_consumer_key="${process.env.consumer_key}", oauth_signature_method="PLAINTEXT", oauth_signature="${process.env.consumer_secret}&"`
    },
    method: 'GET',
}


app.get('/listings', async function(req, res) {
    try {
        // Check body exists.
        body = await request(request_listings_data)
        body = JSON.parse(body)
        if (body === undefined){
            res.status(404).end();
        } else {
            // Trim the data.
            const slimData = body.List.map((listing) => {
                // Takes the geo location and calculates the rent per room for listing.
                return {
                    geoLoc: listing.GeographicLocation,
                    rentPerRoom: Math.ceil(listing.RentPerWeek / listing.Bedrooms),
                    bathrooms: listing.Bathrooms,
                    bedrooms: listing.Bedrooms,
                    houseImage: listing.PictureHref,
                    id: listing.ListingId,
                }
            })
            // return Trade Me response body to web client
            res.json(slimData);
        }
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

app.get('/gwrAverages', async (req, res) => {
    try {
        // Get the rental data from TradeMe.
        body = await request(request_listings_data)
        body = JSON.parse(body)
        // Get the regions data from TradeMe.
        let region = await request(request_region_data)
        region = JSON.parse(region)
        // Get the greater wellington region.
        const gwr = region.filter( r => r.LocalityId === 15)
        // Get the lesser wellington region.
        const lwr = gwr[0].Districts.filter( r => r.DistrictId === 47)
        let subArray = [];
        // Map regions to avg rental price per room.
        lwr[0].Suburbs.forEach( s => body.List.forEach( s2 => {
            if (s.Name === s2.Suburb) {
                subArray.push({Name: s.Name, RPR: Math.ceil(s2.RentPerWeek / s2.Bedrooms)})
            }
            })
        )
        let avgSubRent = []
        // Get the averages per suburb.
        lwr[0].Suburbs.forEach( sub => {
            temp = subArray.filter( s => s.Name === sub.Name);
            if (temp.length > 0) {
                let avgrent = -1
                temp.forEach( t => {
                    avgrent += t.RPR;
                })
                avgSubRent.push({Name: sub.Name, avgRent: Math.ceil(avgrent/temp.length)})
            }
        })
        return res.json(avgSubRent)
    } catch(err) {
        // Log errors.
        console.error(err);
    }
})

/**
 * Get the number of name occurances in array.
 * @param arry the array.
 * @param name the name to seach for.
 * @return {number} number of occurances.
 */
function occurances( arry, name) {
    let count = 0;
    arry.forEach( s => (v === name && count++));
    return count;
}