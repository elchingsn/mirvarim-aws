import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CancelIcon from '@material-ui/icons/Cancel';

import DatePicker from "utils/DatePicker/DatePicker.js"
import formatISO from 'date-fns/formatISO'
import _ from 'lodash';
import InputMask from 'react-input-mask';
// import { DayCellContent } from '@fullcalendar/react';
// import { setDay } from 'date-fns';

import { CREATE_BOOKING } from "components/Partner/Dashboard/views/calendar/CalendarView/CreateEventForm.js"
import { PROFILE_QUERY } from "pages/Profile.js"
import { SlowMotionVideoOutlined } from '@material-ui/icons';

export default function Booking({services, salon, currentUser, setBookingDialog}) {

  const { t } = useTranslation();
  //console.log('all bookings', salon)
  const [masterBookings, setMasterbookings] = useState([]);
  //console.log('filter bookings', bookings)
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [submitting, setSubmitting] = useState(false)
  const [snack, setSnack] = useState({
    snackOpen: false,
    snackType: "",
    snackMessage: ""
  })

  // const [masterWorkingHours, setMasterWorkingHours] = useState({
  //   monday: [],
  //   tuesday: [],
  //   wednesday: [],
  //   thursday: [],
  //   friday: [],
  //   saturday: [],
  //   sunday: []
  // })

  const [bookingData, setBookingData] = useState({
    //masterId: salon.masterSet[0].id,
    masterId: "",
    customerName: currentUser.username, 
    customerEmail: currentUser.email,
    customerMobile: '',
    serviceTitle: services[0].title,
    servicePrice: services[0].promotionPrice ? Math.min(services[0].price,services[0].promotionPrice) : services[0].price,
    duration: services[0].duration,
    start: '',
    isConfirmed: false
  })

  const [den, setDen] = useState("");
  const [busyTime, setBusyTime] = useState({});
  const [freeTime, setFreeTime] = useState([]);

  //choose default master by least booking in the calendar
  // useEffect(() => {
  //   if (bookingData.masterId == "" || bookingData.masterId == undefined) {
  //     setBookingData({
  //       ...bookingData, 
  //       masterId: salon.masterSet.reduce((total, next) => {
  //         Math.min(total.bookingSet.length, next.bookingSet.length);
  //         return(total)
  //         }).id
  //     })    
  //     setMasterbookings( salon.masterSet.reduce((total, next) => {
  //       Math.min(total.bookingSet.length, next.bookingSet.length);
  //       return(total)
  //       }).bookingSet )                  
  //   }
  // }, [bookingData])

  // useEffect(() => {
  //   if (currentUser.role == "A_2") {
  //     setBookingData({
  //       ...bookingData, 
  //       masterId: salon.masterSet[0].id
  //     })
  //   }
  // }, [currentUser])


  const [createBooking, { data: create_data }] = useMutation(CREATE_BOOKING, {
    onCompleted({ booking }) {
      setSnack ({
      ...snack,
      snackOpen: true,
      snackType: "success",
      snackMessage: "Confirmed"
      //snackMessage: `Appointment for ${booking.serviceTitle} service was confirmed on ${new Date(booking.start).toString().slice(0,21)}`
    })
  },
    refetchQueries: [{ query: PROFILE_QUERY, variables: { id:currentUser.id }}],
    awaitRefetchQueries: true,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCancel = () => {
    setBookingDialog(false);
    setBookingData({
      ...bookingData,
      masterId: salon.masterSet[0].id,
      customerName: currentUser.username, 
      customerEmail: currentUser.email,
      customerMobile: '',
      serviceTitle: services[0].title,
      servicePrice: services[0].promotionPrice ? Math.min(services[0].price,services[0].promotionPrice) : services[0].price,
      duration: services[0].duration,
      start: '',
      isConfirmed: false
    })
  };

  // console.log("bookingData", bookingData)

  const handleConfirm = () => {
    createBooking({variables: { bookingData: bookingData }}).catch(err => {
      console.error(err);
    });
    setSubmitting(true)
  };

  const handleSnackClose = () => {
    //setSubmitting(false);
    setBookingDialog(false)
    setSnack ({ ...snack,snackOpen: false })
  }

  function getSteps() {
    return [t("Choose the service"), t("When do you want it?"), t("Enter your phone number")];
  }

  const selectedDay = val => {
    //console.log(formatISO(val));
    let bookings = []
    let selectedMaster = []
    let workingHours = []
    let master_id = bookingData.masterId;
    let master_hour_set = []
    //choose default master by least booking in the calendar
    if (bookingData.masterId === "" || bookingData.masterId === undefined || masterBookings === undefined) {
      const sorted_bookingSet = _.map(salon.masterSet, function(item, index) {
        return {
          id: item.id,
          bookingSet: item.bookingSet.filter(booking => (new Date(booking.end)-new Date())>0)
        }
      }).sort(function(a, b){
        return a.bookingSet.length - b.bookingSet.length
      }); 
      bookings = sorted_bookingSet[0].bookingSet;
      master_id = sorted_bookingSet[0].id;
    } else if (salon.masterSet.length === 1) {
      bookings = salon.masterSet[0].bookingSet.filter(booking => (new Date(booking.end)-new Date())>0)
    } else {
      bookings = masterBookings.filter(booking => (new Date(booking.end)-new Date())>0)
    }

    selectedMaster = salon.masterSet.filter(item => item.id === master_id)[0]

    let _val = new Date(val.setMinutes(0,0,0));
    setDen(new Date(_val.setHours(0)));

    // console.log(bookings)
    // console.log(salon.masterSet)
    // console.log(selectedMaster)

    switch (val.getDay()) {
      case 0: 
        workingHours = selectedMaster.sundayHours.map(h => h.substring(0,5))
        break;
      case 1: 
        workingHours = selectedMaster.mondayHours.map(h => h.substring(0,5))
        break;
      case 2: 
        workingHours = selectedMaster.tuesdayHours.map(h => h.substring(0,5))
        break;
      case 3: 
        workingHours = selectedMaster.wednesdayHours.map(h => h.substring(0,5))
        break;
      case 4: 
        workingHours = selectedMaster.thursdayHours.map(h => h.substring(0,5))
        break;
      case 5: 
        workingHours = selectedMaster.fridayHours.map(h => h.substring(0,5))
        break;
      case 6: 
        workingHours = selectedMaster.saturdayHours.map(h => h.substring(0,5))
        break;
      default: workingHours = ["08:00","21:00"]
    }

    const hour_set = ["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30",
                      "06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
                      "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
                      "18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"]
    
    if (workingHours[0] !== workingHours[1]) {
      if ((new Date().getDate() === val.getDate()) && (new Date().getMonth() === val.getMonth())) {
        master_hour_set = hour_set.slice(hour_set.indexOf(`${new Date().getHours()+1}:00`),hour_set.indexOf(workingHours[1])+1)
      } else {
        master_hour_set = hour_set.slice(hour_set.indexOf(workingHours[0]),hour_set.indexOf(workingHours[1])+1)
      }
    } 

    var available_hour_set = master_hour_set.filter(function(slot){
      let i,j
      [i,j] = slot.split(":")
      let k = new Date(_val.setHours(parseInt(i),parseInt(j)));
      let existing_booking = bookings.filter(b => ( (((k-new Date(b.end))<=600000)&&(k>=new Date(b.end)))|| (((new Date(b.start)-k)<=600000)&&(k<=new Date(b.start)))))
      // console.log(existing_booking)
      return existing_booking.length === 0 
    })

    setFreeTime(available_hour_set)

    let available_hours=[];
    let init_hour = 10;
    let hour_arr = {10:true,11:true,12:true,13:true,14:true,15:true,16:true,17:true,18:true,19:true,20:true,21:true}
    for(let i=init_hour; i<22; i++) {
      let k = new Date(_val.setHours(i));
      let existing_booking = bookings.filter(b => ( (((k-new Date(b.end))<=600000)&&(k>=new Date(b.end)))|| (((new Date(b.start)-k)<=600000)&&(k<=new Date(b.start)))))
      //console.log(existing_booking);
      if (existing_booking.length === 0) {
        available_hours.push(i);
        hour_arr[i]=false;
      }
    }
    setBusyTime(hour_arr);
    setBookingData({ ...bookingData, masterId: master_id });
  };

  const handleServiceSelect = (value) => {
    let selectedService = services.filter(service => service.title===value)[0]
    setBookingData({
      ...bookingData, 
      serviceTitle: value,
      servicePrice: selectedService.promotionPrice ? Math.min(selectedService.price,selectedService.promotionPrice) : selectedService.price,
      duration: selectedService.duration
    })
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  function getStepContent(step) {
    
    switch (step) {
      case 0:
        return (
        <div>
          <FormControl margin="normal" required fullWidth>
            <NativeSelect
              value={bookingData.serviceTitle}
              onChange={event => handleServiceSelect(event.target.value)}
              name="service"
              inputProps={{ 'aria-label': 'role' }}
            > 
              {services.map(service => (
              <option key={service.id} value={service.title} duration={service.duration}>
                {t(`${service.title}`)} - {service.promotionPrice ? Math.min(service.price,service.promotionPrice) : service.price} AZN
              </option>
              ))}
            </NativeSelect>
          <FormHelperText>{t("Choose a service")}</FormHelperText>
        </FormControl>
        {salon.createdBy.role === "A_3" && 
        <FormControl margin="normal" required fullWidth>
          <Autocomplete
            id="size-small-standard-multi"
            size="small"
            options={[t("any master"), ...salon.masterSet.map(item => item.masterName)]}
            onChange={(event,value) => {
                      setBookingData({
                        ...bookingData, 
                        masterId: salon.masterSet.filter(item => item.masterName === value).map(item => item.id)[0]
                      })    
                      setMasterbookings(salon.masterSet.filter(item => item.masterName === value).map(item => item.bookingSet)[0])  
            }}
            renderInput={(params) => (
              <TextField {...params} 
              //variant="outlined" 
              label={t("Choose masters")} 
              placeholder={t("More masters")}
            />
            )}
          />
        </FormControl>
        }
      </div>
      )
      case 1:
        return (
          <div>
          <DatePicker
            getSelectedDay={selectedDay}
            labelFormat={"MMMM"}
            color={"#374e8c"}
          />
          <Box
            mt={0}
            justifyContent="center"
            display="flex"
            flexWrap="wrap"
          >
            {/* {_.range(10,22).map(i => {
              return(
                <Button
                  key={i}
                  disabled={busyTime[i]}
                  variant="outlined"
                  className={classes.button}
                  onClick={() => setBookingData({...bookingData, start: formatISO(new Date(den.setHours(i)))})}
                >
                  {`${i}:00`}
                </Button>
              )})
            } */}
            {freeTime.map(slot => {
              return(
                <Button
                  key={slot}
                  variant="outlined"
                  className={classes.button}
                  onClick={() => {
                    let i,j
                    [i,j] = slot.split(":")
                    setBookingData({...bookingData, start: formatISO(new Date(den.setHours(parseInt(i),parseInt(j))))})
                  }}
                >
                  {slot}
                </Button>
              )
            })}
          </Box>
          {(!bookingData.start || (new Date(bookingData.start) == den))?
            (<h4>{t("No time selected")}</h4>) :
            (<h4> {`${t("Time selected")}: ${new Date(bookingData.start).toString().slice(0,21)}`}</h4>)
          }
          </div>
        )
      case 2:
        return (
          <InputMask 
            mask="+\9\9\4 (99) 999 99 99"
            //maskChar=""
            style={{height:"45px", fontSize:"16px", border:"none"}}
            alwaysShowMask
            value={bookingData.customerMobile}
            onChange={(event) => setBookingData({ ...bookingData, customerMobile: event.target.value })}            
          />
        )
      default:
        return 'Unknown step';
    }
  }
 
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical" style={{paddingBottom:"5px"}}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
            </StepContent>
          </Step>
        ))}
        </Stepper>
          <div className={classes.actionsContainer}>
            <div>
              <Button
                onClick={handleCancel}
                className={classes.button}
              >
                <CancelIcon/>
              </Button>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                <ArrowBackIosIcon/>
              </Button> 
              <Button
                //variant="contained"
                disabled={
                  ((activeStep === 1) && (!bookingData.start)) || ((activeStep === 2) && (!Number.isInteger(parseInt(bookingData.customerMobile.slice(-1)))))
                }
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {/* {activeStep === steps.length - 1 ? 'Finish' : 'Next'} */}
                <ArrowForwardIosIcon/>
              </Button>
            </div>
          </div>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer} style={{paddingTop:"5px"}}>
          <Typography>
            {`${t("Appointment")}: ${bookingData.serviceTitle}, ${new Date(bookingData.start).toString().slice(0,21)}.\
            ${t("Total amount is")} ${bookingData.servicePrice} ${t("AZN")}.`}
          </Typography> 
          {!submitting &&
            (<Box
              mt={0}
              justifyContent="center"
              display="flex"
            >
            <Button onClick={handleCancel} className={classes.button}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleConfirm} className={classes.button}>
            {t("Confirm")}
            </Button>
            </Box>)
          }
        </Paper>
      )}
      <Snackbar open={snack.snackOpen} autoHideDuration={3000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snack.snackType}>
          {snack.snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 0,
    marginRight: theme.spacing.unit * 1,
    [theme.breakpoints.up("md")]: {
      width: 500,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  button: {
    //marginTop: theme.spacing(1),
    //marginRight: theme.spacing(1),
    margin: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(1.5),
  },
  resetContainer: {
    padding: theme.spacing(2),
  },
}));