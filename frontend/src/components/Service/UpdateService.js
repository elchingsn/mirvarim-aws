import React, { useState, useEffect, useContext } from "react";
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
import {ME_QUERY} from "App.js"

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

const ServiceForm = ({ role, updateMutation, deleteMutation, catType, selectedService, data_salon }) => {
  const classes = formStyles();
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const [promo, setPromo] = React.useState(Boolean(selectedService.promotionPrice));
  const [disabled, setDisabled] = useState(true)
  const [submitting, setSubmitting] = useState(false);
  console.log('salon_data', data_salon);

  const [serviceData, setServiceData] = useState({
    masterIds: selectedService.master.map(item => item.id).flat(1),
    title: selectedService.title,
    description: selectedService.description,
    duration: selectedService.duration,
    price: selectedService.price,
    promotionPrice: selectedService.promotionPrice
  })

  useEffect(() => {
    if (role == "A_2") {
      setServiceData({
        ...serviceData, 
        masterIds: data_salon.masterSet[0].id
      })
    }
  }, [role])
  
  const handleSubmit = async (event, updateMutation) => {
    event.preventDefault();
    //setSubmitting(true);
  
    updateMutation({variables: { serviceData: serviceData, serviceId: parseInt(selectedService.id) }}).catch(err => {
      console.error(err);
      history.push('/login');
    });
  };
  console.log( "inputs", serviceData);

  return(
    <form onSubmit={event => handleSubmit(event, updateMutation)}>
      {/* <FormControl fullWidth className={classes.field}>
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
      </FormControl> */}
      <FormControl fullWidth className={classes.field}>
        <TextField
        label={t("Service name")}
        placeholder={t("Add service name")}
        onChange={(event) => setServiceData({ ...serviceData, title:event.target.value })}
        value={serviceData.title}
        disabled={disabled}
        variant="outlined"
        />
      </FormControl>
      { role == "A_3" &&
      <FormControl fullWidth required className={classes.field}>
        <Autocomplete
          multiple
          limitTags={3}
          id="size-small-standard-multi"
          size="small"
          disabled={disabled}
          defaultValue={serviceData.masterIds.map(masterId => data_salon.masterSet.filter(item => item.id == masterId)[0].masterName)}
          options={data_salon.masterSet.map(item => item.masterName)}
          onChange={(event,value) => {
                    setServiceData({
                      ...serviceData, 
                      masterIds: data_salon.masterSet.filter(item => value.includes(item.masterName)).map(item => item.id)
                    })                      
          }}
          renderInput={(params) => (
            <TextField {...params} 
            variant="outlined" 
            label={t("Choose masters")} 
            placeholder={t("More masters")}
          />
          )}
        />
      </FormControl>
      }
      <FormControl fullWidth className={classes.field}>
        <TextField
        label={t("Description")}
        placeholder={t("Add description")}
        onChange={(event) => setServiceData({ ...serviceData, description:event.target.value })}
        value={serviceData.description}
        disabled={disabled}
        variant="outlined"
        multiline
        rowsMax={3}
        />
      </FormControl>
      <FormControl fullWidth className={classes.field}>
        <Autocomplete
          id="size-small-clearOnEsc"
          disableClearable
          size="small"
          disabled={disabled}
          defaultValue={serviceData.duration}
          options={["15","30","45","60","75","90"]}
          onChange={(event,value) => setServiceData({ ...serviceData, duration: parseInt(value) }) }
          renderInput={(params) => (
            <TextField {...params} 
            variant="outlined"  
            label={t("Duration in mitutes")} 
            />
            )}
        />
      </FormControl>
      <FormControl fullWidth className={classes.field}>
        <TextField
        label={t("Price")}
        variant="outlined"
        disabled={disabled}
        value={serviceData.price}
        onChange={(event) => setServiceData({ ...serviceData, price: parseInt(event.target.value) })}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
      />
    </FormControl>
    {!promo && (
      <div>
      <h4> {t("Is promotion available?")} </h4>
      <Checkbox
          checked={promo}
          color="primary"
          onChange={() => {
            setPromo(!promo);
            setServiceData({ ...serviceData, promotionPrice: 0 })
          }}
          inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      </div>
    )}
    {promo && (
    <FormControl fullWidth className={classes.field}>
        <TextField
        label={t("Promotion price")}
        variant="outlined"
        disabled={disabled}
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
          {t("Update")}
        </Button>
      </Box>) :
      (<Box
        mt={1}
        justifyContent="center"
        display="flex"
      >
      <Button
        //disabled={submitting}
        variant="outlined"
        onClick={() => 
          deleteMutation({variables: { serviceId: parseInt(selectedService.id) }}).catch(err => {
            console.error(err);
            history.push('/login');
          })
        }
        className={classes.cancel}
      >
        {t("Delete")}
      </Button>
      {/* <Box flexGrow={1} /> */}
      <Button
        variant="outlined"
        disabled={
          //submitting ||
          !serviceData.title.trim() ||
          !serviceData.price ||
          serviceData.masterIds.length == 0
        }
        type="submit"
        className={classes.save}
      >
        {submitting ? (
          <CircularProgress className={classes.save} size={24} />
        ) : (
          "Update"
        )}
      </Button>
      </Box>)
    }
  </form>
  )
} 

