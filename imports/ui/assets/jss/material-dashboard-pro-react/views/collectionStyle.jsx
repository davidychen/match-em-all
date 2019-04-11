import {
  successColor,
  tooltip,
  cardTitle,
  grayColor,
  whiteColor,
  primaryColor,
  dangerColor,
  boxShadow
} from "../../../../assets/jss/material-dashboard-pro-react.jsx";

import hoverCardStyle from "../../../../assets/jss/material-dashboard-pro-react/hoverCardStyle.jsx";
import modalStyle from "../../../../assets/jss/material-dashboard-pro-react/modalStyle.jsx";
import customSelectStyle from "../../../../assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "../../../../assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const dashboardStyle = theme => ({
  ...customCheckboxRadioSwitch,
  ...customSelectStyle,
  ...hoverCardStyle,
  tooltip,
  cardTitle: {
    ...cardTitle,
    marginTop: "0px",
    marginBottom: "3px"
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  cardProductTitle: {
    ...cardTitle,
    marginTop: "0px",
    marginBottom: "3px",
    textAlign: "center"
  },
  cardCategory: {
    color: grayColor[0],
    fontSize: "14px",
    paddingTop: "10px",
    marginBottom: "0",
    marginTop: "0",
    margin: "0"
  },
  cardProductDesciprion: {
    textAlign: "center",
    color: grayColor[0]
  },
  stats: {
    color: grayColor[0],
    fontSize: "12px",
    lineHeight: "22px",
    display: "inline-flex",
    "& svg": {
      position: "relative",
      top: "4px",
      width: "16px",
      height: "16px",
      marginRight: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      top: "4px",
      fontSize: "16px",
      marginRight: "3px"
    }
  },
  avatar: {
    width: "100%",
    overflowX: "scroll",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  productStats: {
    paddingTop: "7px",
    paddingBottom: "7px",
    margin: "0"
  },
  successText: {
    color: successColor[0]
  },
  upArrowCardCategory: {
    width: 14,
    height: 14
  },
  underChartIcons: {
    width: "17px",
    height: "17px"
  },
  price: {
    color: "inherit",
    "& h4": {
      marginBottom: "0px",
      marginTop: "0px"
    }
  },
  gamePadding: {
    padding: "0 30px"
  },
  loading: {
    textAlign: "center"
  },
  avatarNoti: {
    position: "relative",
  },
  user: {
    /*paddingBottom: "20px",*/
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "0",
      right: "15px",
      height: "1px",
      width: "calc(100% - 30px)",
      backgroundColor: "hsla(0,0%,100%,.3)"
    }
  },
  photo: {
    transition: "all 300ms linear",
    width: "34px",
    height: "34px",
    overflow: "hidden",
    float: "left",
    zIndex: "5",
    marginRight: "11px",
    borderRadius: "50%",
    marginLeft: "23px",
    ...boxShadow
  },
  avatarImg: {
    width: "100%",
    verticalAlign: "middle",
    border: "0"
  },
  notifications: {
    zIndex: "4",
    position: "absolute",
    top: "0px",
    border: "1px solid " + whiteColor,
    right: "5px",
    fontSize: "9px",
    background: dangerColor[0],
    color: whiteColor,
    minWidth: "16px",
    height: "16px",
    borderRadius: "10px",
    textAlign: "center",
    lineHeight: "14px",
    verticalAlign: "middle",
    display: "block"
  },
  cardAvatar: {
    display: "inline"
    /*text-align: center*/
  },
  center: {
    textAlign: "center"
  },
  right: {
    textAlign: "right"
  },
  left: {
    textAlign: "left"
  },
  marginRight: {
    marginRight: "5px"
  },
  modalSectionTitle: {
    marginTop: "30px"
  },
  icons: {
    width: "17px",
    height: "17px"
  },
  orderButton: {
    marginTop: "23px"
  },
  ...modalStyle(theme)
});

export default dashboardStyle;
