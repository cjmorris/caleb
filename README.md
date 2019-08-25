# Team Caleb

## APP

### How to run backend:

`cd backend/` into the backend directory.

`npm install`  first time downloading to insall npm.

`node index.js` to run the server on port 3000.

Trade Me API Credentials should be stored in a `.env` file in the `backend/` directory

### Backend API endpoints:

Requires TradeMe API consumer key and secret.

GET /listings   
This gets all the rental listings from the TradeMe API for the greater wellington region.

response
```json
[{ "geoLoc": {
              "Latitude": -41.2783893,
              "Longitude": 174.7693776,
              "Northing": 5428829,
              "Easting": 1748183,
              "Accuracy": 1
              },      
   "rentPerRoom": 120,
   "bathrooms":2,
   "bedrooms":3,
   "houseImage":"https://trademe.tmcdn.co.nz/photoserver/thumb/1127436451.jpg",
   "id": 2286698047
}] 
```


GET /listings/\<id>  
This gets the full details of the specified listing.

response
```json
{
    "ListingId": 2286698047,
    "Title": "Thorndon, 3 bedrooms, $360 pw",
    "Category": "0350-5748-4233-",
    "StartPrice": 0,
    "StartDate": "/Date(1566617111417)/",
    "EndDate": "/Date(1567826711417)/",
    "ListingLength": null,
    "IsFeatured": true,
    "HasGallery": true,
    "IsBold": true,
    "IsHighlighted": true,
    "AsAt": "/Date(1566619274130)/",
    "CategoryPath": "/Trade-Me-Property/Residential/To-Rent",
    "PictureHref": "https://trademe.tmcdn.co.nz/photoserver/thumb/1126769123.jpg",
    "RegionId": 15,
    "Region": "Wellington",
    "SuburbId": 1559,
    "Suburb": "Thorndon",
    "NoteDate": "/Date(0)/",
    "ReserveState": 3,
    "IsClassified": true,
    "OpenHomes": [],
    "GeographicLocation": {
        "Latitude": -41.2783893,
        "Longitude": 174.7693776,
        "Northing": 5428829,
        "Easting": 1748183,
        "Accuracy": 1
    },
    "PriceDisplay": "$360 per week",
    "PhotoUrls": [
        "https://trademe.tmcdn.co.nz/photoserver/thumb/1126769065.jpg",
        "https://trademe.tmcdn.co.nz/photoserver/thumb/1126769089.jpg",
        "https://trademe.tmcdn.co.nz/photoserver/thumb/1126784818.jpg"
    ],
    "AdditionalData": {
        "BulletPoints": [],
        "Tags": []
    },
    "MemberId": 6056732,
    "Address": "330A Tinakori Road",
    "District": "Wellington",
    "Amenities": "Close to Parliament, Botanical Gardens, bus terminal, railway station, and local amenities",
    "AvailableFrom": "24/8/2019",
    "Bathrooms": 1,
    "Bedrooms": 3,
    "BestContactTime": "Any time",
    "IdealTenant": "Professional woman.",
    "ListingGroup": "FLAT",
    "MaxTenants": 1,
    "Parking": "Thorndon coupon parking permit can be purchased from local Council",
    "PetsOkay": 1,
    "PropertyType": "House",
    "RentPerWeek": 360,
    "SmokersOkay": 1,
    "Whiteware": "1 db bed, 1 study desk, 1 double wardrobe, fridge, oven, microwave, washing machine and dishwasher",
    "PropertyId": "GKF227",
    "AdjacentSuburbNames": [
        "Thorndon",
        "Northland"
    ],
    "AdjacentSuburbIds": [
        1559,
        1017
    ],
    "DistrictId": 47,
    "Agency": null
}
```

GET /localhost:3000/gwrAverages
returns the average rental prices per room per suburb.

```json
[   {
        "Name": "Brooklyn",
        "avgRent": 274
    },
    {
        "Name": "Churton Park",
        "avgRent": 218
    },
    {
        "Name": "Hataitai",
        "avgRent": 230
    },
    {
        "Name": "Houghton Bay",
        "avgRent": 339
    },
    {
        "Name": "Island Bay",
        "avgRent": 312
    }]
```

### Frontend 

Leaflet was used to make the map and the markers with the interactions of the popup and the tiptool.

The data points `myDataPoint` stores the marker information of the popups and tooltips.

An array `rentals` is populated using the backend listing data stored in the `http://localhost:3000/listings`. The data stored in rentals is displayed on the marker popup and tooltip:
*  popup uses the following data: `houseImage`, `rentPerRoom`, `bedrooms`, `bathrooms`.
*  tooltip uses the following data: `rentPerRoom`. The tooltip is set to `{permanent: true}` so it can always be displayed to the user for easier comparison.

The map updates according to the zoom of the map. If the map is zoomed zoomed in (15), we will have all the marker of each rental house displayed. Otherwise, if the map is zoomed out (14), we will have the marker of the average price per room in a suburb.

The function clearSidebar clears the sidebar from any data htat was being displayed.

The function `calculateAverage` calculates the mid point of the coordinates of each suburb. The function appends all the mid points to an array.
