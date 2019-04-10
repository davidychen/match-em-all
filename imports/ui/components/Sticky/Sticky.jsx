import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Sticky extends Component {
  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    relative: PropTypes.bool,
    children: PropTypes.func.isRequired,
    disableCompensation: PropTypes.bool,
    disableHardwareAcceleration: PropTypes.bool
  };

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    disableCompensation: false,
    disableHardwareAcceleration: false
  };

  static contextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    getParent: PropTypes.func
  };

  /*constructor(props) {
    super(props);
    this.content = React.createRef();
  }*/

  state = {
    isSticky: false,
    wasSticky: false,
    style: {}
  };

  componentWillMount() {
    if (!this.context.subscribe)
      throw new TypeError(
        "Expected Sticky to be mounted within StickyContainer"
      );

    this.context.subscribe(this.handleContainerEvent);
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent);
  }

  componentDidUpdate() {
    this.placeholder.style.paddingBottom = this.props.disableCompensation
      ? 0
      : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`;
  }

  handleContainerEvent = ({
    distanceFromTop,
    distanceFromBottom,
    eventSource
  }) => {
    console.log(
      "top",
      distanceFromTop,
      "bottom",
      distanceFromBottom,
      "event",
      eventSource
    );

    const parent = this.context.getParent();

    let preventingStickyStateChanges = false;
    if (this.props.relative) {
      preventingStickyStateChanges = eventSource !== parent;
      // distanceFromTop =
      //   -(eventSource.scrollTop + eventSource.offsetTop) +
      //   this.placeholder.offsetTop;
      distanceFromBottom =
        -(
          parent.scrollHeight -
          eventSource.scrollTop -
          eventSource.clientTop -
          eventSource.offsetTop
        ) + this.placeholder.offsetTop;
    }

    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;

    // const bottomDifference =
    //   distanceFromBottom - this.props.bottomOffset - calculatedHeight;
    const topDifference = distanceFromTop - this.props.topOffset;

    const wasSticky = !!this.state.isSticky;
    // const isSticky = preventingStickyStateChanges
    //   ? wasSticky
    //   : distanceFromTop <= -this.props.topOffset &&
    //     distanceFromBottom > -this.props.bottomOffset;
    const isSticky = preventingStickyStateChanges
      ? wasSticky
      : distanceFromBottom <= -this.props.bottomOffset &&
        distanceFromTop > -this.props.topOffset;

    // distanceFromBottom =
    //   (this.props.relative
    //     ? parent.scrollHeight - parent.scrollTop
    //     : distanceFromBottom) - calculatedHeight;
    distanceFromTop = this.props.relative ? parent.scrollTop : distanceFromTop;

    const style = !isSticky
      ? {}
      : {
          position: "fixed",
          top:
            topDifference > 0
              ? this.props.relative
                ? parent.offsetTop - parent.offsetParent.scrollTop
                : 0
              : topDifference,
          left: placeholderClientRect.left,
          width: placeholderClientRect.width
        };

    if (!this.props.disableHardwareAcceleration) {
      style.transform = "translateZ(0)";
    }

    console.log(
      "distanceFromBottom",
      distanceFromBottom,
      "topDifference",
      topDifference,
      "isSticky",
      isSticky,
      "distanceFromTop",
      distanceFromTop,
      "style",
      style
    );

    this.setState({
      isSticky,
      wasSticky,
      distanceFromTop,
      distanceFromBottom,
      calculatedHeight,
      style
    });
  };

  render() {
    const element = React.cloneElement(
      this.props.children({
        isSticky: this.state.isSticky,
        wasSticky: this.state.wasSticky,
        distanceFromTop: this.state.distanceFromTop,
        distanceFromBottom: this.state.distanceFromBottom,
        calculatedHeight: this.state.calculatedHeight,
        style: this.state.style
      }),
      {
        ref: content => {
          this.content = ReactDOM.findDOMNode(content);
        }
      }
    );

    return (
      <div>
        {/*<div ref={placeholder => (this.placeholder = placeholder)} />*/}
        {element}
        <div ref={placeholder => (this.placeholder = placeholder)} />
      </div>
    );
  }
}
