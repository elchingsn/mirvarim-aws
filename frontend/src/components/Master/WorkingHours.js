// noValidate in the form ignores required html input fields in the form
import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { useMutation } from '@apollo/react-hooks';
//import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import gql from "graphql-tag";
import { useTranslation } from 'react-i18next';

import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
//import Button from "components/Partials/Button"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { UserContext } from "App.js"
import {ME_QUERY} from "App.js"

import Error from "../Shared/Error"; 
//import Loading from "../Shared/Loading";
import InputMask from 'react-input-mask';


//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const UpdateMaster = ({classes}) => {
    //query the salon data updated by the current user
  const { t } = useTranslation();
  const currentUser = useContext(UserContext);
  if (!currentUser.salonSet[0]) {
    return <div className={classes.paddingTLR}> {t("No salon added. Please add a salon")}</div>
  } else if (!currentUser.salonSet[0].masterSet[0]) {
    return <div className={classes.paddingTLR}> {t("No master added. Please add a master")}</div>
  } else {
    return <SelectMaster classes={classes} currentUser={currentUser} />
  }
}

const SelectMaster = ({classes, currentUser}) => {
  const { t } = useTranslation();
  const [selectedMaster, setSelectedMaster] = useState({});
  //const history = useHistory();

  var isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)|(Lumia)/i
  );

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <FormControl fullWidth className={classes.field}>
            <h3> {t("Select master")} </h3>
            <Autocomplete
              id="size-small-clearOnEsc"
              disableClearable
              size="small"
              options={currentUser.salonSet[0].masterSet.map(item => item.masterName).flat(1)}
              onChange={(event,value) => {
                        setSelectedMaster(currentUser.salonSet[0].masterSet.filter(item => item.masterName === value)[0]);
              }}
              renderInput={(params) => (
                <TextField {...params} 
                //inputProps={{style: {textTransform: 'capitalize'}}} 
                variant="outlined" 
                label={t("Select master")} 
                placeholder={t("Select master")}
                />
              )}
            />
          </FormControl> 
          {selectedMaster.id &&   
          <UpdateMasterForm 
            classes={classes} 
            currentUser={currentUser} 
            selectedMaster={selectedMaster} 
          />  
          }
          </Paper>
      </div>
    );
}

