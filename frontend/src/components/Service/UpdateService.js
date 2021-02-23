import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import { makeStyles } from '@material-ui/core/styles';

import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import FormHelperText from '@material-ui/core/FormHelperText';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { UserContext } from "App.js"
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
// import Error from "../Shared/Error"; 
// import Loading from "../Shared/Loading";
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

const ServiceForm = ({ role, updateMutation, deleteMutation, catType, selectedService, data_salon, userId, setCatValue }) => {
  const classes = formStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const [promo, setPromo] = React.useState(Boolean(selectedService.promotionPrice));
  const [disabled, setDisabled] = useState(true)
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  //console.log('salon_data', data_salon);

  const [serviceData, setServiceData] = useState({
    masterIds: selectedService.master.map(item => item.id).flat(1),
    title: selectedService.title,
    description: selectedService.description,
    duration: selectedService.duration,
    price: selectedService.price,
    promotionPrice: selectedService.promotionPrice
  })

  useEffect(() => {
    if (selectedService.title) {
      setServiceData({
        ...serviceData, 
        masterIds: selectedService.master.map(item => item.id).flat(1),
        title: selectedService.title,
        description: selectedService.description,
        duration: selectedService.duration,
        price: selectedService.price,
        promotionPrice: selectedService.promotionPrice
      })
    }
  }, [selectedService])

  useEffect(() => {
    if (role === "A_2") {
      setServiceData({
        ...serviceData, 
        masterIds: data_salon.masterSet[0].id
      })
    }
  }, [role])

  const handleSubmit = async (event, updateMutation) => {
    event.preventDefault();
    setTimeout(() => setSubmitting(true),1500);
  
    updateMutation({variables: { serviceData: serviceData, serviceId: parseInt(selectedService.id) }}).catch(err => {
      console.error(err);
      history.push('/partner');
    });
  };

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
          value={t(serviceData.title)}
          //disabled={disabled}
          variant="outlined"
          error={!serviceData.title.trim()}
        />
      </FormControl>
      { role === "A_3" && 
      <FormControl fullWidth required className={classes.field}>
        <Autocomplete
          multiple
          limitTags={3}
          id="size-small-standard-multi"
          size="small"
          //disabled={disabled}
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
            error={serviceData.masterIds.length === 0}
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
        //disabled={disabled}
        variant="outlined"
        multiline
        rowsMax={3}
        />
      </FormControl>
      <FormControl fullWidth variant="outlined" className={classes.field}>
      <InputLabel id="demo-simple-select-outlined-label">{t("Duration in mitutes")}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={serviceData.duration}
          onChange={(event) => {
            setServiceData({ ...serviceData, 
              duration: parseInt(event.target.value)
            })
          }}
          label={t("Duration in mitutes")}
        >
          <MenuItem value="30">30</MenuItem>
          <MenuItem value="45">45</MenuItem>
          <MenuItem value="60">60</MenuItem>
          <MenuItem value="90">90</MenuItem>
          <MenuItem value="120">120</MenuItem>
          <MenuItem value="180">180</MenuItem>
          <MenuItem value="240">240</MenuItem>

        </Select>
      </FormControl>
      <FormControl fullWidth className={classes.field}>
        <TextField
        label={t("Price")}
        variant="outlined"
        //disabled={disabled}
        value={serviceData.price}
        onChange={(event) => setServiceData({ ...serviceData, price: parseInt(event.target.value) })}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
        error={!serviceData.price}
      />
    </FormControl>
    {!promo && (
      <div>
      <h4> {t("Is promotion available?")} </h4>
      <Checkbox
          checked={promo}
          //disabled={disabled}
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
        //disabled={disabled}
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
            deleteMutation({variables: { serviceId: parseInt(selectedService.id) }}).catch(err => {
              console.error(err);
              history.push('/partner');
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
      </Box>) :
      (<Box
        mt={1}
        justifyContent="center"
        display="flex"
      >
      <Button
        variant="outlined"
        disabled={
          //submitting ||
          !serviceData.title.trim() ||
          !serviceData.price ||
          serviceData.masterIds.length === 0
        }
        type="submit"
        className={classes.save}
      >
        {submitting ? (
          <CircularProgress className={classes.save} size={24} />
        ) : (
          "Save"
        )}
      </Button>
      </Box>)
    } */}
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
        <Button
          disabled={submitting}
          variant="outlined"
          onClick={() => setCatValue("")}
          className={classes.cancel}
        >
          {t("Cancel")}
        </Button>
      <Button 
        variant="outlined"
        disabled={serviceData.title ?
          (submitting ||
          !serviceData.title.trim()) ||
          !serviceData.price ||
          serviceData.masterIds.length === 0
          : true
        }
        type="submit"
        className={classes.save}
      >
        {submitting ? (
          <CircularProgress className={classes.save} size={24} />
        ) : (
          `${t("Save")}`
        )}
      </Button>
    </Box>
    <Dialog
      open={confirmOpen}
      disableBackdropClick={true}
      TransitionComponent={Transition}
      //fullScreen={!!isMobile}
    >
      <DialogTitle>
        {t("Are you sure you want to delete the service?")}
      </DialogTitle>
      <DialogActions>
        <Button
          //color="secondary"
          variant="contained"
          onClick={() => {
            setConfirmOpen(false);
          }}
        >
          {t("No")}
        </Button>
        <Button
          //color="secondary"
          variant="contained"
          onClick={() => 
            deleteMutation({variables: { serviceId: parseInt(selectedService.id) }}).catch(err => {
              console.error(err);
              history.push('/partner');
            })
          }
        >
          {t("Yes")}
        </Button>
      </DialogActions>
    </Dialog>
  </form>
  )
} 

const CategoryServices = ({role, catValue, selectedService, data_salon, userId, setCatValue, snack, setSnack }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [updateHairService, { data: update_data }] = useMutation(UPDATE_HAIR_SERVICE_MUTATION, {
    onCompleted({ updateHairService }) {
      //history.push(`/partner/${userId}/salon/view`);
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteHairService, { data: delete_data }] = useMutation(DELETE_HAIR_SERVICE_MUTATION, {
    onCompleted({ deleteHairService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateNailsService] = useMutation(UPDATE_NAILS_SERVICE_MUTATION, {
    onCompleted({ updateNailsService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
},
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteNailsService] = useMutation(DELETE_NAILS_SERVICE_MUTATION, {
    onCompleted({ deleteNailsService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateHairRemovalService] = useMutation(UPDATE_HAIR_REMOVAL_SERVICE_MUTATION, {
    onCompleted({ updateHairRemovalService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteHairRemovalService] = useMutation(DELETE_HAIR_REMOVAL_SERVICE_MUTATION, {
    onCompleted({ deleteHairRemovalService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateMakeupService] = useMutation(UPDATE_MAKEUP_SERVICE_MUTATION, {
    onCompleted({ updateMakeupService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteMakeupService] = useMutation(DELETE_MAKEUP_SERVICE_MUTATION, {
    onCompleted({ deleteMakeupService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateMassageService] = useMutation(UPDATE_MASSAGE_SERVICE_MUTATION, {
    onCompleted({ updateMassageService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteMassageService] = useMutation(DELETE_MASSAGE_SERVICE_MUTATION, {
    onCompleted({ deleteMassageService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateEyebrowService] = useMutation(UPDATE_EYEBROW_SERVICE_MUTATION, {
    onCompleted({ updateEyebrowService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteEyebrowService] = useMutation(DELETE_EYEBROW_SERVICE_MUTATION, {
    onCompleted({ deleteEyebrowService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateCosmetologyService] = useMutation(UPDATE_COSMETOLOGY_SERVICE_MUTATION, {
    onCompleted({ updateCosmetologyService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteCosmetologyService] = useMutation(DELETE_COSMETOLOGY_SERVICE_MUTATION, {
    onCompleted({ deleteCosmetologyService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateTattooService] = useMutation(UPDATE_TATTOO_SERVICE_MUTATION, {
    onCompleted({ updateTattooService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteTattooService] = useMutation(DELETE_TATTOO_SERVICE_MUTATION, {
    onCompleted({ deleteTattooService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [updateAestheticsService] = useMutation(UPDATE_AESTHETICS_SERVICE_MUTATION, {
    onCompleted({ updateAestheticsService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully updated!")
      })
  },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });
  const [deleteAestheticsService] = useMutation(DELETE_AESTHETICS_SERVICE_MUTATION, {
    onCompleted({ deleteAestheticsService }) {
      setSnack ({
        ...snack,
        snackOpen: true,
        snackType: "success",
        snackMessage: t("Service successfully deleted!")
      })
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:userId} }],
    awaitRefetchQueries: true,
  });

  switch (catValue) {
    case t("category types", {returnObjects: true})["HairType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateHairService} 
          deleteMutation={deleteHairService}
          catType="hairCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );   
    case t("category types", {returnObjects: true})["NailsType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateNailsService} 
          deleteMutation={deleteNailsService}
          catType="nailsCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );          
    case t("category types", {returnObjects: true})["HairRemovalType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateHairRemovalService} 
          deleteMutation={deleteHairRemovalService}
          catType="hairRemovalCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );          
    case t("category types", {returnObjects: true})["MakeupType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateMakeupService} 
          deleteMutation={deleteMakeupService}
          catType="makeupCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );   
    case t("category types", {returnObjects: true})["MassageType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateMassageService} 
          deleteMutation={deleteMassageService}
          catType="massageCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );          
    case t("category types", {returnObjects: true})["EyebrowType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateEyebrowService} 
          deleteMutation={deleteEyebrowService}
          catType="eyebrowCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );          
    case t("category types", {returnObjects: true})["CosmetologyType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateCosmetologyService} 
          deleteMutation={deleteCosmetologyService}
          catType="cosmetologyCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );   
    case t("category types", {returnObjects: true})["TattooType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateTattooService} 
          deleteMutation={deleteTattooService}
          catType="tattooCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );          
    case t("category types", {returnObjects: true})["AestheticsType"]:
      return(
        <ServiceForm 
          role={role} 
          updateMutation={updateAestheticsService} 
          deleteMutation={deleteAestheticsService}
          catType="aestheticsCategories" 
          selectedService={selectedService} 
          data_salon={data_salon}
          userId={userId}
          setCatValue={setCatValue}
        />
      );                
    default:
      return null;
  }
}

const UpdateService = ({classes}) => {
  const { t } = useTranslation();
  const currentUser = useContext(UserContext);
  if (!currentUser.salonSet[0]) {
    return <div className={classes.paddingTLR}> {t("No salon added. Please add a salon")}</div>
  } else {
    return <UpdateServiceForm classes={classes} currentUser={currentUser} />
  }
}

const UpdateServiceForm = ({classes, currentUser}) => {

  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  const salonId = data_salon.id;

  const { t } = useTranslation();

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
  
  const [catValue, setCatValue] = useState("");
  const [selectedService, setSelectedService] = useState({});
  const [open, setOpen] = useState(false);

  var isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)|(Lumia)/i
  );

  // const handleUpdateCache = (cache, { data: { createTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(createTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  const [snack, setSnack] = useState({
    snackOpen: false,
    snackType: "",
    snackMessage: ""
  })

  const handleSnackClose = () => {
    setCatValue("")
    setSnack ({ ...snack,snackOpen: false })
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return(
    <div className={classes.container}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        className={classes.breadcrumb}
      >
        <Link
          variant="body1"
          color="inherit"
          to={`/partner/${userId}/salon/view`}
          //component={RouterLink}
        >
          {t("Salon")}
        </Link>
        <Typography
          variant="body1"
          color="textPrimary"
        >
          {t("Update Service")}
        </Typography>
      </Breadcrumbs>
      <Paper className={classes.paper}>
          <h3>{t("Update Service")}</h3>
          <FormControl fullWidth variant="outlined" className={classes.field}>
            {/* <Autocomplete
              id="size-small-clearOnEsc"
              disableClearable
              size="small"
              //getOptionLabel={option => t(`${option}`)}
              options={category_set}
              onChange={(event,value) => {
                        setCatValue(value)
                        setSelectedService({})
              }}
              renderInput={(params) => (
                <TextField {...params} 
                  variant="outlined" 
                  label={t("Category")} 
                  placeholder={t("Select service category")}
                />
              )}
            /> */}
            <InputLabel id="demo-simple-select-outlined-label">{t("Category")}</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={catValue}
              //disabled={catValue}
              onChange={(event) => {
                setCatValue(event.target.value)
                setSelectedService({})
              }}
              label={t("Category")}
            >
              {category_set.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {t(`${cat}`)}
                </MenuItem>
              ))}
            </Select>
            {/* <FormHelperText>{t("Choose a category")}</FormHelperText> */}
          </FormControl> 
          {catValue &&               
            (<FormControl fullWidth className={classes.field}> 
                <Autocomplete
                  id="size-small-clearOnEsc"
                  disableClearable
                  size="small"
                  getOptionLabel={option => t(`${option}`)}
                  options={services.filter(cat=>t("service types", {returnObjects: true})[cat.__typename]===catValue)
                    .map(service=>service.title)}
                  onChange={(event,value) => {
                            setSelectedService(services.filter(item => item.title === value)[0])
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    variant="outlined" 
                    label={t("Service")} 
                    placeholder={t("Select service")}
                    />
                  )}
                />
                <FormHelperText>{t("Choose a service")}</FormHelperText>
              </FormControl>)}
          {catValue && selectedService.title &&    
            (<CategoryServices 
              role={currentUser.role}
              data_salon={data_salon} 
              catValue={catValue} 
              selectedService={selectedService}
              setCatValue={setCatValue} 
              snack={snack}
              setSnack={setSnack} 
              userId={userId}
            />)} 
      </Paper>
      <Snackbar open={snack.snackOpen} autoHideDuration={1500} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snack.snackType}>
          {snack.snackMessage}
        </Alert>
      </Snackbar>
    </div>
  )};

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

const UPDATE_NAILS_SERVICE_MUTATION = gql`
  mutation($serviceData:NailsServiceInput!,$serviceId:Int!) {
    updateNailsService(serviceData: $serviceData, serviceId: $serviceId) {
      nailsService {
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
const DELETE_NAILS_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteNailsService(serviceId: $serviceId) {
      nailsService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_HAIR_REMOVAL_SERVICE_MUTATION = gql`
  mutation($serviceData:HairRemovalServiceInput!,$serviceId:Int!) {
    updateHairRemovalService(serviceData: $serviceData, serviceId: $serviceId) {
      hairRemovalService {
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
const DELETE_HAIR_REMOVAL_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteHairRemovalService(serviceId: $serviceId) {
      hairRemovalService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_MAKEUP_SERVICE_MUTATION = gql`
  mutation($serviceData:MakeupServiceInput!,$serviceId:Int!) {
    updateMakeupService(serviceData: $serviceData, serviceId: $serviceId) {
      makeupService {
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
const DELETE_MAKEUP_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteMakeupService(serviceId: $serviceId) {
      makeupService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_MASSAGE_SERVICE_MUTATION = gql`
  mutation($serviceData:MassageServiceInput!,$serviceId:Int!) {
    updateMassageService(serviceData: $serviceData, serviceId: $serviceId) {
      massageService {
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
const DELETE_MASSAGE_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteMassageService(serviceId: $serviceId) {
      massageService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_EYEBROW_SERVICE_MUTATION = gql`
  mutation($serviceData:EyebrowServiceInput!,$serviceId:Int!) {
    updateEyebrowService(serviceData: $serviceData, serviceId: $serviceId) {
      eyebrowService {
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
const DELETE_EYEBROW_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteEyebrowService(serviceId: $serviceId) {
      eyebrowService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_COSMETOLOGY_SERVICE_MUTATION = gql`
  mutation($serviceData:CosmetologyServiceInput!,$serviceId:Int!) {
    updateCosmetologyService(serviceData: $serviceData, serviceId: $serviceId) {
      cosmetologyService {
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
const DELETE_COSMETOLOGY_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteCosmetologyService(serviceId: $serviceId) {
      cosmetologyService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_TATTOO_SERVICE_MUTATION = gql`
  mutation($serviceData:TattooServiceInput!,$serviceId:Int!) {
    updateTattooService(serviceData: $serviceData, serviceId: $serviceId) {
      tattooService {
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
const DELETE_TATTOO_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteTattooService(serviceId: $serviceId) {
      tattooService {
        category {
          id 
          title
        }
        title
      }
    }
  }
`;

const UPDATE_AESTHETICS_SERVICE_MUTATION = gql`
  mutation($serviceData:AestheticsServiceInput!,$serviceId:Int!) {
    updateAestheticsService(serviceData: $serviceData, serviceId: $serviceId) {
      aestheticsService {
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
const DELETE_AESTHETICS_SERVICE_MUTATION = gql`
  mutation($serviceId:Int!) {
    deleteAestheticsService(serviceId: $serviceId) {
      aestheticsService {
        category {
          id 
          title
        }
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
    //marginTop: theme.spacing.unit * 8,
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
  },
  breadcrumb: {
    paddingLeft: "10px",
    paddingTop: "15px"
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
  }
}));


export default withStyles(styles)(UpdateService)
  