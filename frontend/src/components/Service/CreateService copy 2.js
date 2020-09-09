import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import axios from "axios";
import Cookies from 'js-cookie';

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
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


const CreateService = ({classes}) => {

  const currentUser = useContext(UserContext);
  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  const salonId = data_salon.id;

  const { t, i18n } = useTranslation();

  const hairService_set = data_salon.hairCategories.map(item => item.__typename);
  const nailsService_set = data_salon.nailsCategories.map(item => item.__typename);
  const hairRemovalService_set = data_salon.hairRemovalCategories.map(item => item.__typename);
  const makeupService_set = data_salon.makeupCategories.map(item => item.__typename);
  const massageService_set = data_salon.massageCategories.map(item => item.__typename);
  const eyebrowService_set = data_salon.eyebrowCategories.map(item => item.__typename);
  const cosmetologyService_set = data_salon.cosmetologyCategories.map(item => item.__typename);
  const tattooService_set = data_salon.tattooCategories.map(item => item.__typename);
  const aestheticsService_set = data_salon.aestheticsCategories.map(item => item.__typename);
  
  const _category_set = [].concat(hairService_set,nailsService_set,hairRemovalService_set,makeupService_set,
                      massageService_set,eyebrowService_set,cosmetologyService_set,tattooService_set,aestheticsService_set);
  // translate the array and filter unique/distinct elements of above categories array. The latter is [...new Set(original_array)]
  const category_set = [...new Set(_category_set.map((key) => t("category types", {returnObjects: true})[key]))];
  console.log('service cat', category_set);

   
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [catValue, setCatValue] = useState("");
  const [description, setDescription] = useState("");
  const [hairCategories, setHairCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [female, setFemale] = useState(false);


  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dt = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '/' );


  // const handleUpdateCache = (cache, { data: { createTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(createTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        // onValueChange={(values) => {
        //   onChange({
        //     target: {
        //       name: props.name,
        //       value: values.value,
        //     },
        //   });
        // }}
        thousandSeparator
        isNumericString
        prefix="AZN "
      />
    );
  }
  
  NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    //onChange: PropTypes.func.isRequired,
  };

  const ServiceForm = ({serviceMutation, catType}) => {
    return(
      <form onSubmit={event => handleSubmit(event, serviceMutation)}>
        <FormControl fullWidth className={classes.field}>
          <Autocomplete
            id="size-small-clearOnEsc"
            disableClearable
            size="small"
            options={data_salon[catType].map(item => item.title).flat(1)}
            onChange={(event,value) => {
            }}
            renderInput={(params) => (
              <TextField {...params} 
              variant="outlined"  
              label="Subcategory" 
              />
              )}
          />
        </FormControl>
        <FormControl fullWidth className={classes.field}>
          <TextField
          label="Name"
          placeholder="Add name"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth className={classes.field}>
          <TextField
          label="Address"
          placeholder="Add Address"
          onChange={event => setAddress(event.target.value)}
          value={address}
          variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth className={classes.field}>
          <TextField
          label="Price"
          variant="outlined"
          value={price}
          onChange={event => setPrice(event.target.value)}
          name="numberformat"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
      </FormControl>


        <Box
          mt={1}
          justifyContent="center"
          display="flex"
        >
        <Button
          disabled={submitting}
          variant="outlined"
          onClick={() => {
                          setTitle("");
                          setAddress("");
                          }}
          className={classes.cancel}
        >
          Cancel
        </Button>
        {/* <Box flexGrow={1} /> */}
        <Button
          variant="outlined"
          disabled={
            submitting ||
            !title.trim() ||
            !catValue
          }
          type="submit"
          className={classes.save}
        >
          {submitting ? (
            <CircularProgress className={classes.save} size={24} />
          ) : (
            "Add Salon"
          )}
        </Button>
        </Box>
    </form>
    )
  } 

  const CategoryServices = ({catValue, catType}) => {
    switch (catValue) {
      case t("category types", {returnObjects: true})["HairType"]:
        return(
          <Mutation
            mutation={CREATE_HAIR_SERVICE_MUTATION}
            onCompleted={data => {
            console.log({ data });
            setSubmitting(false);
            setOpen(true);
            }}
            // update={handleUpdateCache}
            // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
          >
            {(createHairService, { loading, error }) => {
            if (error) return <Error error={error} />;
              return(
                <ServiceForm serviceMutation={createHairService} catType={catType} />
              );
            }}
          </Mutation>
        );          
      default:
        return null;
    }
  }
  

  const handleSubmit = async (event, createSalon) => {
    event.preventDefault();
    setSubmitting(true);


    console.log( "inputs", price);
    // createSalon({variables: {
    //               hairServiceData: {
    //                 name, address
    //             }}});
  };

  return(
    <div className={classes.container}>
      <Paper className={classes.paper}>
          <h3>Add Service</h3>
              <FormControl fullWidth className={classes.field}>
                <Autocomplete
                  id="size-small-clearOnEsc"
                  disableClearable
                  size="small"
                  options={category_set}
                  onChange={(event,value) => {
                            // setHairCategories({...data, hairCat: data.hairCat.filter(item => value.includes(item.title))});
                            setCatValue(value);
                            console.log('selected cat', value[0])
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    variant="outlined" 
                    label="Category " 
                    placeholder="Select service category"
                    />
                  )}
                />
              </FormControl>     
              <CategoryServices catValue={catValue} catType="hairCategories"/>    
      </Paper>
      {/* Success Dialog */}
        <Dialog
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
        >
          <DialogTitle>
            Salon successfully created!
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              We will review your posting before publishing on the website.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Link to="/">
                Return to the main page.
              </Link>
            </Button>
          </DialogActions>
      </Dialog>
    </div>

  )};

const CREATE_HAIR_SERVICE_MUTATION = gql`
  mutation($hairServiceData:HairServiceInput!) {
    createHairService(hairServiceData: $hairServiceData) {
      id
      salon {
        id
        name
      }
      category {
        id 
        title
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
});


export default withStyles(styles)(CreateService);