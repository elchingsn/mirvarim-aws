// import 'assets/jss/fullcalendar/core_main.css';
// import 'assets/jss/fullcalendar/daygrid_main.css';
// import 'assets/jss/fullcalendar/timegrid_main.css';
// import 'assets/jss/fullcalendar/list_main.css';
//import '@fullcalendar/common/main.css';
import React, {
  useState,
  useRef,
  useEffect,
  useContext
} from 'react';
import { UserContext } from "App.js"
//import {ME_QUERY} from "App.js"
import { useTranslation } from 'react-i18next';

import SalonCalendarView from "components/Partner/Dashboard/views/calendar/CalendarView/SalonCalendarView"
import MasterCalendarView from "components/Partner/Dashboard/views/calendar/CalendarView/MasterCalendarView"

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export default function CalendarView() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const currentUser = useContext(UserContext);

  if (currentUser.role == "A_2" && currentUser.masterSet.length>0 && currentUser.masterSet[0].isStaff && currentUser.masterSet[0].staffStatus === "confirmed") {
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Personal calendar" {...a11yProps(0)} />
            <Tab label="Salon calendar" {...a11yProps(1)} />
            {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <SalonCalendarView currentUser={currentUser}/>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <MasterCalendarView salon={currentUser.masterSet[0].salon} currentUser={currentUser} />
          </TabPanel>
          {/* <TabPanel value={value} index={2} dir={theme.direction}>
            Item Three
          </TabPanel> */}
        </SwipeableViews>
      </div>
    )
  } else {
    return <SalonCalendarView currentUser={currentUser}/>
  }
}


// const CalendarView = () => {

//   const { t } = useTranslation();
//   const currentUser = useContext(UserContext);

//   if (!currentUser.salonSet[0]) {
//     return <div style={{padding: "20px"}}> {t("No salon added. Please add a salon")}</div>
//   } else if (!currentUser.salonSet[0].masterSet[0]) {
//     return <div style={{padding: "20px"}}> {t("No master added. Please add a master")}</div>
//   } else {
//     return <SelectedCalendar currentUser={currentUser} bookings={data.bookings}/>
//   }
// }

// export default CalendarView;
