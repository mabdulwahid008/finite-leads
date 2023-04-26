import React, { useEffect } from 'react';
import L from 'mapbox.js';
import { Card } from 'reactstrap';


const leadMArker = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.mapbox.accessToken = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';


function Mapbox(street, zipcode, state) {


  const getLatLongFromAddress = async (street, zipcode, state) => {
    // const address = `${street}, ${state} ${zipcode}`;

    const address = '1600 Amphitheatre Parkway, Mountain View, CA';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
 

    const response = await fetch(url, {
      method: 'GET'
    })
    const data = await response.json()
    const [long, lat] = data.features[0].center;
    
    
    const map = L.mapbox.map('map')
      .setView([lat, long], 10.4)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

    L.marker([lat, long],  { icon: leadMArker }).addTo(map);

    L.circle([lat, long], {
      radius: 10 * 1609.34, 
    }).addTo(map);

    // L.marker([31.939198, 72.228899]).addTo(map);

    return () => map.remove();
  
  };

  useEffect(() => {

    getLatLongFromAddress('3517 MAIN ST', zipcode, state)
    // const map = L.mapbox.map('map')
    //   .setView([-122.07121, 37.41582], 9)
    //   .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

    // L.marker([-122.07121, 37.41582],  { icon: leadMArker }).addTo(map);

    // L.circle([-122.07121, 37.41582], {
    //   radius: 30 * 1609.34, 
    // }).addTo(map);

    // // L.marker([31.939198, 72.228899]).addTo(map);

    // return () => map.remove();
  }, []);

  return (
    <div id="map" style={{height: 500, width: '100%', borderRadius:20 }}></div>
  )
}

export default Mapbox;

