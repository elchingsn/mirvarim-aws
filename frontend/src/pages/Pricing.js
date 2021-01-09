import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from 'react-i18next';
// core components
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import Card from "components/Partials/Card.js";
import CardBody from "components/Partials/CardBody.js";
import CardFooter from "components/Partials/CardFooter.js";
import Button from "components/Partials/Button.js";
import city from "assets/img/city.jpg";

import pricingStyle from "assets/jss/pricingStyle.js";
const useStyles = makeStyles(pricingStyle);

const Pricing = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  },[]);

  return (
      <div
        className={classes.pricing + " " + classes.section}
        style={{ backgroundImage: `url(${city})` }}
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              xs={12}
              sm={6}
              md={6}
              className={
                classes.mlAuto + " " + classes.mrAuto + " " + classes.textCenter
              }
            >
              <h2 className={classes.title}>{t("Choose the best plan for you")}</h2>
              <h5 className={classes.description}>
                <b>{t("Standard package is free to use until 30.06.2021")}</b>
              </h5>
              <div className={classes.sectionSpace} />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6} className={classes.mlAuto}>
              <Card pricing>
                <CardBody pricing>
                  <h6 className={classes.cardDescription}>{t("Basic")}</h6>
                  <h1 className={classes.cardTitle}>
                    <small>AZN</small> 0 <small>/{t("month")}</small>
                  </h1>
                  <ul>
                    <li>
                      {t("Customized webpage for your salon")}
                    </li>
                    <li>
                       {t("Salon management tools")}
                    </li>
                    <li>
                      {t("Marketing tools")}
                    </li>
                    <li>
                      {t("Online booking 24/7")}
                    </li>
                    {/* <li>
                      {t("1 staff member")}
                    </li> */}
                  </ul>
                </CardBody>
                {/* <CardFooter pricing className={classes.justifyContentCenter}>
                  <Button color="primary" round>
                    Join
                  </Button>
                </CardFooter> */}
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className={classes.mrAut}>
              <Card pricing color="primary">
                <CardBody pricing>
                  <h6
                    className={
                      classes.cardCategory + " " + classes.marginBottom30
                    }
                  >
                    {t("Standard")}
                  </h6>
                  <h1 className={classes.cardTitleWhite}>
                    <small>AZN</small> 5 <small>/{t("month")}</small>
                  </h1>
                  <ul>
                    <li>
                      {t("Everything in basic package")}
                    </li>
                    {/* <li>
                      {t("Online booking 24/7")}
                    </li>
                    <li>
                      {t("up to 3 staff members")} 
                    </li> */}
                    <li>
                      {t("Additional tools to fill your calendar")}
                    </li>
                    <li>
                      {t("Booking notification and reminders")}
                    </li>
                    <li>
                      {t("Targeted marketing")}
                    </li>
                  </ul>
                </CardBody>
                {/* <CardFooter pricing className={classes.justifyContentCenter}>
                  <Button color="white" round>
                    Join
                  </Button>
                </CardFooter> */}
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
  );
}

export default Pricing;

