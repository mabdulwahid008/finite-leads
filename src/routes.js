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
// import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Users from "views/Users";
import Sales from "views/Sales";
import AddSale from "views/AddSale";
import AgentSalesListing from "views/AgentSalesListing";
import ChatBox from 'views/ChatBox'
import LeadListing from "views/LeadListing";
import LeadDetail from "views/LeadDetail";
import EditUser from "views/EditUser";
import Dashboard from "views/Dashboard";
import LeadsAssignedToREA from "views/LeadsAssignedToREA";
import REAgentDashboard from "views/REAgentDashboard";
import UserProfile from "views/UserProfile";
import SalesAgentDashboard from "views/SalesAgentDashboard";
import AdminDashboard from "views/AdminDashboard";
import REAgentStatsListing from "views/REAgentStatsListing";
import Announcement from "views/Announcement";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: AdminDashboard,
    layout: "/admin",
    role: [3,5]
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: SalesAgentDashboard,
    layout: "/admin",
    role: [0]
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: REAgentDashboard,
    layout: "/admin",
    role: [2]
  },
  {
    path: "/users",
    name: "Users",
    icon: "nc-icon nc-single-02",
    component: Users,
    layout: "/admin",
    role: [3,5]
  },
  {
    path: "/edit-user/:id",
    name: "Edit User",
    icon: "nc-icon nc-single-02",
    component: EditUser,
    layout: "/admin",
    child: true,
    role: [3,5]
  },
  {
    path: "/sales",
    name: "Sales",
    icon: "nc-icon nc-chart-bar-32",
    component: Sales,
    layout: "/admin",
    role: [3,5]
  },
  {
    path: "/my-sales",
    name: "My Sales",
    icon: "nc-icon nc-chart-bar-32",
    component: AgentSalesListing,
    layout: "/admin",
    role: [0]
  },
  {
    path: "/add-sale",
    name: "Add Sale",
    icon: "nc-icon nc-simple-add",
    component: AddSale,
    layout: "/admin",
    role: [0,3,5],
  },
  // {
  //   path: "/Messages",
  //   name: "Messages",
  //   icon: "nc-icon nc-send",
  //   component: ChatBox,
  //   layout: "/admin",
  //   role: [0,3,5],
  // },
  {
    path: "/leads",
    name: "Leads",
    icon: "nc-icon nc-diamond",
    component: LeadListing,
    layout: "/admin",
    role: [3,5]
  },
  {
    path: "/lead-details/:_id",
    name: "Lead Details ",
    icon: "nc-iconnc-diamond",
    component: LeadDetail,
    role: [2,3,5],
    child: true,
  },
  {
    path: "/my-leads",
    name: "My Leads",
    icon: "nc-icon nc-diamond",
    component: LeadsAssignedToREA,
    role: [2], 
  },
  {
    path: "/my-profile",
    name: "My Profile",
    icon: "nc-icon nc-badge",
    component: UserProfile,
    role: [0,2,3,5], 
  },
  {
    path: "/agent-stats/:id",
    name: "RE Agent Stats",
    component: REAgentStatsListing,
    role: [3,5], 
    child: true
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin",
    role : [0,2,3,5]
  },
  {
    path: "/announcement",
    name: "Announcements",
    icon: "nc-icon nc-bell-55",
    component: Announcement,
    layout: "/admin",
    role : [3,5]
  },
//   {
//     path: "/maps",
//     name: "Maps",
//     icon: "nc-icon nc-pin-3",
//     component: Maps,
//     layout: "/admin"
//   },
//   {
//     path: "/notifications",
//     name: "Notifications",
//     icon: "nc-icon nc-bell-55",
//     component: Notifications,
//     layout: "/admin"
//   },
//   {
//     path: "/user-page",
//     name: "User Profile",
//     icon: "nc-icon nc-single-02",
//     component: UserPage,
//     layout: "/admin"
//   },
//   {
//     path: "/tables",
//     name: "Table List",
//     icon: "nc-icon nc-tile-56",
//     component: TableList,
//     layout: "/admin"
//   },
//   {
//     path: "/typography",
//     name: "Typography",
//     icon: "nc-icon nc-caps-small",
//     component: Typography,
//     layout: "/admin"
//   },
//   {
//     pro: true,
//     path: "/upgrade",
//     name: "Upgrade to PRO",
//     icon: "nc-icon nc-spaceship",
//     component: UpgradeToPro,
//     layout: "/admin"
//   }
];


export default routes;
