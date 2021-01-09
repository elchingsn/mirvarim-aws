import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import gql from "graphql-tag";
import { makeStyles } from '@material-ui/core/styles';

import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from '@material-ui/core/Checkbox';

import { UserContext } from "App.js"
import { useTranslation } from 'react-i18next';
//import NumberFormat from 'react-number-format';
import Error from "../Shared/Error"; 
//import Loading from "../Shared/Loading";
import { useHistory } from 'react-router-dom';
import {ME_QUERY} from "App.js"
import InputMask from 'react-input-mask';

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


const MasterForm = ({ data_salon, setOpen, userId }) => {
  const classes = formStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const [submitting, setSubmitting] = useState(false);

  const [masterData, setMasterData] = useState({
    salonId: data_salon.id,
    name: '',
    email: '',
    phone: '',
    isStaff: false
  })

  //console.log(masterData);

  const handleSubmit = async (event, addMaster) => {
    event.preventDefault();
    setSubmitting(true);
    
    addMaster({variables: { masterData: masterData }}).catch(err => {
      console.error(err);
      history.push('/partner');
    });
  };

  return(
    <Mutation
      mutation={ADD_MASTER_MUTATION}
      onCompleted={data => {
      setSubmitting(false);
      setOpen(true);
      }}
      // update={handleUpdateCache}
      refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
    >
    {(addMaster, { loading, error }) => {
    if (error) return <Error error={error} />;
      return(
        <form onSubmit={event => handleSubmit(event, addMaster)}>
          <FormControl fullWidth className={classes.field}>
            <TextField
            label={t("Name*")}
            placeholder={t("Add name")}
            onChange={(event) => setMasterData({ ...masterData, name:event.target.value })}
            value={masterData.name}
            variant="outlined"  
            //helperText={!masterData.name.trim()? t("required field") : ""}   
            error={!masterData.name.trim()}       
            />
          </FormControl>
          <FormControl fullWidth className={classes.field}>
            <TextField
            label={t("Email")}
            placeholder={t("Add email")}
            onChange={(event) => setMasterData({ ...masterData, email:event.target.value })}
            value={masterData.email}
            variant="outlined"
            />
          </FormControl>
          {/* <FormControl fullWidth className={classes.field}>
            <TextField
            label="Description"
            placeholder="Add phone"
            onChange={(event) => setMasterData({ ...masterData, phone:event.target.value })}
            value={masterData.description}
            variant="outlined"
            />
          </FormControl> */}
          <FormControl fullWidth className={classes.field}>
            <InputMask 
              mask="+\9\9\4 (99) 999 99 99"
              //maskChar=""
              style={{height:"50px", fontSize:"16px" }}
              alwaysShowMask
              value={masterData.phone}
              onChange={(event) => setMasterData({ ...masterData, phone:event.target.value })}
            />
         </FormControl>
         <h5> {t("Do you want to give an access to the master? Please, make sure user account with this email exists")} </h5>
        <Checkbox
            checked={masterData.isStaff}
            color="primary"
            onChange={() => {
              setMasterData({ ...masterData, isStaff: !masterData.isStaff })
            }}
            inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <Box
          mt={1}
          justifyContent="center"
          display="flex"
        >
          <Button
            disabled={submitting}
            variant="outlined"
            onClick={() => setMasterData({ ...masterData, name: "", email: "", prone: "" })}
            className={classes.cancel}
          >
            {t("Cancel")}
          </Button>
          {/* <Box flexGrow={1} /> */}
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
              `${t("Add Master")}`
            )}
          </Button>
        </Box>
      </form>
      );
    }}
  </Mutation>

  );
} 

const AddMaster = ({classes}) => {
  const currentUser = useContext(UserContext);
  const { t } = useTranslation();

  if (!currentUser.salonSet[0]) {
    return <div className={classes.paddingTLR}> {t("No salon added. Please add a salon")}</div>
  } else if ((currentUser.salonSet[0].masterSet.length > 0) && (currentUser.role === "A_2")) {
    return <div className={classes.paddingTLR}> {t("Freelancer master already added.")}</div>
  } else {
    return <AddMasterForm classes={classes} currentUser={currentUser} />
  }
}

const AddMasterForm = ({classes, currentUser}) => {

  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  //const salonId = data_salon.id;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  var isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)|(Lumia)/i
  );

  //const dt = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '/' );


  // const handleUpdateCache = (cache, { data: { createTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(createTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  return(
    <div className={classes.container}>
      <Paper className={classes.paper}>
          <h3>{t("Add Master")}</h3> 
              <MasterForm data_salon={data_salon} setOpen={setOpen} userId={userId}/>    
      </Paper>
      <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
          fullScreen={!!isMobile}
          >
            <DialogTitle>
              {t("Master successfully added!")}
            </DialogTitle>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Link to={`/partner/${userId}/salon/view`}>
                  {t("Back to salon page")}
                </Link>
              </Button>
            </DialogActions>
        </Dialog>
    </div>
  )};

export const ADD_MASTER_MUTATION = gql`
  mutation($masterData:MasterInput!) {
    addMaster(masterData: $masterData) {
      master {
          id
        salon {
          id
          name
        }
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
    width: "100%",
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

const formStyles = makeStyles(theme => ({
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
    width: "80%",
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
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
}));


export default withStyles(styles)(AddMaster)
  