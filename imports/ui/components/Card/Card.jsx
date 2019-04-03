import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import cardStyle from "../../assets/jss/material-dashboard-pro-react/components/cardStyle.jsx";

function Card({ ...props }) {
  const {
    classes,
    className,
    children,
    plain,
    game,
    back,
    profile,
    blog,
    raised,
    background,
    pricing,
    color,
    product,
    testimonial,
    chart,
    login,
    ...rest
  } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardGame]: game,
    [classes.cardBack]: back,
    [classes.cardProfile]: profile || testimonial,
    [classes.cardBlog]: blog,
    [classes.cardRaised]: raised,
    [classes.cardBackground]: background,
    [classes.cardPricingColor]:
      (pricing && color !== undefined) || (pricing && background !== undefined),
    [classes[color]]: color,
    [classes.cardPricing]: pricing,
    [classes.cardProduct]: product,
    [classes.cardChart]: chart,
    [classes.cardLogin]: login,
    [className]: className !== undefined
  });
  if (back) {
    return (
      <div className={cardClasses} {...rest}>
        <div className={classes.cardBackDivider} />
        <div className={classes.cardBackCircle} />
      </div>
    );
  } else {
    return <div className={cardClasses} {...rest}>
      {children}
    </div>;
  }
}

Card.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  game: PropTypes.bool,
  back: PropTypes.bool,
  profile: PropTypes.bool,
  blog: PropTypes.bool,
  raised: PropTypes.bool,
  background: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ]),
  product: PropTypes.bool,
  chart: PropTypes.bool,
  login: PropTypes.bool
};

export default withStyles(cardStyle)(Card);
