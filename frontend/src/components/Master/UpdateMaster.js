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
//import Button from "components/Partials/Button"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Checkbox from '@material-ui/core/Checkbox';

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
  const [open, setOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState({});
  const history = useHistory();

  var isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)|(Lumia)/i
  );

  //for update master hook was not used. Ideally both update and delete should use hook.
  const [deleteMaster, { data: delete_data }] = useMutation(DELETE_MASTER_MUTATION, {
    onCompleted({ deleteMaster }) {
      history.push(`/partner/${currentUser.id}/salon/view`);
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:currentUser.id} }],
    awaitRefetchQueries: true,
  });

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        {!selectedMaster.id &&
          (<FormControl fullWidth className={classes.field}>
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
          </FormControl> )}
          {selectedMaster.id &&   
          <UpdateMasterForm 
            classes={classes} 
            currentUser={currentUser} 
            selectedMaster={selectedMaster} 
            setOpen={setOpen} 
            deleteMutation={deleteMaster}
          />  
          }
          </Paper>
        <Dialog
            open={open}
            disableBackdropClick={true}
            TransitionComponent={Transition}
            fullScreen={!!isMobile}
            >
              <DialogTitle>
                {t("Master successfully updated!")}
              </DialogTitle>
              <DialogActions>
                <Button
                  color="secondary"
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

const UpdateMasterForm = ({classes, currentUser, selectedMaster, setOpen, deleteMutation }) => {
  const userId = currentUser.id;
  //const salonId = currentUser.salonSet[0].id;
  const history = useHistory();
  const { t } = useTranslation();

  const [masterData, setMasterData] = useState({})
  
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

  console.log(masterData)

  //const [disabled, setDisabled] = useState(true)
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const masterStatusMap = {
    "pending": "confirmation request sent",
    "confirmed": "master has confirmed the request", 
    "rejected": "master has rejected the request",
    "": "no master account created"
  }

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
                  history.push('/partner');
                });
  };

  return(
    <div className={classes.container}>
      <Paper className={classes.pape}>
        <Mutation
          mutation={UPDATE_MASTER_MUTATION}
          onCompleted={data => {
          //console.log({ data });
          setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:currentUser.id} }]}
          >
          {(updateMaster, { loading, error }) => {
          if (error) return <Error error={error} />;
          console.log(masterData.isStaff)
            return(
              <form onSubmit={event => handleSubmit(event, updateMaster)} style={{marginBottom: "0"}}>
                <FormControl fullWidth className={classes.field}>
                  <TextField
                  label="Name*"
                  placeholder={t("Add name")}
                  onChange={(event) => setMasterData({ ...masterData, name:event.target.value })}
                  value={masterData.name}
                  variant="outlined"
                  disabled={submitting}
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
                  disabled={submitting}
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
                    disabled={submitting}
                  />
              </FormControl>
              <h5> {t("Do you want to give an access to the master? Please, make sure user account with this email exists")} </h5>
              <Checkbox
                  checked={masterData.isStaff === undefined ? selectedMaster.isStaff : masterData.isStaff }
                  color="primary"
                  onChange={() => {
                    setMasterData({ ...masterData, isStaff: !masterData.isStaff })
                  }}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <div style={{color: "purple"}}>
                &nbsp;
                {masterStatusMap[masterData.status]}
              </div>
              {/* {disabled ? 
                  (<Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                    <Button
                      //disabled={submitting}
                      variant="outlined"
                      onClick={() => 
                        deleteMutation({variables: { masterId: parseInt(selectedMaster.id) }}).catch(err => {
                          console.error(err);
                          history.push('/login');
                        })
                      }
                      className={classes.cancel}
                    >
                      {t("Delete")}
                    </Button>
                    <Button
                      disabled={submitting}
                      variant="outlined"
                      onClick={() => setDisabled(false)}
                      className={classes.save}
                    >
                      {t("Update")}
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
                        {t("Cancel")}
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
                }          */}
                <Box
                    mt={1}
                    justifyContent="center"
                    display="flex"
                  >
                  <Button 
                    disabled={submitting}
                    variant="outlined"
                    onClick={() => setConfirmOpen(true)}
                    className={classes.cancel}
                  >
                    <DeleteOutlineIcon/>
                  </Button>
                  <Box flexGrow={1} />
                  <Link to={`/partner/${userId}/salon/view`}>
                    <Button
                      disabled={submitting}
                      variant="outlined"
                      className={classes.cancel}
                    >
                      {t("Cancel")}
                    </Button>
                  </Link>
                  <Button 
                      variant="outlined"
                      disabled={masterData.name ?
                        (submitting ||
                        !masterData.name.trim()) 
                        : true
                      }
                      type="submit"
                      className={classes.save}
                    >
                      {submitting ? (
                        <CircularProgress className={classes.save} size={24} />
                      ) : (
                        `${t("Update")}`
                      )}
                  </Button>
                </Box>
              </form>
            );
          }}
          </Mutation>
        </Paper>
        <Dialog
          open={confirmOpen}
          disableBackdropClick={true}
          TransitionComponent={Transition}
          //fullScreen={!!isMobile}
          >
            <DialogTitle>
              {t("Are you sure you want to delete the master?")}
            </DialogTitle>
            <DialogActions>
              <Button
                //color="secondary"
                variant="contained"
                onClick={() => {
                  setConfirmOpen(false);
                }}
              >
                No
              </Button>
              <Button
                //color="secondary"
                variant="contained"
                onClick={() => 
                  deleteMutation({variables: { masterId: parseInt(selectedMaster.id) }}).catch(err => {
                    console.error(err);
                    history.push('/partner');
                  })
                }
              >
                Yes
              </Button>
            </DialogActions>
        </Dialog>
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

const DELETE_MASTER_MUTATION = gql`
mutation($masterId:Int!) {
  deleteMaster(masterId: $masterId) {
    master {
      masterName
      masterEmail
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
  }
});


export default withStyles(styles)(UpdateMaster);