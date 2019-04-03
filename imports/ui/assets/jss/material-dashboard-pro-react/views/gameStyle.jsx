import {
  successColor,
  tooltip,
  cardTitle,
  grayColor,
  whiteColor,
  primaryColor
} from "../../../../assets/jss/material-dashboard-pro-react.jsx";

import hoverCardStyle from "../../../../assets/jss/material-dashboard-pro-react/hoverCardStyle.jsx";

/*.Dashboard-cardBackDivider-594 {
    width: 100%;
    top: calc(50% - 1.4rem);
    position: absolute;
    height: 2.8rem;
    align-self: center; 
    transition: width 0.3s 0.1s ease, height 0.3s 0.3s ease;
    background-color: #555555;
}*/
/*.Dashboard-cardBackCircle-595 {
    left: calc(50% - 2rem);
    top: calc(50% - 2rem);
    width: 3.1rem;
    height: 3.1rem;
    border: 0.6rem solid #555555;
    position: absolute;
    transition: all 0.3s ease;
    border-radius: 2000rem;
    background-color: #FFF;
}*/

const dashboardStyle = {
  ...hoverCardStyle,
  tooltip,
  cardTitle: {
    ...cardTitle,
    marginTop: "0px",
    marginBottom: "3px"
  },
  imageSquare: {
    position: "relative",
    overflow: "hidden",
    paddingBottom: "100%",
    "& img": {
      position: "absolute",
      maxWidth: "100%",
      maxHeight: "100%",
      top: "50%",
      left: "50%",
      transform: "translateX(-50%) translateY(-50%)"
    }
  },
  cardBack: {
    position: "relative",
    overflow: "hidden",
    paddingBottom: "100%",
    background:
      "linear-gradient(" + primaryColor[0] + " 50%, " + whiteColor + " 50%)",
    borderRadius: "30px",
    display: "flex",
    "&:hover $cardBackDivider": {
      height: "5rem"
    }
  },
  cardBackDivider: {
    height: "2.8rem",
    width: "100%",
    backgroundColor: grayColor[6],
    alignSelf: "center",
    transition: "width 0.3s 0.1s ease, height 0.3s 0.3s ease"
  },
  cardBackCircle: {
    width: "8.1rem",
    height: "8.1rem",
    borderRadius: "2000rem",
    border: "1.2rem solid " + grayColor[6],
    backgroundColor: whiteColor,
    position: "fixed",
    top: "calc(50% - 4rem)",
    left: "calc(50% - 4rem)",
    transition: "all 0.3s ease"
  },
  // cardSquare: {
  //   /*position: "absolute",
  //   top: "0",
  //   bottom: "0",
  //   left: "0",
  //   right: "0",*/
  //   position: "relative",
  //   top: "50%",
  //   "& div": {
  //     display: "table",
  //     width: "100%",
  //     height: "100%",
  //     textAlign: "center",
  //     alignItems: "center",
  //     justifyContent: "center"
  //     position: "relative",
  //     top: "50%"
  //   },
  //   "& img": {
  //     display: "table-cell",
  //     textAlign: "center",
  //     verticalAlign: "middle",
  //     alignItems: "center",
  //     justifyContent: "center"
  //   }
  // },
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
  }
};

export default dashboardStyle;
