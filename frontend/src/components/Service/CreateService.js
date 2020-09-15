import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import axios from "axios";
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';

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
import Checkbox from '@material-ui/core/Checkbox';

import { UserContext } from "App.js"
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";
import { useHistory } from 'react-router-dom';

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}



function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
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

const ServiceForm = ({serviceMutation, catType, data_salon}) => {
  const classes = formStyles();
  const history = useHistory();

  const [promo, setPromo] = React.useState(false);
  const [submitting, setSubmitting] = useState(false);


  const [serviceData, setServiceData] = useState({
    salonId: data_salon.id,
    categoryId: "1", 
    title: '',
    description: '',
    duration: 30,
    price: '',
    promotionPrice: 0
  })

  const handleSubmit = async (event, serviceMutation) => {
    event.preventDefault();
    setSubmitting(true);
  
  
    console.log( "inputs", serviceData);
    serviceMutation({variables: { serviceData: {salonId: serviceData.salonId, categoryId: serviceData.categoryId,
      title: serviceData.title, description: serviceData.description, duration: serviceData.duration,
      price: serviceData.price, promotionPrice: serviceData.promotionPrice }
    }}).catch(err => {
      console.error(err);
      history.push('/login');
    });;
  };

  return(
    <form onSubmit={event => handleSubmit(event, serviceMutation)}>
      <FormControl fullWidth className={classes.field}>
        <Autocomplete
          id="size-small-clearOnEsc"
          disableClearable
          size="small"
          options={data_salon[catType].map(item => item.title).flat(1)}
          onChange={(event,value) => {
            setServiceData({ ...serviceData, categoryId:data_salon[catType].filter(item => item.title === value)[0].id })
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
        onChange={(event) => setServiceData({ ...serviceData, title:event.target.value })}
        value={serviceData.title}
        variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth className={classes.field}>
        <TextField
        label="Description"
        placeholder="Add description"
        onChange={(event) => setServiceData({ ...serviceData, description:event.target.value })}
        value={serviceData.description}
        variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth className={classes.field}>
        <Autocomplete
          id="size-small-clearOnEsc"
          disableClearable
          size="small"
          options={["15","30","45","60","75","90"]}
          onChange={(event,value) => setServiceData({ ...serviceData, duration: parseInt(value) }) }
          renderInput={(params) => (
            <TextField {...params} 
            variant="outlined"  
            label="Duration in mitutes" 
            />
            )}
        />
      </FormControl>
      <FormControl fullWidth className={classes.field}>
        <TextField
        label="Price"
        variant="outlined"
        value={serviceData.price}
        onChange={(event) => setServiceData({ ...serviceData, price: parseInt(event.target.value) })}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
      />
    </FormControl>
    <Checkbox
        checked={promo}
        color="primary"
        onChange={() => {
          setPromo(!promo);
          setServiceData({ ...serviceData, promotionPrice: 0 })
        }}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    {promo && (
    <FormControl fullWidth className={classes.field}>
        <TextField
        label="Promotion price"
        variant="outlined"
        value={serviceData.promotionPrice}
        onChange={(event) => setServiceData({ ...serviceData, promotionPrice: parseInt(event.target.value) })}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
      />
    </FormControl>
    )}
      <Box
        mt={1}
        justifyContent="center"
        display="flex"
      >
      <Button
        disabled={submitting}
        variant="outlined"
        onClick={() => setServiceData({ ...serviceData, title: "", description: "", price: "" })}
        className={classes.cancel}
      >
        Cancel
      </Button>
      {/* <Box flexGrow={1} /> */}
      <Button
        variant="outlined"
        disabled={
          submitting ||
          !serviceData.title.trim() ||
          !serviceData.price
        }
        type="submit"
        className={classes.save}
      >
        {submitting ? (
          <CircularProgress className={classes.save} size={24} />
        ) : (
          "Add Service"
        )}
      </Button>
      </Box>
  </form>
  )
} 

const CategoryServices = ({catValue, data_salon, setOpen}) => {
  const { t, i18n } = useTranslation();

  switch (catValue) {
    case t("category types", {returnObjects: true})["HairType"]:
      return(
        <Mutation
          mutation={CREATE_HAIR_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createHairService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createHairService} catType="hairCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );   
    case t("category types", {returnObjects: true})["NailsType"]:
      return(
        <Mutation
          mutation={CREATE_NAILS_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createNailsService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createNailsService} catType="nailsCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["HairRemovalType"]:
      return(
        <Mutation
          mutation={CREATE_HAIR_REMOVAL_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createHairRemovalService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createHairRemovalService} catType="hairRemovalCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["MakeupType"]:
      return(
        <Mutation
          mutation={CREATE_MAKEUP_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createMakeupService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createMakeupService} catType="makeupCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );   
    case t("category types", {returnObjects: true})["MassageType"]:
      return(
        <Mutation
          mutation={CREATE_MASSAGE_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createMassageService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createMassageService} catType="massageCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["EyebrowType"]:
      return(
        <Mutation
          mutation={CREATE_EYEBROW_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createEyebrowService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createEyebrowService} catType="eyebrowCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["CosmetologyType"]:
      return(
        <Mutation
          mutation={CREATE_COSMETOLOGY_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createCosmetologyService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createCosmetologyService} catType="cosmetologyCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );   
    case t("category types", {returnObjects: true})["TattooType"]:
      return(
        <Mutation
          mutation={CREATE_TATTOO_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createTattooService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createTattooService} catType="tattooCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["AestheticsType"]:
      return(
        <Mutation
          mutation={CREATE_AESTHETICS_SERVICE_MUTATION}
          onCompleted={data => {
          console.log({ data });
          //setSubmitting(false);
          setOpen(true);
          }}
          // update={handleUpdateCache}
          // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
        >
          {(createAestheticsService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm serviceMutation={createAestheticsService} catType="aestheticsCategories" data_salon={data_salon} />
            );
          }}
        </Mutation>
      );                
    default:
      return null;
  }
}

const CreateService = ({classes}) => {
  const currentUser = useContext(UserContext);
  if (!currentUser.salonSet[0]) {
    return <div> No salon added. Please add a salon</div>
  } else {
    return <CreateServiceForm classes={classes} currentUser={currentUser} />
  }
}

const CreateServiceForm = ({classes, currentUser}) => {

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

  const [catValue, setCatValue] = useState("");
  const [open, setOpen] = useState(false);
  //const [hairCategories, setHairCategories] = useState([]);

  const dt = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '/' );


  // const handleUpdateCache = (cache, { data: { createTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(createTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

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
              <CategoryServices data_salon={data_salon} catValue={catValue} setOpen={setOpen}/>    
      </Paper>
      <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
          >
            <DialogTitle>
              Service successfully created!
            </DialogTitle>
            <DialogActions>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Link to={`/partner/${userId}/salon/view`}>
                  Back to salon page
                </Link>
              </Button>
            </DialogActions>
        </Dialog>
    </div>
  )};

const CREATE_HAIR_SERVICE_MUTATION = gql`
  mutation($serviceData:HairServiceInput!) {
    createHairService(serviceData: $serviceData) {
      hairService {
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
  }
`;

const CREATE_NAILS_SERVICE_MUTATION = gql`
  mutation($serviceData:NailsServiceInput!) {
    createNailsService(serviceData: $serviceData) {
      nailsService {
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
  }
`;

const CREATE_HAIR_REMOVAL_SERVICE_MUTATION = gql`
  mutation($serviceData:HairRemovalServiceInput!) {
    createHairRemovalService(serviceData: $serviceData) {
      hairRemovalService {
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
  }
`;

const CREATE_MAKEUP_SERVICE_MUTATION = gql`
  mutation($serviceData:MakeupServiceInput!) {
    createMakeupService(serviceData: $serviceData) {
      makeupService {
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
  }
`;

const CREATE_MASSAGE_SERVICE_MUTATION = gql`
  mutation($serviceData:MassageServiceInput!) {
    createMassageService(serviceData: $serviceData) {
      massageService {
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
  }
`;

const CREATE_EYEBROW_SERVICE_MUTATION = gql`
  mutation($serviceData:EyebrowServiceInput!) {
    createEyebrowService(serviceData: $serviceData) {
      eyebrowService {
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
  }
`;

const CREATE_COSMETOLOGY_SERVICE_MUTATION = gql`
  mutation($serviceData:CosmetologyServiceInput!) {
    createCosmetologyService(serviceData: $serviceData) {
      cosmetologyService {
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
  }
`;

const CREATE_TATTOO_SERVICE_MUTATION = gql`
  mutation($serviceData:TattooServiceInput!) {
    createTattooService(serviceData: $serviceData) {
      tattooService {
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
  }
`;

const CREATE_AESTHETICS_SERVICE_MUTATION = gql`
  mutation($serviceData:AestheticsServiceInput!) {
    createAestheticsService(serviceData: $serviceData) {
      aestheticsService {
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


export default withStyles(styles)(CreateService)
  