const CategoryServices = ({role, catValue, selectedService, data_salon, setOpen, userId}) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const [updateHairService, { data: update_data }] = useMutation(UPDATE_HAIR_SERVICE_MUTATION, {
    onCompleted({ updateHairService }) {
      console.log('completed');
    //   setSnack ({
    //   ...snack,
    //   snackOpen: true,
    //   snackType: "success",
    //   snackMessage: "Confirmed"
    // })
    //setSubmitting(false);
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteHairService, { data: delete_data }] = useMutation(DELETE_HAIR_SERVICE_MUTATION, {
    onCompleted({ deleteHairService }) {
      history.push(`/partner/${userId}/salon/view`);
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });

  switch (catValue) {
    case "HairServiceType":
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateHairService} 
          deleteMutation={deleteHairService}
          catType="hairCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
        />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createNailsService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createNailsService} catType="nailsCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createHairRemovalService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createHairRemovalService} catType="hairRemovalCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createMakeupService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createMakeupService} catType="makeupCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createMassageService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createMassageService} catType="massageCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createEyebrowService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createEyebrowService} catType="eyebrowCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createCosmetologyService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createCosmetologyService} catType="cosmetologyCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createTattooService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createTattooService} catType="tattooCategories" data_salon={data_salon} />
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
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createAestheticsService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createAestheticsService} catType="aestheticsCategories" data_salon={data_salon} />
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
    return <UpdateServiceForm classes={classes} currentUser={currentUser} />
  }
}

const UpdateServiceForm = ({classes, currentUser}) => {

  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  const salonId = data_salon.id;

  const { t, i18n } = useTranslation();

  const hairServices = data_salon.hairserviceSet
  const nailsServices = data_salon.nailsserviceSet
  const hairRemovalServices = data_salon.hairremovalserviceSet 
  const makeupServices = data_salon.makeupserviceSet
  const massageServices = data_salon.massageserviceSet
  const eyebrowServices = data_salon.eyebrowserviceSet
  const cosmetologyServices = data_salon.cosmetologyserviceSet
  const tattooServices = data_salon.tattooserviceSet
  const aestheticsServices = data_salon.aestheticsserviceSet
  const services = [...hairServices, ...nailsServices, ...hairRemovalServices, ...makeupServices, ...massageServices,
                    ...eyebrowServices, ...cosmetologyServices, ...tattooServices, ...aestheticsServices]    
  
  // translate the array and filter unique/distinct elements of above categories array. The latter is [...new Set(original_array)]
  //const category_set = [...new Set(_category_set.map((key) => t("category types", {returnObjects: true})[key]))];
  console.log('services', services);

  const [catValue, setCatValue] = useState("");
  const [selectedService, setSelectedService] = useState({});

  const [open, setOpen] = useState(false);

  // const handleUpdateCache = (cache, { data: { createTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(createTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  return(
    <div className={classes.container}>
      <Paper className={classes.paper}>
          <h3>{t("Update Service")}</h3>
              <FormControl fullWidth className={classes.field}> 
                <Autocomplete
                  id="size-small-clearOnEsc"
                  disableClearable
                  size="small"
                  getOptionLabel={option => t(`${option}`)}
                  options={services.map(service => t(`${service.title}`))}
                  options={services.map(service => service.title)}
                  onChange={(event,value) => {
                            setCatValue(services.filter(item => item.title == value)[0].__typename);
                            setSelectedService(services.filter(item => item.title == value)[0])
                            console.log('selected cat', services.filter(item => item.title == value)[0].__typename)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    variant="outlined" 
                    label={t("Category")} 
                    placeholder={t("Select service category")}
                    />
                  )}
                />
                <FormHelperText>{t("Choose a service")}</FormHelperText>
              </FormControl>     
              <CategoryServices 
                role={currentUser.role}
                data_salon={data_salon} 
                catValue={catValue} 
                selectedService={selectedService}
                setOpen={setOpen} 
                userId={userId}
              />     
      </Paper>
      <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
          >
            <DialogTitle>
              {t("Service successfully updated!")}
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
                  {t("Back to salon page")}
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


const UPDATE_HAIR_SERVICE_MUTATION = gql`
  mutation($serviceData:HairServiceInput!,$serviceId:Int!) {
    updateHairService(serviceData: $serviceData, serviceId: $serviceId) {
      hairService {
        id
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const DELETE_HAIR_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteHairService(serviceId: $serviceId) {
      hairService {
        category {
          id 
          title
        }
        title
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
  