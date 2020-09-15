import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import EventAvailable from '@material-ui/icons/EventAvailable';
import Search from '@material-ui/icons/Search';
import InsertComment from '@material-ui/icons/InsertComment';
import Phonelink from '@material-ui/icons/Phonelink';
import PhoneIphone from '@material-ui/icons/PhoneIphone';
import TrendingUp from '@material-ui/icons/TrendingUp';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import AccessTime from "@material-ui/icons/AccessTime";
import AttachMoney from "@material-ui/icons/AttachMoney";
// core components
import Hidden from "@material-ui/core/Hidden";
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import FeatureInfo from "components/Partials/FeatureInfo.js";

import featuresStyle from "assets/jss/featuresStyle.js";
import mockup1 from "assets/img/mockup.png"

const useStyles = makeStyles(featuresStyle);

export default function SectionFeatures({ ...rest }) {
  const classes = useStyles();
  return (
    <div className="cd-section" {...rest}>
      <div className={classes.container}>
      <Hidden smDown implementation="css">
        {/* Feature 1 START */}
        <div className={classes.features1}>
          <GridContainer>
            <GridItem
              xs={12}
              sm={8}
              md={8}
              className={
                classes.mlAuto + " " + classes.mrAuto + " " + classes.textCenter
              }
            >
              <h2 className={classes.title}>Why to use our platform</h2>
              {/* <h5 className={classes.description}>
            </h5> */}
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={4} md={4}>
              <FeatureInfo
                icon={Search}
                title="Discover"
                description={
                  <span>
                    <p>
                      Find out latest trends and services
                    </p>
                  </span>
                }
                iconColor="info"
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <FeatureInfo
                icon={InsertComment}
                title="Connect"
                description={
                  <span>
                    <p>
                      Engage community and rate salons
                    </p>
                  </span>
                }
                iconColor="danger"
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <FeatureInfo
                icon={Phonelink}
                title="Book"
                description={
                  <span>
                    <p>
                      Book beauty and wellness services 
                    </p>
                  </span>
                }
                iconColor="success"
              />
            </GridItem>
          </GridContainer>
        </div>
        {/* Feature 1 END */}
        </Hidden>
        {/* Feature 2 START */}
        <div className={classes.features2}>
          <GridContainer>
            <GridItem
              xs={12}
              sm={8}
              md={8}
              className={
                classes.mlAuto + " " + classes.mrAuto + " " + classes.textCenter
              }
            >
              <h2 className={classes.title}>Discover how we can help you grow your business</h2>
              <h5 className={classes.description}>
              Mirvarim is a beauty management platform that helps your beauty salon or spa connect with new and existing customers. 
              Mirvarim also provides state-of-the-art salon management software, designed to simplify managing your daily operations.
              </h5>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={4} md={4} lg={3} className={classes.mlAuto}>
              <FeatureInfo
                icon={PhoneIphone}
                title="Advertise your business"
                description="Increase awareness of your salon, update services, allow customers to reach your easily. Mirvarim gives you the tools you need to reach out to both new and existing clients, by increasing your visibility across multiple channels."
                iconColor="info"
              />
              <FeatureInfo
                icon={TrendingUp}
                title="Optimize your business"
                description="Get business insights from our data analysis and run customized reports on your salon's performance"
                iconColor="danger"
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4} lg={4}>
              <div className={classes.phoneContainer}>
                <img src={mockup1} alt="..." />
              </div>
            </GridItem>
            <GridItem xs={12} sm={4} md={4} lg={3} className={classes.mrAuto}>
              <FeatureInfo
                icon={EventAvailable}
                title="Appointments anytime, anywere"
                description=" Clients can check your availability and book their visits 24/7, from anywhere. 60% of appointments are booked outside of working hours, and with Mirvarim, you don’t have to miss out."
                iconColor="primary"
              />
              <FeatureInfo
                icon={SupervisorAccount}
                title="Stay connected"
                description="Keep key client details at your fingertips: customizable client profiles store information like booking history, no-shows and appointment reminders in one easy location."
                iconColor="success"
              />
            </GridItem>
          </GridContainer>
        </div>
        {/* Feature 2 END */}
      </div>
    </div>
  );
}
