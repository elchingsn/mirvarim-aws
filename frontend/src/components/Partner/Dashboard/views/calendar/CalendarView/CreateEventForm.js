import React, { useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { makeStyles } from '@material-ui/core/styles';

import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from '@material-ui/core/Checkbox';

import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import Error from "components/Shared/Error"; 
import Loading from "components/Shared/Loading";
import { useHistory } from 'react-router-dom';

import InputMask from 'react-input-mask';
import formatISO from 'date-fns/formatISO'

const EventForm = ({
  salon,
  services,
  masterId,
  range,
  handleModalClose
}) => {
  const { t, i18n } = useTranslation();

  const classes = useStyles()
  const [createBooking, { data: create_data }] = useMutation(CREATE_BOOKING);
  const [updateBooking, { data: update_data }] = useMutation(UPDATE_BOOKING);
  const [deleteBooking, { data: delete_data }] = useMutation(DELETE_BOOKING);

  const [bookingData, setBookingData] = useState({
    masterId: masterId || salon.masterSet[0].id,
    customerName: '', 
    customerMobile: '',
    serviceTitle: '',
    servicePrice: 30,
    duration: range.duration,
    start: range.start
  })

  console.log('bookingdata', bookingData)
  //const textFieldStyle = { minHeight: "5rem" };

  const handleServiceSelect = (value) => {
    let selectedService = services.filter(service => service.title==value)[0]
    console.log(selectedService)
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
    return new Date(new Date(dt).getTime() + minutes*60000)
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
                            masterId: salon.masterSet.filter(item => item.masterName == value)[0].id
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
                value={bookingData.start}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
  button: {
    //marginTop: theme.spacing(1),
    //marginRight: theme.spacing(1),
    margin: theme.spacing(1),
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
  textField: {
    margin: theme.spacing.unit
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
    createBooking(
      bookingData: $bookingData
    ) {
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
        serviceTitle
        start
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