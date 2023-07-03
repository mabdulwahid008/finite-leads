import React, { useEffect } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import io from 'socket.io-client'
import Page404 from "views/Page404";
import ViewAnnouncement from "components/viewAnnouncement/ViewAnnouncement";
import ReChatBox from "components/reChat/ReChatBox";

var ps;

function Dashboard(props) {

  // const socket = io(process.env.REACT_APP_BACKEND_HOST)
  // socket.on('connection',()=>{})
  // socket.emit('setup', localStorage.getItem('user'))


  const [announcement, setAnnouncement] = React.useState(null);
  const [announcementPopup, setAnnouncementPopup] = React.useState(true);

  const [backgroundColor, setBackgroundColor] = React.useState("black");
  const [activeColor, setActiveColor] = React.useState("info");
  const mainPanel = React.useRef();
  const location = useLocation();
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  const fetchAnnouncements = async() => {
    const response = await fetch(`/announcement`, {
      method: 'GET',
      headers: {
          'Content-Type': 'Application/json',
          token: localStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200)
       setAnnouncement(res);
    else
        console.log(res.message)
  }

  useEffect(()=>{
    if(localStorage.getItem('userRole') != 3 && localStorage.getItem('userRole') != 5)
      fetchAnnouncements()
  }, [])

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={routes}
        bgColor={backgroundColor}
        activeColor={activeColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar {...props} setAnnouncementPopup={setAnnouncementPopup}/>
        <Switch>
          {routes.map((prop, key) => {
            if(prop.role.some((role)=> role == localStorage.getItem('userRole')))
            return (
              <Route
                path={prop.path}
                component={prop.component}
                key={key}
              />
            );
          })}
          <Route path='/*' component={()=> <Page404 />} />
        </Switch>
          <ReChatBox />
        <Footer fluid />
        {announcement?.length > 0 && announcementPopup && <ViewAnnouncement announcement={announcement} setAnnouncementPopup={setAnnouncementPopup}/>}
      </div>
    </div> 
  );
}

export default Dashboard;
