import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { useQuery } from "@apollo/react-hooks";
// import { useMutation } from '@apollo/react-hooks';
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
import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";
import { useHistory } from 'react-router-dom';
import {ME_QUERY} from "App.js"

import{
        HAIR_QUERY,
        NAILS_QUERY,
        HAIR_REMOVAL_QUERY,
        MAKEUP_QUERY,
        MASSAGE_QUERY,
        EYEBROW_QUERY,
        COSMETOLOGY_QUERY,
        TATTOO_QUERY,
        AESTHETICS_QUERY
      } from "components/Salon/CreateSalon"

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

const ServiceForm = ({role, serviceMutation, catType, data_salon, category_dict, setCatValue}) => {
  const { t } = useTranslation();
  const classes = formStyles();
  const history = useHistory();

  const [promo, setPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [serviceData, setServiceData] = useState({
    salonId: data_salon.id,
    categoryId: "1", 
    masterIds: [],
    title: category_dict[catType][catType][0].title,
    description: '',
    duration: 30,
    price: '',
    promotionPrice: 0
  })

  useEffect(() => {
    if (role === "A_2") {
      setServiceData({
        ...serviceData, 
        masterIds: data_salon.masterSet[0].id
      })
    }
  }, [role])
  
  //console.log(serviceData)

  const handleSubmit = async (event, serviceMutation) => {
    event.preventDefault();
    setTimeout(() => setSubmitting(true),1500);
  
    // serviceMutation({variables: { serviceData: {salonId: serviceData.salonId, categoryId: serviceData.categoryId,
    //   title: serviceData.title, description: serviceData.description, duration: serviceData.duration,
    //   price: serviceData.price, promotionPrice: serviceData.promotionPrice }
    // }}).catch(err => {
    //   console.error(err);
    //   history.push('/login');
    // });
    serviceMutation({variables: { serviceData: serviceData }}).catch(err => {
      console.error(err);
      history.push('/partner');
    });
  };

  return(
    <form onSubmit={event => handleSubmit(event, serviceMutation)}>
    <FormControl fullWidth variant="outlined" className={classes.field}>
      <InputLabel id="demo-simple-select-outlined-label">{t("Subcategory")}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={category_dict[catType][catType].filter(item => item.id === serviceData.categoryId)[0] ?
          category_dict[catType][catType].filter(item => item.id === serviceData.categoryId)[0].title :
          ""}
        onChange={(event) => {
          setServiceData({ ...serviceData, 
            categoryId:category_dict[catType][catType].filter(item => item.title === event.target.value)[0].id,
            title:event.target.value
          })
        }}
        label={t("Subcategory")}
      >
        {category_dict[catType][catType].map(subcat => (
          <MenuItem key={subcat.id} value={subcat.title}>
            {t(`${subcat.title}`)}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      {/* <FormControl fullWidth className={classes.field}>
        <Autocomplete
          id="size-small-clearOnEsc"
          disableClearable
          size="small"
          getOptionLabel={option => t(`${option}`)}
          //options={data_salon[catType].map(item => item.title).flat(1)}
          options={category_dict[catType][catType].map(item => item.title).flat(1)}
          onChange={(event,value) => {
            setServiceData({ ...serviceData, 
              categoryId:category_dict[catType][catType].filter(item => item.title === value)[0].id,
              title:value
            })
          }}
          renderInput={(params) => (
            <TextField {...params} 
            variant="outlined"  
            label={t("Subcategory")} 
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
        variant="outlined"
        multiline
        rowsMax={3}
        />
      </FormControl>
      {/* <FormControl fullWidth className={classes.field}>
        <Autocomplete
          id="size-small-clearOnEsc"
          disableClearable
          size="small"
          options={["15","30","45","60","75","90"]}
          onChange={(event,value) => setServiceData({ ...serviceData, duration: parseInt(value) }) }
          renderInput={(params) => (
            <TextField {...params} 
            variant="outlined"  
            label={t("Duration in mitutes")} 
            />
            )}
        />
      </FormControl> */}
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
    {promo && (
    <FormControl fullWidth className={classes.field}>
        <TextField
        label={t("Promotion price")}
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
        //onClick={() => setServiceData({ ...serviceData,title:"",masterIds:[],description:"",price:"" })}
        onClick={() => setCatValue("")}
        className={classes.cancel}
      >
        {t("Cancel")}
      </Button>
      {/* <Box flexGrow={1} /> */}
      <Button
        variant="outlined"
        disabled={
          submitting ||
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
          `${t("Add Service")}`
        )}
      </Button>
      </Box>
  </form>
  )
} 

const CategoryServices = ({role, catValue, data_salon, setOpen, userId, setCatValue, snack, setSnack }) => {
  const { t } = useTranslation();

  const { data:data_hair } = useQuery(HAIR_QUERY);
  const { data:data_nails } = useQuery(NAILS_QUERY);
  const { data:data_hair_removal } = useQuery(HAIR_REMOVAL_QUERY);
  const { data:data_makeup } = useQuery(MAKEUP_QUERY);
  const { data:data_massage } = useQuery(MASSAGE_QUERY);
  const { data:data_eyebrow } = useQuery(EYEBROW_QUERY);
  const { data:data_cosmetology } = useQuery(COSMETOLOGY_QUERY);
  const { data:data_tattoo } = useQuery(TATTOO_QUERY);
  const { data:data_aesthetics } = useQuery(AESTHETICS_QUERY);

  const category_dict = {
    "hairCat":data_hair,
    "nailsCat":data_nails,
    "hairRemovalCat":data_hair_removal,
    "makeupCat":data_makeup,
    "massageCat":data_massage,
    "eyebrowCat":data_eyebrow,
    "cosmetologyCat":data_cosmetology,
    "tattooCat":data_tattoo,
    "aestheticsCat":data_aesthetics
  }

  switch (catValue) {
    case t("category types", {returnObjects: true})["HairType"]:
      return(
        <Mutation
          mutation={CREATE_HAIR_SERVICE_MUTATION}
          onCompleted={data => {
          //console.log({ data });
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createHairService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createHairService} catType="hairCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );   
    case t("category types", {returnObjects: true})["NailsType"]:
      return(
        <Mutation
          mutation={CREATE_NAILS_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createNailsService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createNailsService} catType="nailsCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["HairRemovalType"]:
      return(
        <Mutation
          mutation={CREATE_HAIR_REMOVAL_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createHairRemovalService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createHairRemovalService} catType="hairRemovalCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["MakeupType"]:
      return(
        <Mutation
          mutation={CREATE_MAKEUP_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createMakeupService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createMakeupService} catType="makeupCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );   
    case t("category types", {returnObjects: true})["MassageType"]:
      return(
        <Mutation
          mutation={CREATE_MASSAGE_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createMassageService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createMassageService} catType="massageCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["EyebrowType"]:
      return(
        <Mutation
          mutation={CREATE_EYEBROW_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createEyebrowService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createEyebrowService} catType="eyebrowCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["CosmetologyType"]:
      return(
        <Mutation
          mutation={CREATE_COSMETOLOGY_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createCosmetologyService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createCosmetologyService} catType="cosmetologyCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );   
    case t("category types", {returnObjects: true})["TattooType"]:
      return(
        <Mutation
          mutation={CREATE_TATTOO_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createTattooService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createTattooService} catType="tattooCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
            );
          }}
        </Mutation>
      );          
    case t("category types", {returnObjects: true})["AestheticsType"]:
      return(
        <Mutation
          mutation={CREATE_AESTHETICS_SERVICE_MUTATION}
          onCompleted={data => {
            setSnack ({
              ...snack,
              snackOpen: true,
              snackType: "success",
              snackMessage: t("Service successfully created!")
            })
          }}
          // update={handleUpdateCache}
          refetchQueries={() => [{ query: ME_QUERY, variables: {id:userId} }]}
          >
          {(createAestheticsService, { loading, error }) => {
          if (error) return <Error error={error} />;
            return(
              <ServiceForm role={role} serviceMutation={createAestheticsService} catType="aestheticsCat" data_salon={data_salon} category_dict={category_dict} setCatValue={setCatValue} />
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
  const { t } = useTranslation();

  if (!currentUser.salonSet[0]) {
    return <div className={classes.paddingTLR}> {t("No salon added. Please add a salon")}</div>
  } else if (currentUser.salonSet[0].masterSet.length === 0) {
    return <div className={classes.paddingTLR}> {t("No master added. Please add a master")}</div>
  } else {
    return <CreateServiceForm classes={classes} currentUser={currentUser} />
  }
}

const CreateServiceForm = ({classes, currentUser}) => {

  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  const salonId = data_salon.id;
  const { t } = useTranslation();

  // const hairService_set = data_salon.hairCategories.map(item => item.__typename);
  // const nailsService_set = data_salon.nailsCategories.map(item => item.__typename);
  // const hairRemovalService_set = data_salon.hairRemovalCategories.map(item => item.__typename);
  // const makeupService_set = data_salon.makeupCategories.map(item => item.__typename);
  // const massageService_set = data_salon.massageCategories.map(item => item.__typename);
  // const eyebrowService_set = data_salon.eyebrowCategories.map(item => item.__typename);
  // const cosmetologyService_set = data_salon.cosmetologyCategories.map(item => item.__typename);
  // const tattooService_set = data_salon.tattooCategories.map(item => item.__typename);
  // const aestheticsService_set = data_salon.aestheticsCategories.map(item => item.__typename);
  
  // const _category_set = [].concat(hairService_set,nailsService_set,hairRemovalService_set,makeupService_set,
  //                     massageService_set,eyebrowService_set,cosmetologyService_set,tattooService_set,aestheticsService_set);
  // // translate the array and filter unique/distinct elements of above categories array. The latter is [...new Set(original_array)]
  // const category_set = [...new Set(_category_set.map((key) => t("category types", {returnObjects: true})[key]))];

  //we want to include all categories in v2
  const _category_set = ["HairType","NailsType","HairRemovalType","MakeupType","MassageType","EyebrowType","CosmetologyType","TattooType","AestheticsType"]
  const category_set = _category_set.map((key) => t("category types", {returnObjects: true})[key])
  const [catValue, setCatValue] = useState("");
  const [open, setOpen] = useState(false);

  var isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)|(Lumia)/i
  );

  //const [hairCategories, setHairCategories] = useState([]);

  //const dt = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '/' );


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
        >
          {t("Salon")}
        </Link>
        <Typography
          variant="body1"
          color="textPrimary"
        >
          {t("Services")}
        </Typography>
      </Breadcrumbs>
      <Paper className={classes.paper}>
          <h3>{t("Add Service")}</h3>
              <FormControl fullWidth variant="outlined" className={classes.field}>
                {/* <p> {t("You can add services from the categories that are available for your salon. Please, update your salon to add more categories.")}</p>
                <Autocomplete
                  id="size-small-clearOnEsc"
                  disableClearable
                  size="small"
                  getOptionLabel={option => t(`${option}`)}
                  options={category_set}
                  onChange={(event,value) => {
                            // setHairCategories({...data, hairCat: data.hairCat.filter(item => value.includes(item.title))});
                            setCatValue(value);
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
                  disabled={catValue}
                  onChange={(event) => {
                    setCatValue(event.target.value);
                  }}
                  label={t("Category")}
                >
                  {category_set.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {t(`${cat}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>     
              <CategoryServices 
                  role={currentUser.role}
                  data_salon={data_salon} 
                  catValue={catValue} 
                  setCatValue={setCatValue} 
                  snack={snack}
                  setSnack={setSnack}
                  userId={userId}
                />  
      </Paper>
      <Snackbar open={snack.snackOpen} autoHideDuration={1500} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snack.snackType}>
          {snack.snackMessage}
        </Alert>
      </Snackbar>
      {/* <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
          fullScreen={!!isMobile}
          >
            <DialogTitle>
              {t("Service successfully created!")}
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
        </Dialog> */}
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


export default withStyles(styles)(CreateService)
  