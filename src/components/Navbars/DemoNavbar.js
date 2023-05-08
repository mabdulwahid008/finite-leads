/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { BsEye } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input
} from "reactstrap";

import routes from "routes.js";

function Header(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const getBrand = () => {
    let brandName = "Default Brand";
    const currentRoute = routes.find((route) => {
      const routePath = route.path.split("/:")[0];
      return window.location.href.indexOf(routePath) !== -1;
    });
    if (currentRoute) {
      const hasRouteParams = currentRoute.path.includes("/:"); // Check if current route has any params
      if (hasRouteParams) {
        const paramValue = window.location.pathname.split("/").pop(); // Get the parameter value from URL
        if (paramValue !== "") { // Check if the parameter value is present in the URL
          brandName = currentRoute.name;
        }
      } else {
        brandName = currentRoute.name;
      }
    }
    return brandName;
  };
  
  // const getBrand = () => {
  //   let brandName = "Default Brand";
  //   routes.map((prop, key) => {
  //     if (window.location.href.indexOf(prop.path) !== -1) {
  //       brandName = prop.name;
  //     }
  //     return null;
  //   });
  //   return brandName;
  // };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };

  const [count, setCount] = React.useState(0)
  const [notfication, setNotification] = React.useState([])

  const getNotification = async() => {
    const response = await fetch('/lead/notfication',{
      method:'GET',
      headers:{
        'Content-Type':'Application/json',
        token: localStorage.getItem('token')
      },
    })
    const res = await response.json()
    if(response.status === 200){
      setCount(res.notViewd)
      if(res.leads.length > notfication.length){
        setNotification(res.leads)
      }
    }
    else 
      toast.error(res.message)
  }

  React.useEffect(()=>{
    getNotification()
    console.log(count);
    console.log(notfication);
  })

  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar style={{zIndex:1}}
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "dark"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          {/* <form>
            <InputGroup className="no-border">
              <Input placeholder="Search..." />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i className="nc-icon nc-zoom-split" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </form> */}
          <Nav navbar>
            {/* <NavItem>
              <Link to="#pablo" className="nav-link btn-magnify">
                <i className="nc-icon nc-layout-11" />
                <p>
                  <span className="d-lg-none d-md-block">Stats</span>
                </p>
              </Link>
            </NavItem> */}
            <Dropdown
              nav
              isOpen={dropdownOpen}
              toggle={(e) => dropdownToggle(e)}
            >
              <DropdownToggle caret nav>
                <i className="nc-icon nc-bell-55" />
                <p>
                  <span className="d-lg-none d-md-block">Notifications</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                {notfication.map((lead)=>{
                  return <div className="notification" key={lead._id} style={{backgroundColor: `${lead.viewed === false ? '#f2f3ef': '#fff'}`}}>
                    <div>
                        <p>{lead.fname}</p><br/>
                        <p style={{fontSize:10}}>{lead.address}</p>
                    </div>
                    <Link to={`lead-details/${lead._id}`}><BsEye/></Link>
                  </div>
                })}
              </DropdownMenu>
            </Dropdown>
            <NavItem>
              <Link to="/my-profile">
                <img  style={{marginTop:10,height:30, width:30, objectFit:'cover', borderRadius:50, border:'1px solid #25242293',}}
                src={localStorage.getItem('profileImage') !== "null"? `http://localhost:5000/${localStorage.getItem('profileImage')}` : require("assets/img/profile.png")}/>
              </Link>
            </NavItem>
            {/* <NavItem>
              <Link to="#" className="nav-link btn-rotate">
                <i className="nc-icon nc-button-power" onClick={()=>{localStorage.removeItem('token'); localStorage.removeItem('userLoggedIn'); window.location.reload(true)}}/>
                <p>
                  <span className="d-lg-none d-md-block">LogOut</span>
                </p>
              </Link>
            </NavItem> */}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
