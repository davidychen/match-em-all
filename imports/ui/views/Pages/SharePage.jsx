import React from "react";
// import cx from "classnames";
import PropTypes from "prop-types";
// import Select from "react-select";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
/*import PictureUpload from "../../components/CustomUpload/PictureUpload.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";*/
// core components
import Button from "../../components/CustomButtons/Button.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";

import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  LineShareButton,
  WeiboShareButton
} from "react-share";

import sharePageStyle from "../../assets/jss/material-dashboard-pro-react/views/sharePageStyle.jsx";

class PropfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    const shareUrl = "https://match-em-all.herokuapp.com";
    const title = "Gotta Match 'Em All";
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={8}>
          <Card className={classes.card}>
            <div className={classes.wizardHeader}>
              <h2 className={classes.title}>Invite more friends</h2>
              <h3 className={classes.subtitle}>
                Play with your friends together.
              </h3>
            </div>
            <div className={classes.content}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <div className={classes.centerButtons}>
                    <div className={classes.oneButton}>
                      <FacebookShareButton
                        url={shareUrl}
                        // quote={title}
                        hashtag="#pokemon"
                        className="share-button"
                      >
                        <Button justIcon round color="facebook">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-facebook"
                            }
                          />
                        </Button>
                      </FacebookShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <TwitterShareButton
                        url={shareUrl}
                        title={title}
                        hashtags={["pokemon"]}
                        className="share-button"
                      >
                        <Button justIcon round color="twitter">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-twitter"
                            }
                          />
                        </Button>
                      </TwitterShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        separator=":: "
                        className="share-button"
                      >
                        <Button justIcon round color="whatsapp">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-whatsapp"
                            }
                          />
                        </Button>
                      </WhatsappShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <GooglePlusShareButton
                        url={shareUrl}
                        className="share-button"
                      >
                        <Button justIcon round color="google">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-google"
                            }
                          />
                        </Button>
                      </GooglePlusShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <LinkedinShareButton
                        url={shareUrl}
                        title={title}
                        // windowWidth={750}
                        // windowHeight={600}
                        className="share-button"
                      >
                        <Button justIcon round color="linkedin">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-linkedin"
                            }
                          />
                        </Button>
                      </LinkedinShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <PinterestShareButton
                        url={shareUrl}
                        media="https://github.com/davidychen/match-em-all/raw/master/public/og-image.jpg"
                        // windowWidth={1000}
                        // windowHeight={730}
                        className="share-button"
                      >
                        <Button justIcon round color="pinterest">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-pinterest"
                            }
                          />
                        </Button>
                      </PinterestShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <RedditShareButton
                        url={shareUrl}
                        title={title}
                        // windowWidth={660}
                        // windowHeight={460}
                        className="share-button"
                      >
                        <Button justIcon round color="reddit">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-reddit"
                            }
                          />
                        </Button>
                      </RedditShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <EmailShareButton
                        url={shareUrl}
                        subject={"Let's play " + title}
                        body="I would love to invite you playing with me together!"
                        className="share-button"
                      >
                        <Button justIcon round color="warning">
                          <i
                            className={
                              classes.socialButtonsIcons + " fas fa-envelope"
                            }
                          />
                        </Button>
                      </EmailShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <LineShareButton
                        url={shareUrl}
                        title={title}
                        className="share-button"
                      >
                        <Button justIcon round color="line">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-line"
                            }
                          />
                        </Button>
                      </LineShareButton>
                    </div>
                    <div className={classes.oneButton}>
                      <WeiboShareButton
                        url={shareUrl}
                        title={title}
                        image="https://github.com/davidychen/match-em-all/raw/master/public/og-image.jpg"
                        className="share-button"
                      >
                        <Button justIcon round color="weibo">
                          <i
                            className={
                              classes.socialButtonsIcons + " fab fa-weibo"
                            }
                          />
                        </Button>
                      </WeiboShareButton>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

PropfilePage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(sharePageStyle)(PropfilePage);
