import React, { useEffect } from "react";
import { BsDownload, BsEye } from "react-icons/bs";
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
  Input,
  Button
} from "reactstrap";

import routes from "routes.js";

function Header(props) {
  
  // mobile responsive
  const { innerWidth: width } = window;
  const onMobile = width < 762 ? true : false;

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
    let brandName = "404";
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
        // let check = currentRoute.role.some((role)=> role == localStorage.getItem('userRole'))
        if(currentRoute.path == '/dashboard')
          brandName = "Dashboard"
        // else if(!check)
        //   brandName = "404"
        // else
          brandName = currentRoute.name;
      }
    }
    return brandName;
  };
  
  
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

  const getNotification = () => {
    setInterval(async()=>{
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
          // toast.success("New lead assined.")
        }
      }
      else 
        toast.error(res.message)
  }, 2000)  

  }
  const userRole = localStorage.getItem('userRole')
  useEffect(()=>{
    if(localStorage.getItem('userRole') == 2)
          getNotification() 
  }, [])

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
          <NavbarBrand href="/" id="brand-name">{getBrand()}</NavbarBrand>
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
            {userRole == 2 && <NavItem>
              <a href="RFA 499.pdf" download="RFA 499.pdf">
                <Button className="rfa">
                  Referral Agreement
                  <BsDownload />
                </Button>
              </a>
            </NavItem>}
            {(userRole != 3 && userRole != 5) && <NavItem>
              <a href="" className="nav-link btn-magnify">
                <i className="nc-icon nc-layout-11" onClick={()=>props.setAnnouncementPopup(true)}/>
                <p>
                  <span className="d-lg-none d-md-block">Announcement</span>
                </p>
              </a>
            </NavItem>}
           {localStorage.getItem('userRole') == 2 && <Dropdown
              nav
              isOpen={dropdownOpen}
              toggle={(e) => dropdownToggle(e)}
            >
              <DropdownToggle caret nav style={{position:'relative'}}>
                {count > 0 && <p style={{position:'absolute', top:0, left:0, zIndex:1, background:'#51cbce', color:'#252422', padding:'0px 7px', borderRadius:20, fontSize:12}}>{count}</p>}
                <i className="nc-icon nc-bell-55" />
                <p>
                  <span className="d-lg-none d-md-block">Notifications</span>
                </p>
              </DropdownToggle>
              {notfication.length > 0 && <DropdownMenu right style={{height:200, overflow:'scroll'}}>
                {notfication.reverse().map((lead)=>{
                  return <Link to={`/lead-details/${lead._id}`}>
                  <div className="notification" key={lead._id} style={{backgroundColor: `${lead.viewed === false ? '#f2f3ef': '#fff'}`}}>
                    <div>
                        <p>{lead.fname}</p><br/>
                        <p style={{fontSize:10}}>{lead.address}</p>
                    </div>
                    <Link to={`/lead-details/${lead._id}`}><BsEye onClick={()=>setDropdownOpen(false)}/></Link>
                  </div>
                  </Link>
                })}
              </DropdownMenu>}
            </Dropdown>}
            <NavItem>
              <Link to="/my-profile">
                <img  style={{marginTop:10,marginBottom:onMobile? 10 : 0, height:30, width:30, objectFit:'cover', borderRadius:50, border:'1px solid #25242293',}}
                src={localStorage.getItem('profileImage') !== "null"? `${process.env.REACT_APP_IMAGE_URL}/${localStorage.getItem('profileImage')}` : require("assets/img/profile.png")}/>
                <p>
                  <span className="d-lg-none d-md-block" style={{paddingLeft:10}}>PROFILE</span>
                </p>
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
