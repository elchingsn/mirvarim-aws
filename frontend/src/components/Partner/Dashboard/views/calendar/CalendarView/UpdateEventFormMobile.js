import React, { useState } from "react";
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';

import Box from "@material-ui/core/Box";
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { useTranslation } from 'react-i18next';

import InputMask from 'react-input-mask';
import formatISO from 'date-fns/formatISO'

import { UPDATE_BOOKING, DELETE_BOOKING } from "components/Partner/Dashboard/views/calendar/CalendarView/CreateEventForm.js"

const EventForm = ({
  salon,
  services,
  handleUpdateModalClose,
  event
}) => {
  const { t } = useTranslation();
  const classes = useStyles()
  const [updateBooking, { data: update_data }] = useMutation(UPDATE_BOOKING);
  const [deleteBooking, { data: delete_data }] = useMutation(DELETE_BOOKING);

  const [bookingData, setBookingData] = useState({
    customerName: event.title,
    customerMobile: event.extendedProps.mobile,
    serviceTitle: event.extendedProps.service,
    servicePrice: event.extendedProps.price,
    duration: Math.floor((new Date(event.end) - new Date(event.start))/60000),
    start: formatISO(new Date(event.start)),
    isConfirmed: event.extendedProps.isConfirmed
  })

  //console.log('bookingdata', bookingData)
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
    handleUpdateModalClose(false);
    setBookingData({
      ...bookingData,
      customerName: '', 
      customerMobile: '',
      serviceTitle: '',
      servicePrice: 30,
      duration: 30,
      start: ''
      })
  };

  const handleSubmit =  () => {
    updateBooking({variables: { bookingData: {...bookingData, isConfirmed:true}, bookingId: event.extendedProps.bookingId }}).catch(err => {
      console.error(err);
    });
    handleUpdateModalClose(false)
  };

  const handleDelete =  () => {
    deleteBooking({variables: { bookingId: event.extendedProps.bookingId }}).catch(err => {
      console.error(err);
    });
    handleUpdateModalClose(false)
  };

  const add_minutes = (dt, minutes) =>{
    return new Date(new Date(dt).getTime() + minutes*60000)
  }
  
  return(
    <div>
      <Paper className={classes.paper}>
          <h3>{t("Change event")}</h3>  
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl margin="normal" variant="outlined" required fullWidth>
              <Autocomplete
                id="size-small-clearOnEsc"
                disableClearable
                size="small"
                value={bookingData.serviceTitle}
                disabled={true}
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
                label={t("Name")}
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
                style={{height:"45px", fontSize:"16px"}}
                alwaysShowMask
                value={bookingData.customerMobile}
                onChange={(event) => setBookingData({ ...bookingData, customerMobile: event.target.value })}            
              />
            </FormControl>
            <FormControl fullWidth className={classes.field}>
              <TextField
                id="datetime-local"
                label={t("Start time")}
                type="datetime-local"
                value={bookingData.start.slice(0,16)}
                onChange={(e) => setBookingData({...bookingData, start: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <FormControl fullWidth className={classes.field}>
              <TextField
                id="datetime-local"
                label={t("End time")}
                type="datetime-local"
                value={
                  bookingData.start.length>0 ?
                  formatISO(add_minutes(bookingData.start,bookingData.duration)).slice(0,16) : ''
                }
                onChange={(e) => setBookingData({
                  ...bookingData, 
                  duration: Math.floor((new Date(e.target.value) - new Date(bookingData.start))/60000) })
                }
                inputProps={{ min: `${bookingData.start.slice(0,16)}` }}
                InputProps={{ classes: classes }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <Box
                mt={1}
                justifyContent="center"
                display="flex"
              >
              <Button onClick={handleDelete} className={classes.button}>
                <DeleteOutlineIcon/>
              </Button>
              <Box flexGrow={1} />
              <Button onClick={handleCancel} className={classes.button}>
                {t("Cancel")}
              </Button>
              <Button 
                disabled={ bookingData.start.length === 0 || bookingData.duration<=0 }
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
  input: {
    "&:valid": {
      backgroundColor: "inherit"
    },
    "&:invalid": {
      backgroundColor: "red"
    }
  }
}));

export default EventForm;