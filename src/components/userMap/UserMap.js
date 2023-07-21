import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { Card, CardBody } from 'reactstrap'
import L from 'mapbox.js';


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';
L.mapbox.accessToken =  MAPBOX_ACCESS_TOKEN;

function UserMap({ street, city, state, country, zipcode }) {
    
    const map = useRef()

    const getLatLongFromAddress = async(street, city, state, country, zipcode) => {
    
        const address = `${street}, ${city}, ${state}, ${country}, ${zipcode}`
    
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
     
        const response = await fetch(url, {
          method: 'GET'
        })
        const data = await response.json()
    
        const [long, lat] = data.features[2].center;
        
        return ([lat, long])
    }

    const loadMap = (lat, long) => {
        map.current = L.mapbox.map('map')
          .setView([lat, long], 12)
            .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
        L.marker([lat, long]).addTo(map.current);

        return () => map.current.remove();
    }

    useEffect(()=>{
        let cleanupFunction;
        const loadMapAndReturnCleanupFunction = async () => {
          const [lat, long] = await getLatLongFromAddress(street, city, state, country, zipcode);
          cleanupFunction = loadMap(lat, long); // save the cleanup function
        };
        loadMapAndReturnCleanupFunction();
      
        // return a function that calls the cleanup function
        return () => {
          if (typeof cleanupFunction === 'function') {
            cleanupFunction();
          }
        };
    }, [])

  return (
    <Card>
        <CardBody style={{padding: 5}}>
        <div id="map" style={{height: 300, width: '100%', borderRadius:10 }}></div>
        </CardBody>
    </Card>
  )
}

export default UserMap
