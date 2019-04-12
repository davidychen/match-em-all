import {
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  cardTitle,
  /*hexToRgb,*/
  normalColor,
  fightingColor,
  flyingColor,
  poisonColor,
  groundColor,
  rockColor,
  bugColor,
  ghostColor,
  steelColor,
  fireColor,
  waterColor,
  grassColor,
  electricColor,
  psychicColor,
  iceColor,
  dragonColor,
  darkColor,
  fairyColor,
  unknownColor,
  shadowColor
} from "../../../../assets/jss/material-dashboard-pro-react.jsx";

const landingPanelStyle = () => ({
  cardTitle,
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  },
  cardCategory: {
    margin: "0",
    color: "#999999"
  },
  /*cardCategory: {
    margin: "0",
    color: grayColor[0]
  },*/
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  legendTitle: {
    color: grayColor[0],
    margin: "10px 0 !important",
    display: "flex"
  },
  primary: {
    color: primaryColor[0]
  },
  warning: {
    color: warningColor[0]
  },
  danger: {
    color: dangerColor[0]
  },
  success: {
    color: successColor[0]
  },
  info: {
    color: infoColor[0]
  },
  rose: {
    color: roseColor[0]
  },
  gray: {
    color: grayColor[0]
  },
  cardFooter: {
    display: "block"
  },
  emptyFill: {
    fill: grayColor[0]
  },
  normalFill: {
    fill: normalColor
  },
  fightingFill: {
    fill: fightingColor
  },
  flyingFill: {
    fill: flyingColor
  },
  poisonFill: {
    fill: poisonColor
  },
  groundFill: {
    fill: groundColor
  },
  rockFill: {
    fill: rockColor
  },
  bugFill: { fill: bugColor },
  ghostFill: { fill: ghostColor },
  steelFill: { fill: steelColor },
  fireFill: { fill: fireColor },
  waterFill: { fill: waterColor },
  grassFill: { fill: grassColor },
  electricFill: { fill: electricColor },
  psychicFill: { fill: psychicColor },
  iceFill: { fill: iceColor },
  dragonFill: { fill: dragonColor },
  darkFill: { fill: darkColor },
  fairyFill: { fill: fairyColor },
  unknownFill: { fill: unknownColor },
  shadowFill: { fill: shadowColor },
  legendBadge: {
    marginBottom: "15px"
  }
});

export default landingPanelStyle;
