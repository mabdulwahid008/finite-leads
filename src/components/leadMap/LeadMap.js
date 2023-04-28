import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'mapbox.js';
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';


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
    id: '1',
    street: '735 Main St.',
    zip_code: '95336',
    state: 'CA',
    miles: 40
  },
  {
    id: '2',
    street: '25 Purdy Avenue',
    zip_code: '10580',
    state: 'NY',
    miles: 10
  },
  {
    id: '3',
    street: '6761 Old Jacksonville Hwy',
    zip_code: '75703',
    state: 'Texas',
    miles: 20
  },
  {
    id: '4',
    street: '1820 Commerce St',
    zip_code: '10598',
    state: 'New York',
    miles: 30
  },
  {
    id: '5',
    street: '3 Grace Ave Ste 180, Suite 180',
    zip_code: '11021-2415',
    state: 'NY',
    miles: 20
  },
  {
    id: '6',
    street: '342 Highland Ave',
    zip_code: '94611',
    state: 'CA',
    miles: 35
  },
  {
    id: '7',
    street: '1820 Commerce Street',
    zip_code: '10566',
    state: 'New York',
    miles: 40
  },
  {
    id: '8',
    street: '2510 Sand Creek Rd',
    zip_code: '94513',
    state: 'CA',
    miles: 10
  },
  {
    id: '9',
    street: '2829 Indian Creek Dr, Apt 1007',
    zip_code: '33140',
    state: 'Florida',
    miles: 25
  },
  {
    id: '10',
    street: '12751 Westlinks Dr Ste 2',
    zip_code: '33913',
    state: 'FL',
    areas: 'Lee county, Charlotte county, Hendry county, Collier County',
    miles: 20
  }
];

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';
L.mapbox.accessToken =  MAPBOX_ACCESS_TOKEN;


function Mapbox(street, zipcode, state) {
  const map = useRef()
  const agentCircleRef = useRef()
  const agentAreasCircleRef = useRef()

  const [selectedAgent, setSelectedAgent] = useState(null)


  const assignLead = () => {
      console.log(selectedAgent);
  }

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
      // const agentId = `agent-${i}`;
      // marker.bindPopup(`Agent ${i+1}`);
      marker.on('click', () => handleMarkerClick(agents[i].id, lat, long));
    }
  
  }
  
  
  
  const handleMarkerClick = async(agentId, lat, long) => {
    // removing areas of previous selected agent
    if(agentAreasCircleRef.current){
      agentAreasCircleRef.current.forEach(circle => circle.remove());
    }
    // removing previous selected agent
    if(agentCircleRef.current){
      agentCircleRef.current.remove()
      setSelectedAgent(null)
    }

    // getting agent data
    const agent = agents.filter((agent)=> agent.id === agentId)

    agentCircleRef.current = L.circle([lat, long], {
      radius: agent[0].miles * 1609.34, 
    }).addTo(map.current);
    
    // for assigning lead for assign lead btn
    setSelectedAgent(agent[0].id)
    
    // for agent areas 
    let circles = []
    let areas = agent[0].areas.split(',')
    for (let i = 0; i < areas.length; i++) {
      const [lat, long] = await getLatLongFromAddress(areas[i], '', '')
      let newCircle = L.circle([lat, long], {
        radius: agent[0].miles * 1609.34, 
        color: 'red'
      }).addTo(map.current);
      circles.push(newCircle)
    }
    agentAreasCircleRef.current = circles
    
        // const polygonCoords = []
        // const polygon = L.polygon(polygonCoords, {
        //   color: 'red',
        //   fillColor: 'red',
        //   fillOpacity: 0.5
        // }).addTo(map.current);
    
        // map.current.fitBounds(polygon.getBounds());
  }

  const loadMap = (lat, long) => {
    map.current = L.mapbox.map('map')
      .setView([lat, long], 7)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    L.marker([lat, long],  { icon: leadMArker }).addTo(map.current);

    return () => map.current.remove();
  }

  useEffect(() => {
    let cleanupFunction;
    const loadMapAndReturnCleanupFunction = async () => {
      const [lat, long] = await getLatLongFromAddress('16064 Anaconda Rd. Madera','CA','93636');
      cleanupFunction = loadMap(lat, long); // save the cleanup function
      fetchRealEstateAgents();
    };
    loadMapAndReturnCleanupFunction();
  
    // return a function that calls the cleanup function
    return () => {
      if (typeof cleanupFunction === 'function') {
        cleanupFunction();
      }
    };
  }, []);
  

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Assign Lead</CardTitle>
        <Button onClick={assignLead}>Assign Lead</Button>
      </CardHeader>
      <CardBody>
        <div id="map" style={{height: 500, width: '100%', borderRadius:10 }}></div>
      </CardBody>
    </Card>
  )
}

export default Mapbox;

