import React, { useEffect, useRef } from 'react';
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

const agents = [
  {
    "id": 1,
    "street": "735 Main St.",
    "zipcode": "95336",
    "state": "CA",
    "miles": Math.floor(Math.random() * 36) + 10
  },
  {
    "id": 2,
    "street": "25 Purdy Avenue",
    "zipcode": "10580",
    "state": "NY",
    "miles": Math.floor(Math.random() * 36) + 10
  },
  {
    "id": 3,
    "street": "6761 Old Jacksonville Hwy",
    "zipcode": "75703",
    "state": "Texas",
    "miles": Math.floor(Math.random() * 36) + 10
  },
];




const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';
L.mapbox.accessToken =  MAPBOX_ACCESS_TOKEN;


function Mapbox(street, zipcode, state) {
  const map = useRef()
  const circleRef = useRef()

  const getLatLongFromAddress = async(street, state, zipcode) => {
    // const address = '16064 Anaconda Rd. Madera, CA 93636';
    const address = `${street}, ${state} ${zipcode}`

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
 
    const response = await fetch(url, {
      method: 'GET'
    })
    const data = await response.json()

    const [long, lat] = data.features[2].center;
    
    return ([lat, long])
  };

  const fetchRealEstateAgents = async() => {

    for(let i = 0; i < agents.length; i++){
      const [lat, long] = await getLatLongFromAddress(agents[i].street, agents[i].state, agents[i].zipcode);
      // L.marker([lat, long]).addTo(map.current);
      const marker = L.marker([lat, long]).addTo(map.current);
      const agentId = `agent-${i}`;
      // marker.bindPopup(`Agent ${i+1}`);
      marker.on('click', () => handleMarkerClick(agentId, lat, long));
    }
  
  }
  
  const handleMarkerClick = (agentId, lat, long) => {
    if(circleRef.current)
      circleRef.current.remove()

    const circle = L.circle([lat, long], {
      radius: 20 * 1609.34, 
    }).addTo(map.current);

    circleRef.current = circle
  }

  const loadMap = (lat, long) => {
    map.current = L.mapbox.map('map')
      .setView([lat, long], 9)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    L.marker([lat, long],  { icon: leadMArker }).addTo(map.current);

    return () => map.remove();
  }

  useEffect(async() => {
    const [lat, long] = await getLatLongFromAddress('16064 Anaconda Rd. Madera', 'CA', '93636')
    loadMap(lat, long)
    fetchRealEstateAgents()

  }, []);

  return (
    <div id="map" style={{height: 500, width: '100%', borderRadius:10 }}></div>
  )
}

export default Mapbox;