const UpdateMasterForm = ({classes, currentUser, selectedMaster }) => {
  const userId = currentUser.id;
  //const salonId = currentUser.salonSet[0].id;
  const history = useHistory();
  const { t } = useTranslation();

  const [masterData, setMasterData] = useState({
    name: '',
    email: '',
    phone: '',
    isStaff: false,
    status: ''
  })

  useEffect(() => {
      setMasterData({
        ...masterData,
        name: selectedMaster.masterName,
        email: selectedMaster.masterEmail,
        phone: selectedMaster.masterPhone,
        isStaff: selectedMaster.isStaff,
        status: selectedMaster.staffStatus
      })
  }, [selectedMaster]);

  const [workingHours, setWorkingHours] = useState({
    monday: selectedMaster.mondayHours.map(h => h.substring(0,5)),
    tuesday: selectedMaster.tuesdayHours.map(h => h.substring(0,5)),
    wednesday: selectedMaster.wednesdayHours.map(h => h.substring(0,5)),
    thursday: selectedMaster.thursdayHours.map(h => h.substring(0,5)),
    friday: selectedMaster.fridayHours.map(h => h.substring(0,5)),
    saturday: selectedMaster.saturdayHours.map(h => h.substring(0,5)),
    sunday: selectedMaster.sundayHours.map(h => h.substring(0,5))
  })

  const [snack, setSnack] = useState({
    snackOpen: false,
    snackType: "",
    snackMessage: ""
  })

  console.log(workingHours)
  const [submitting, setSubmitting] = useState(false);

  const hour_set = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
                    "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30",
                    "20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30",
                    "02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30"]

  // const handleUpdateCache = (cache, { data: { updateTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(updateTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  const handleSubmit = async (event, masterWorkingHours) => {
    event.preventDefault();
    setSubmitting(true);
    
    masterWorkingHours({variables: {
                        workingHours: workingHours, masterId: selectedMaster.id}}).catch(err => {
                          console.error(err);
                          history.push('/partner');
                        });
  };

  const handleSnackClose = () => {
    setSubmitting(false);
    setSnack ({ ...snack,snackOpen: false })
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return(
    <div className={classes.container}>
        <Mutation
          mutation={UPDATE_MASTER_WORKING_HOURS}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Confirmed")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:currentUser.id} }]}
          >
          {(masterWorkingHours, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <form onSubmit={event => handleSubmit(event, masterWorkingHours)} style={{marginBottom: "0"}}>
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Monday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.monday[0] === workingHours.monday[1]}
                      defaultValue={workingHours.monday[0]}
                      value={workingHours.monday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, monday:[event.target.value, workingHours.monday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.monday[0] === workingHours.monday[1]}
                        defaultValue={workingHours.monday[1]}
                        value={workingHours.monday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, monday:[workingHours.monday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, monday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, monday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>   
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Tuesday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.tuesday[0] === workingHours.tuesday[1]}
                      defaultValue={workingHours.tuesday[0]}
                      value={workingHours.tuesday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, tuesday:[event.target.value, workingHours.tuesday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.tuesday[0] === workingHours.tuesday[1]}
                        defaultValue={workingHours.tuesday[1]}
                        value={workingHours.tuesday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, tuesday:[workingHours.tuesday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, tuesday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, tuesday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>   
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Wednesday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.wednesday[0] === workingHours.wednesday[1]}
                      defaultValue={workingHours.wednesday[0]}
                      value={workingHours.wednesday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, wednesday:[event.target.value, workingHours.wednesday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.wednesday[0] === workingHours.wednesday[1]}
                        defaultValue={workingHours.wednesday[1]}
                        value={workingHours.wednesday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, wednesday:[workingHours.wednesday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, wednesday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, wednesday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>   
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Thursday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.thursday[0] === workingHours.thursday[1]}
                      defaultValue={workingHours.thursday[0]}
                      value={workingHours.thursday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, thursday:[event.target.value, workingHours.thursday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.thursday[0] === workingHours.thursday[1]}
                        defaultValue={workingHours.thursday[1]}
                        value={workingHours.thursday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, thursday:[workingHours.thursday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, thursday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, thursday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>   
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Friday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.friday[0] === workingHours.friday[1]}
                      defaultValue={workingHours.friday[0]}
                      value={workingHours.friday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, friday:[event.target.value, workingHours.friday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.friday[0] === workingHours.friday[1]}
                        defaultValue={workingHours.friday[1]}
                        value={workingHours.friday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, friday:[workingHours.friday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, friday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, friday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>   
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Saturday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.saturday[0] === workingHours.saturday[1]}
                      defaultValue={workingHours.saturday[0]}
                      value={workingHours.saturday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, saturday:[event.target.value, workingHours.saturday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.saturday[0] === workingHours.saturday[1]}
                        defaultValue={workingHours.saturday[1]}
                        value={workingHours.saturday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, saturday:[workingHours.saturday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, saturday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, saturday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>                                                                      
              <GridContainer>
                <GridItem xs={12} sm={3} className={classes.paddingTLR}>
                  <h2>{t("Sunday")}</h2>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                <InputLabel>{t("Opening")}</InputLabel>
                <FormControl>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex" 
                  >
                    <AccessTimeIcon style={{paddingRight:"5px"}}/>
                    <Box flexGrow={1} /> 
                    <Select
                      //variant="outlined"
                      disabled={workingHours.sunday[0] === workingHours.sunday[1]}
                      defaultValue={workingHours.sunday[0]}
                      value={workingHours.sunday[0]}
                      onChange={ (event) => setWorkingHours({...workingHours, sunday:[event.target.value, workingHours.sunday[1]]}) }
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {hour_set.map(ts => (
                        <MenuItem key={ts} value={ts}>
                          {ts}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </FormControl>
                </GridItem>
                <GridItem xs={3} sm={3} className={classes.paddingTLR}>
                  <InputLabel>{t("Closing")}</InputLabel>
                  <FormControl>
                    <Box
                      mt={1}
                      justifyContent="center"
                      display="flex" 
                    >
                      <AccessTimeIcon style={{paddingRight:"5px"}}/>
                      <Box flexGrow={1} /> 
                      <Select
                        //variant="outlined"
                        disabled={workingHours.sunday[0] === workingHours.sunday[1]}
                        defaultValue={workingHours.sunday[1]}
                        value={workingHours.sunday[1]}
                        onChange={ (event) => setWorkingHours({...workingHours, sunday:[workingHours.sunday[0],event.target.value]}) }
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        {hour_set.map(ts => (
                          <MenuItem key={ts} value={ts}>
                            {ts}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={3} className={classes.paddingTLR}>
                  <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button
                    variant="outlined"
                    onClick={ () => setWorkingHours({...workingHours, sunday:["08:00","22:00"]}) }
                    className={classes.save}   
                  >
                    <AddIcon/>
                  </Button>
                  <Button 
                      variant="outlined"
                      onClick={ () => setWorkingHours({...workingHours, sunday:["08:00","08:00"]}) }
                      className={classes.cancel}
                    >
                      <ClearIcon/>
                  </Button>
                </Box>
                </GridItem>
              </GridContainer>   
              <Box
                mt={2}
                justifyContent="flex-end"
                display="flex"
              >
                <Button 
                  variant="outlined"
                  type="submit"
                  disabled={submitting}
                  className={classes.save}
                >
                  {t("Save")}
                </Button>      
              </Box>     
              </form>
            );
          }}
          </Mutation>
          <Snackbar open={snack.snackOpen} autoHideDuration={1000} onClose={handleSnackClose}>
            <Alert onClose={() => setSubmitting(false)} severity={snack.snackType}>
              {snack.snackMessage}
            </Alert>
          </Snackbar>
      </div>
)}

const UPDATE_MASTER_WORKING_HOURS = gql`
  mutation($workingHours:WorkingHourInput!,$masterId:Int!) {
    masterWorkingHours(workingHours: $workingHours, masterId: $masterId) {
      master {
        id
        masterName
        masterEmail
        masterPhone
      }
    }
  }
`;

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth:"600px",
    marginLeft:"auto",
    marginRight:"auto",
    alignItems:"center"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    width:"100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit
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
  capitalize: {
    textTransform: "capitalize"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  },
  paddingTLR: {
    paddingTop: "10px",
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  menuPaper: {
    maxHeight: "250px"
  }
});


export default withStyles(styles)(UpdateMaster);