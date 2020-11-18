// noValidate in the form ignores required html input fields in the form
import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import gql from "graphql-tag";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';

import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
//import Button from "components/Partials/Button"
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
import { UserContext } from "App.js"
import {ME_QUERY} from "App.js"

import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";
import InputMask from 'react-input-mask';

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const UpdateMaster = ({classes}) => {
    //query the salon data updated by the current user
  const { t, i18n } = useTranslation();
  const currentUser = useContext(UserContext);
  if (!currentUser.salonSet[0]) {
      return <div> {t("No salon added. Please add a salon")} </div>
  } else if (!currentUser.salonSet[0].masterSet[0]) {
    return <div> {t("No master added. Please add a master")} </div>
  } else {
    return <SelectMaster classes={classes} currentUser={currentUser} />
  }
}

const SelectMaster = ({classes, currentUser}) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState({});
  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
          <h3> {t("Select master")} </h3>
              <FormControl fullWidth className={classes.field}>
                <Autocomplete
                  id="size-small-clearOnEsc"
                  disableClearable
                  size="small"
                  options={currentUser.salonSet[0].masterSet.map(item => item.masterName).flat(1)}
                  onChange={(event,value) => {
                            setSelectedMaster(currentUser.salonSet[0].masterSet.filter(item => item.masterName == value)[0]);
                            console.log('selected cat', value[0])
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
              <UpdateMasterForm classes={classes} currentUser={currentUser} selectedMaster={selectedMaster} setOpen={setOpen} />  
            </Paper>
            <Dialog
                open={open}
                disableBackdropClick={true}
                TransitionComponent={Transition}
                >
                  <DialogTitle>
                    {t("Master successfully updated!")}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <Link to={`/partner/${currentUser.id}/salon/view`}>
                        {t("Back to salon page")}
                      </Link>
                    </Button>
                  </DialogActions>
              </Dialog>
          </div>
    );
}

const UpdateMasterForm = ({classes, currentUser, selectedMaster, setOpen }) => {
  const userId = currentUser.id;
  const salonId = currentUser.salonSet[0].id;
  console.log('selected master', selectedMaster);
  const history = useHistory();

  const [masterData, setMasterData] = useState({})
  
  useEffect(() => {
      console.log('over here')
      setMasterData({
        ...masterData,
        name: selectedMaster.masterName,
        email: selectedMaster.masterEmail,
        phone: selectedMaster.masterPhone
      })
    
  }, [selectedMaster]);

  console.log('master data', masterData)
  const [disabled, setDisabled] = useState(true)
  const [submitting, setSubmitting] = useState(false);

  // const handleUpdateCache = (cache, { data: { updateTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(updateTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  const handleSubmit = async (event, updateMaster) => {
    event.preventDefault();
    setSubmitting(true);
    
    updateMaster({variables: {
                 masterData: masterData, masterId: selectedMaster.id}}).catch(err => {
                  console.error(err);
                  history.push('/login');
                });
  };

  return(
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <Mutation
          mutation={UPDATE_MASTER_MUTATION}
          onCompleted={data => {
          console.log({ data });
          setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:currentUser.id} }]}
          >
          {(updateMaster, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <form onSubmit={event => handleSubmit(event, updateMaster)} >
                <FormControl fullWidth className={classes.field}>
                  <TextField
                  label="Name"
                  placeholder="Add name"
                  onChange={(event) => setMasterData({ ...masterData, name:event.target.value })}
                  value={masterData.name}
                  variant="outlined"
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }} 
                  />
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <TextField
                  label="Description"
                  placeholder="Add email"
                  onChange={(event) => setMasterData({ ...masterData, email:event.target.value })}
                  value={masterData.email}
                  variant="outlined"
                  disabled={disabled}
                  InputLabelProps={{ shrink: true }} 
                  />
                </FormControl>   
                <FormControl fullWidth className={classes.field}>
                  <InputMask 
                    mask="+\9\9\4 (99) 999 99 99"
                    //maskChar=""
                    style={{height:"50px", fontSize:"16px" }}
                    alwaysShowMask
                    value={masterData.phone}
                    onChange={(event) => setMasterData({ ...masterData, phone:event.target.value })}
                    disabled={disabled}
                  />
              </FormControl>
              {disabled ? 
                  (<Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                    <Button
                      disabled={submitting}
                      variant="outlined"
                      onClick={() => setDisabled(false)}
                      className={classes.save}
                    >
                      Update
                    </Button>
                  </Box>)
                : (<Box
                      mt={1}
                      justifyContent="center"
                      display="flex"
                    >
                    <Link to={`/partner/${userId}/salon/view`}>
                      <Button
                        disabled={submitting}
                        variant="outlined"
                        className={classes.cancel}
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      disabled={
                        submitting ||
                        !masterData.name.trim() 
                      }
                      type="submit"
                      className={classes.save}
                    >
                      {submitting ? (
                        <CircularProgress className={classes.save} size={24} />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Box>)                  
                }         
              </form>
            );
          }}
          </Mutation>
        </Paper>
      </div>
)}

const UPDATE_MASTER_MUTATION = gql`
  mutation($masterData:MasterInput!,$masterId:Int!) {
    updateMaster(masterData: $masterData, masterId: $masterId) {
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
    maxWidth:"700px",
    marginLeft:"auto",
    marginRight:"auto",
    alignItems:"center"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
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
  }
});


export default withStyles(styles)(UpdateMaster);