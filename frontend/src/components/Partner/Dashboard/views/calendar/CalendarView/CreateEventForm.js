import React, { useState } from "react";
import { useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { makeStyles } from '@material-ui/core/styles';

import Box from "@material-ui/core/Box";
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { useTranslation } from 'react-i18next';

import InputMask from 'react-input-mask';
import formatISO from 'date-fns/formatISO'
import { DateTimePicker } from '@material-ui/pickers' 
import { KeyboardDateTimePicker } from '@material-ui/pickers'

import DatePicker from "react-datepicker";
import "assets/jss/datepicker/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-GB";



const EventForm = ({
  salon,
  services,
  masterId,
  range,
  handleModalClose
}) => {


  const [locale, setLocale] = useState(localStorage.getItem("i18nextLng"))

  const localeMap = {
    aze: ruLocale,
    en: enLocale,
    ru: ruLocale,
  };

  registerLocale('locale', localeMap[locale])

  const { t } = useTranslation();

  const classes = useStyles()
  const [createBooking, { data: create_data }] = useMutation(CREATE_BOOKING);

  const [bookingData, setBookingData] = useState({
    masterId: masterId || salon.masterSet[0].id,
    customerName: '', 
    customerMobile: '',
    serviceTitle: '',
    servicePrice: 30,
    duration: range.duration,
    start: range.start ? new Date(range.start) : new Date(), // new Date need for material-ui/pickers as range.start is in ISO format
    isConfirmed: true
  })

  //const textFieldStyle = { minHeight: "5rem" };

  const handleServiceSelect = (value) => {
    let selectedService = services.filter(service => service.title===value)[0]
    setBookingData({
      ...bookingData, 
      serviceTitle: value,
      servicePrice: selectedService.promotionPrice ? Math.min(selectedService.price,selectedService.promotionPrice) : selectedService.price,
      duration: selectedService.duration
    })
  }

  const handleCancel = () => {
    handleModalClose(false);
    setBookingData({
      ...bookingData,
      masterId: masterId,
      customerName: '', 
      customerMobile: '',
      serviceTitle: '',
      servicePrice: 30,
      duration: 30,
      start: ''
      })
  };

  const handleSubmit = () => {
    createBooking({variables: { bookingData: bookingData }}).catch(err => {
      console.error(err);
    });
    handleModalClose(false)
  };

  const add_minutes = (dt, minutes) =>{
    // return new Date(new Date(dt).getTime() + minutes*60000)
    return new Date(dt.getTime() + minutes*60000) //needed for react datetime pickers
  }
  
  return(
    <div>
      <Paper className={classes.paper}>
          <h3>{t("Add event")}</h3>  
          <form className={classes.form} onSubmit={handleSubmit}>
           <FormControl fullWidth required className={classes.field}>
              <Autocomplete
                id="size-small-standard-multi"
                size="small"
                disableClearable
                options={salon.masterSet.map(item => item.masterName)}
                defaultValue={salon.masterSet.filter(item => item.id == bookingData.masterId)[0].masterName}
                onChange={(event,value) => {
                          setBookingData({
                            ...bookingData, 
                            masterId: salon.masterSet.filter(item => item.masterName === value)[0].id
                          })                      
                }}
                renderInput={(params) => (
                  <TextField {...params} 
                  variant="outlined" 
                  label={t("Select master")} 
                />
                )}
              />
            </FormControl>
            <FormControl margin="normal" variant="outlined" required fullWidth>
              <Autocomplete
                id="size-small-clearOnEsc"
                disableClearable
                size="small"
                getOptionLabel={option => t(`${option}`)}
                options={ [...new Set(services.map(service => service.title))] }
                onChange={(event,value) => handleServiceSelect(value)}
                renderInput={(params) => (
                  <TextField {...params} 
                  variant="outlined"  
                  label={t("Select service")} 
                  />
                  )}
              />
            </FormControl>
            <FormControl fullWidth className={classes.field}>
              <TextField
                label={t("Name*")}
                size="small"
                placeholder={t("Customer name")}
                onChange={(event) => setBookingData({ ...bookingData, customerName:event.target.value })}
                value={bookingData.customerName}
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth className={classes.field}>
              <label>{t("Mobile number")}</label>
              <InputMask 
                mask="+\9\9\4 (99) 999 99 99"
                //maskChar=""
                style={{height:"39px", fontSize:"15px"}}
                alwaysShowMask
                value={bookingData.customerMobile}
                onChange={(event) => setBookingData({ ...bookingData, customerMobile: event.target.value })}            
              />
            </FormControl>
            <FormControl fullWidth className={classes.field}>
                <label>{t("Start time")}</label>
                <DatePicker
                  selected={bookingData.start}
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="MMMM d, yyyy, HH:mm"
                  // minTime={new Date(bookingData.start.setHours(parseInt(salon.open.slice(0,2))))}
                  // maxTime={new Date(new Date().setHours(22))}
                  withPortal
                  fullWidth
                  locale="locale"
                  onChange={(val) => setBookingData({...bookingData, start: val})}
                  //popperClassName="some-custom-class"
                  popperPlacement="top-end"
                  popperModifiers={{
                    offset: {
                      enabled: true,
                      offset: "5px, 10px"
                    },
                    preventOverflow: {
                      enabled: true,
                      escapeWithReference: false,
                      boundariesElement: "viewport"
                    }
                  }}
                />
              {/* <KeyboardDateTimePicker
                //id="datetime-local"
                ampm={false}
                label={t("Start time")}
                value={bookingData.start} 
                onChange={(val) => console.log(val)}
                //onChange={(val) => setBookingData({...bookingData, start: val})}
                //disablePast
                format="dd/MM/yyyy HH:mm"
                minutesStep={5}
              />  */}
            </FormControl>
            <FormControl fullWidth className={classes.field}>
              <label>{t("End time")}</label>
              <DatePicker
                selected={add_minutes(bookingData.start,bookingData.duration)}  
                showTimeSelect      
                timeIntervals={15}
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy, HH:mm"
                withPortal
                fullWidth
                locale="locale"
                onChange={(val) => setBookingData({
                  ...bookingData, 
                  duration: Math.floor((val - bookingData.start)/60000) })
                }                //popperClassName="some-custom-class"
                popperPlacement="top-end"
                popperModifiers={{
                  offset: {
                    enabled: true,
                    offset: "5px, 10px"
                  },
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                    boundariesElement: "viewport"
                  }
                }}
              />
              {/* <KeyboardDateTimePicker
                //id="datetime-local"
                ampm={false}
                label={t("End time")}
                value={add_minutes(bookingData.start,bookingData.duration)}  
                onChange={(val) => setBookingData({
                  ...bookingData, 
                  duration: Math.floor((val - bookingData.start)/60000) })
                }
                //disablePast
                format="dd/MM/yyyy HH:mm"
                minutesStep={5}
              />  */}
            </FormControl>
          <Box
              mt={0}
              justifyContent="center"
              display="flex"
            >
            <Button onClick={handleCancel} className={classes.button}>
              {t("Cancel")}
            </Button>
            <Button 
              disabled={ bookingData.start.length === 0 }
              type="submit" 
              className={classes.button}>
              {t("Confirm")}
            </Button>
            </Box>
        </form>
      </Paper>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: 0,
    marginRight: 0,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit ,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit*2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  // button: {
  //   marginTop: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  //   margin: theme.spacing(5),
  // },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth:"700px",
    marginLeft:"auto",
    marginRight:"auto",
    alignItems:"center"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    //margin: theme.spacing.unit * 2
    margin: "0px"
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  field: {
    marginTop: "8px"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));


export const CREATE_BOOKING = gql `
  mutation ($bookingData: BookingInput!) {
    createBooking(bookingData: $bookingData) {
      booking {
        id
        master {
          id
          masterName
          masterEmail
          masterPhone
          salon {
            id
            name
          }
        }
        customer {
          id
          username
        }
        serviceTitle
        start
        isConfirmed
      }
    }
  }
`;

export const UPDATE_BOOKING = gql `
  mutation ($bookingId: Int!, $bookingData: BookingInput!) {
    updateBooking(
      bookingId: $bookingId,
      bookingData: $bookingData
    ) {
      booking {
        id
        master {
          id
          masterName
          masterEmail
          masterPhone
          salon {
            id
            name
          }
        }
        customer {
          id
          username
        }
      }
    }
  }
`;

export const DELETE_BOOKING = gql `
  mutation ($bookingId: Int!) {
    deleteBooking (bookingId: $bookingId)
     {
      booking {
        master {
          id
          masterName
          masterEmail
          masterPhone
          salon {
            id
            name
          }
        }
        customer {
          id
          username
        }
      }
    }
  }
`;


export default EventForm;