import Game from "./views/Game/Game.jsx";
import Collection from "./views/Collection/Collection.jsx";
import ErrorPage from "./views/Pages/ErrorPage.jsx";
import LandingPage from "./views/Pages/LandingPage.jsx";
import LoginPage from "./views/Pages/LoginPage.jsx";
import ProfilePage from "./views/Pages/ProfilePage.jsx";
import RegisterPage from "./views/Pages/RegisterPage.jsx";
import SharePage from "./views/Pages/SharePage.jsx";

// @material-ui/icons
import AccountBox from "@material-ui/icons/AccountBox";
import Image from "@material-ui/icons/Image";
import VideogameAsset from "@material-ui/icons/VideogameAsset";
import Collections from "@material-ui/icons/Collections";
import Share from "@material-ui/icons/Share";

var dashRoutes = [
  {
    path: "/game",
    name: "Game",
    icon: VideogameAsset,
    component: Game,
    layout: "/admin"
  },
  {
    path: "/collection",
    name: "Collection",
    icon: Collections,
    component: Collection,
    layout: "/admin"
  },
  {
    path: "/profile",
    name: "Profile",
    icon: AccountBox,
    component: ProfilePage,
    layout: "/admin"
  },
  {
    path: "/share",
    name: "Share",
    icon: Share,
    component: SharePage,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Pages",
    icon: Image,
    state: "pageCollapse",
    layout: "/public",
    views: [
      {
        path: "/landing-page",
        name: "Match 'Em All",
        mini: "M",
        component: LandingPage,
        layout: "/public"
      },
      {
        path: "/login-page",
        name: "Login Page",
        mini: "L",
        component: LoginPage,
        layout: "/public"
      },
      {
        path: "/register-page",
        name: "Register Page",
        mini: "R",
        component: RegisterPage,
        layout: "/public"
      },
      {
        path: "/error-page",
        name: "Error Page",
        mini: "E",
        component: ErrorPage,
        layout: "/public"
      }
    ]
  }
];
export default dashRoutes;
