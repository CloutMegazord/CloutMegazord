/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import SettingsIcon from '@material-ui/icons/Settings';
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";

// core components/views for Admin layout
import MegazordsList from "views/MegazordsList/MegazordsList.js";
import UserProfile from "views/UserProfile/UserProfile.js";

import TasksList from "views/TasksList/TasksList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";

// core components/views for Landing layout
import Home from "views/Home/Home.js";
import TermsContent from "components/Terms/TermsContent.js";
import TaskSessionRedirect from "components/Terms/TaskSessionRedirect.js";

const routes = [
    {
      path: "/home",
      name: "Home",
      component: Home,
      layout: "/landing"
    },
    {
      path: "/terms",
      name: "Terms",
      component: TermsContent,
      layout: "/landing"
    },
    {
      path: "/sr",
      name: "TaskSessionRedirect",
      component: TaskSessionRedirect,
      layout: "/landing"
    },
    {
      path: "/megazordslist",
      name: "Megazords List",
      rtlName: "لوحة القيادة",
      icon: Dashboard,
      component: MegazordsList,
      layout: "/admin"
    },
    {
      path: "/settings",
      name: "User Settings",
      rtlName: "لوحة القيادة",
      icon: SettingsIcon,
      component: UserProfile,
      layout: "/admin"
    },
    {
      path: "/notifications",
      name: "Notifications",
      rtlName: "إخطارات",
      icon: Notifications,
      component: NotificationsPage,
      layout: "/admin"
    },
    {
      path: "/tasks_list",
      name: "Tasks List",
      rtlName: "لوحة القيادة",
      icon: Dashboard,
      component: TasksList,
      layout: "/admin"
    },
    {
      path: "/task",
      name: "Task",
      rtlName: "إخطارات",
      icon: Notifications,
      component: UserProfile,
      layout: "/admin"
    }
]

// dashboardRoutes = [
//   {
//     path: "/dashboard",
//     name: "Dashboard",
//     rtlName: "لوحة القيادة",
//     icon: Dashboard,
//     component: DashboardPage,
//     layout: "/admin"
//   },
//   // {
//   //   path: "/user",
//   //   name: "User Profile",
//   //   rtlName: "ملف تعريفي للمستخدم",
//   //   icon: Person,
//   //   component: UserProfile,
//   //   layout: "/admin"
//   // },
//   // {
//   //   path: "/table",
//   //   name: "Table List",
//   //   rtlName: "قائمة الجدول",
//   //   icon: "content_paste",
//   //   component: TableList,
//   //   layout: "/admin"
//   // },
//   // {
//   //   path: "/typography",
//   //   name: "Typography",
//   //   rtlName: "طباعة",
//   //   icon: LibraryBooks,
//   //   component: Typography,
//   //   layout: "/admin"
//   // },
//   // {
//   //   path: "/icons",
//   //   name: "Icons",
//   //   rtlName: "الرموز",
//   //   icon: BubbleChart,
//   //   component: Icons,
//   //   layout: "/admin"
//   // },
//   // {
//   //   path: "/maps",
//   //   name: "Maps",
//   //   rtlName: "خرائط",
//   //   icon: LocationOn,
//   //   component: Maps,
//   //   layout: "/admin"
//   // },
//   {
//     path: "/notifications",
//     name: "Notifications",
//     rtlName: "إخطارات",
//     icon: Notifications,
//     component: NotificationsPage,
//     layout: "/admin"
//   },
//   // {
//   //   path: "/rtl-page",
//   //   name: "RTL Support",
//   //   rtlName: "پشتیبانی از راست به چپ",
//   //   icon: Language,
//   //   component: RTLPage,
//   //   layout: "/rtl"
//   // },
//   // {
//   //   path: "/upgrade-to-pro",
//   //   name: "Upgrade To PRO",
//   //   rtlName: "التطور للاحترافية",
//   //   icon: Unarchive,
//   //   component: UpgradeToPro,
//   //   layout: "/admin"
//   // }
// ];

export default routes;
