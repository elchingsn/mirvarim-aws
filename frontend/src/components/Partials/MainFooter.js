/*eslint-disable*/
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { useTranslation } from 'react-i18next';
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Mail from "@material-ui/icons/Mail";
import Favorite from "@material-ui/icons/Favorite";
// core components
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import Button from "components/Partials/Button.js";
import CustomInput from "components/Partials/CustomInput.js";
import Footer from "components/Partials/Footer.js";

import styles from "assets/jss/mainFooterStyle.js";

const useStyles = makeStyles(styles);

const SectionFooter = (props) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { currentUser } = props;

  if(props.location.pathname.match(/partner/)){
    return (null);
  }

  return (
    <div className={classes.section}>
      
       <div>

       <Footer
          theme="white"
          content={
            <div>
              <div className={classes.left}>
              <List className={classes.list}>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="#Mirvarim"
                      target="_blank"
                      className={classes.block}
                    >
                      <Link to="/">
                        Mirvarim
                      </Link>
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      target="_blank"
                      className={classes.block}
                    >
                      <Link to="/privacy">
                        {t("Privacy Policy")}
                      </Link>
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      target="_blank"
                      className={classes.block}
                    >
                      <Link to="/pricing">
                        {t("Pricing")}
                      </Link>
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      target="_blank"
                      className={classes.block}
                    >
                      <Link to="/contact">
                        {t("Contact")}
                      </Link>
                    </a>
                  </ListItem>
                  {/* <ListItem className={classes.inlineBlock}>
                    <a
                      href="#help"
                      target="_blank"
                      className={classes.block}
                    >
                      Help
                    </a>
                  </ListItem> */}
                </List>
              </div>
              {/* <div className={classes.pullCenter}>
              &copy; {1900 + new Date().getYear()} , Mirvarim,  {" "}
                 All Rights Reverved.
              </div> */}
              <div className={classes.rightLinks}>
                <ul>
                  {/* <li>
                    <Button
                      href="https://twitter.com"
                      target="_blank" 
                      color="twitter"
                      justIcon
                      simple
                    >
                      <i className="fab fa-twitter" />
                    </Button>
                  </li> */}
                  <li>
                    <Button
                      href="https://www.facebook.com/Mirvarim-101453745201412/"
                      target="_blank"
                      color="facebook"
                      justIcon
                      simple
                    >
                      <i className="fab fa-facebook" />
                    </Button>
                  </li>
                  <li>
                    <Button
                      href="https://instagram.com/mirvarim_official"
                      target="_blank"
                      color="instagram"
                      justIcon
                      simple
                    >
                      <i className="fab fa-instagram" />
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          }
        />        
      </div>
    </div>
  );
}

export default withRouter(SectionFooter);
