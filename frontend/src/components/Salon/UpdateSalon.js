// noValidate in the form ignores required html input fields in the form
import React, { useState, useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import gql from "graphql-tag";
import { useTranslation } from 'react-i18next';
import ImageGallery from "react-image-gallery";

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
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
//import NativeSelect from '@material-ui/core/NativeSelect';
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { UserContext } from "App.js"
import {ME_QUERY} from "App.js"

import InputMask from 'react-input-mask';
import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const UpdateSalon = ({classes}) => {
  const { t } = useTranslation();
    //query the salon data updated by the current user
    const currentUser = useContext(UserContext);
    if (!currentUser.salonSet[0]) {
      return <div className={classes.paddingTLR}> {t("No salon added. Please add a salon")}</div>
  } else {
    return <UpdateSalonForm classes={classes} currentUser={currentUser} />
  }
};

const UpdateSalonForm = ({classes, currentUser}) => {
  const API_BASE = `${process.env.REACT_APP_API_BASE}/media`;
  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  const salonId = data_salon.id;
  //const { data: data_user } = useQuery(PROFILE_QUERY, {variables: {id:userId}});
  const history = useHistory();
  const { t } = useTranslation();

  const [name, setName] = useState(data_salon.name);
  const [address, setAddress] = useState(data_salon.address);
  const [cityId, setCityId] = useState(data_salon.city.id);
  const [areaId, setAreaId] = useState(data_salon.area.id);
  const [description, setDescription] = useState(data_salon.description);
  // const [hairCategories, setHairCategories] = useState(data_salon.hairCategories.map(item => item.id).flat(1));
  // const [nailsCategories, setNailsCategories] = useState(data_salon.nailsCategories.map(item => item.id).flat(1));
  // const [hairRemovalCategories, setHairRemovalCategories] = useState(data_salon.hairRemovalCategories.map(item => item.id).flat(1));
  // const [makeupCategories, setMakeupCategories] = useState(data_salon.makeupCategories.map(item => item.id).flat(1));
  // const [massageCategories, setMassageCategories] = useState(data_salon.massageCategories.map(item => item.id).flat(1));
  // const [cosmetologyCategories, setCosmetologyCategories] = useState(data_salon.cosmetologyCategories.map(item => item.id).flat(1));
  // const [eyebrowCategories, setEyebrowCategories] = useState(data_salon.eyebrowCategories.map(item => item.id).flat(1));
  // const [tattooCategories, setTattooCategories] = useState(data_salon.tattooCategories.map(item => item.id).flat(1));
  // const [aestheticsCategories, setAestheticsCategories] = useState(data_salon.aestheticsCategories.map(item => item.id).flat(1));
  const [male, setMale] = useState(data_salon.male);
  const [female, setFemale] = useState(data_salon.female);
  const [email, setEmail] = useState(data_salon.email ? data_salon.email : "");
  const [phone, setPhone] = useState(data_salon.phone ? data_salon.phone : "");
  const [facebook, setFacebook] = useState(data_salon.facebook ? data_salon.facebook : "");
  const [instagram, setInstagram] = useState(data_salon.instagram ? data_salon.instagram : "");  
  const [img0, setImg0] = useState(data_salon.photoMain ? data_salon.photoMain : "");
  const [photo1, setPhoto1] = useState(data_salon.photo1 ? data_salon.photo1 : "");
  const [photo2, setPhoto2] = useState(data_salon.photo2 ? data_salon.photo2 : "");
  const [photo3, setPhoto3] = useState(data_salon.photo3 ? data_salon.photo3 : "");
  const [photo4, setPhoto4] = useState(data_salon.photo4 ? data_salon.photo4 : "");
  const [photo5, setPhoto5] = useState(data_salon.photo5 ? data_salon.photo5 : "");
  const [photo6, setPhoto6] = useState(data_salon.photo6 ? data_salon.photo6 : "");

  const [disabled, setDisabled] = useState(true)
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState({
    sizeError0: "",
    sizeError1: "",
    sizeError2: "",
    sizeError3: "",
    sizeError4: "",
    sizeError5: "",
    sizeError6: "",
  });
  
  const [imgThumb, setImgThumb] = useState({
    img0: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
    img6: "",
  })

  const [snack, setSnack] = useState({
    snackOpen: false,
    snackType: "",
    snackMessage: ""
  })

  //const dt = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '/' );

  const [uploadImg] = useMutation(FILE_MUTATION);

  const handlePhotoMainChange = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError0: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setImg0(selectedFile);
      setFileError({...fileError, sizeError0: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img0:[reader.result]})
    }
  };

  const handlePhoto1Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError1: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setPhoto1(selectedFile);
      setFileError({...fileError, sizeError1: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img1:[reader.result]})
    }
  }

  const handlePhoto2Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError2: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setPhoto2(selectedFile);
      setFileError({...fileError, sizeError2: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img2:[reader.result]})
    }
  };

  const handlePhoto3Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError3: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setPhoto3(selectedFile);
      setFileError({...fileError, sizeError3: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img3:[reader.result]})
    }
  };

  const handlePhoto4Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError4: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setPhoto4(selectedFile);
      setFileError({...fileError, sizeError4: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img4:[reader.result]})
    }
  };

  const handlePhoto5Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError5: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setPhoto5(selectedFile);
      setFileError({...fileError, sizeError5: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img5:[reader.result]})
    }
  };

  const handlePhoto6Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 5000000; // 5mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError({...fileError, sizeError6: `${selectedFile.name}: ${t("File size should be less than 5mb")}`});
    } else {
      setPhoto6(selectedFile);
      setFileError({...fileError, sizeError6: ""});
    }
    var reader = new FileReader();
    var url = reader.readAsDataURL(selectedFile);
    reader.onloadend = function(e) {
      setImgThumb({...imgThumb, img6:[reader.result]})
    }
  };  

  const handleImageUpload = async (img) => {
    try {
      const res = await uploadImg({variables:{file: img}});
      return res.data.uploadImg.url;
    } catch (err) {
      console.error("Error uploading file", err);
      //setSubmitting(false);
      history.push(`/partner/${userId}/salon/view`);
    }
  };

  // const handleUpdateCache = (cache, { data: { updateTrack } }) => {
  //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
  //   const tracks = data.tracks.concat(updateTrack.track);
  //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
  // };

  const handleSubmit = async (event, updateSalon) => {
    event.preventDefault();
    setSubmitting(true);
    const photos = [img0, photo1, photo2, photo3,
                        photo4, photo5, photo6];
    const numImages = photos.length;
    const uploadedUrl = [...Array(numImages)].map(x => "");

    for(let i=0; i<numImages; i++){
      const photo = photos[i]
      if (photo && typeof(photo) !== "string") {
        const url = await handleImageUpload(photo);
        uploadedUrl[i] = url || photo;
      } else {
        uploadedUrl[i] = photo;
      }
    }

    updateSalon({variables: {
                 salonData: {
                    name, address, cityId, areaId, description, 
                    // hairCategories, nailsCategories, hairRemovalCategories, makeupCategories, 
                    // massageCategories, eyebrowCategories, cosmetologyCategories,tattooCategories, aestheticsCategories,
                    male, female, email, phone, facebook, instagram, photoMain: uploadedUrl[0],
                    photo1: uploadedUrl[1], photo2: uploadedUrl[2], photo3: uploadedUrl[3],
                    photo4: uploadedUrl[4], photo5: uploadedUrl[5], photo6: uploadedUrl[6] 
                }, salonId}}).catch(err => {
                  console.error(err);
                  history.push('/partner');
                });
  };

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
          {t("Update Salon")}
        </Typography>
      </Breadcrumbs>      
      <Paper className={classes.paper}>
          <h3>{t("Update Salon")}</h3>
          <Mutation
            mutation={UPDATE_SALON_MUTATION}
            onCompleted={data => {
            //console.log({ data });
            //setSubmitting(false);
            //setOpen(true);
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
            {(updateSalon, { loading, error }) => {
            if (error) return <Error error={error} />;
              return(
                <form onSubmit={event => handleSubmit(event, updateSalon)} >
                  <h5>{t("Fields marked with an asterisk (*) are required")}</h5>
                  <FormControl fullWidth className={classes.field}>
                    <TextField
                    label={t("Name*")}
                    placeholder={t("Add Name")}
                    onChange={event => setName(event.target.value)}
                    value={name}
                    variant="outlined"
                    disabled={disabled}
                    // className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth className={classes.field}>
                    <TextField
                    label={t("Address*")}
                    placeholder={t("Add Address")}
                    onChange={event => setAddress(event.target.value)}
                    value={address}
                    variant="outlined"
                    disabled={disabled}
                    // className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth className={classes.field} >
                    <Query query={CITY_QUERY}>
                              {({data, loading, error}) => {
                                if (loading) return <Loading />;
                                if (error) return <Error error={error} />;
                                const categories = data.city.map(item => item.title); 
                              
                              return  <Autocomplete
                                        id="size-small-clearOnEsc"
                                        disableClearable
                                        size="small"
                                        getOptionLabel={option => t(`${option}`)}
                                        options={categories}
                                        disabled={disabled}
                                        defaultValue={data.city.filter(item => item.id == cityId)[0].title}
                                        onChange={(event,value) => {
                                          // it returns the id of the selected city in the City model
                                          setCityId(data.city.filter(item => item.title == value)[0].id); 
                                        }}
                                        renderInput={(params) => (
                                          <TextField {...params} 
                                          variant="outlined"  
                                          label={t("City*")} 
                                          // margin="normal" 
                                          // className={classes.textField}
                                          />
                                        )}
                                      />;
                                    }}
                    </Query>
                  </FormControl>
                  <FormControl fullWidth className={classes.field}>
                    <Query query={AREA_QUERY}>
                              {({data, loading, error}) => {
                                if (loading) return <Loading />;
                                if (error) return <Error error={error} />;
                                const categories = data.area.filter(item => item.city.id == cityId).map(item => item.title); 
                              
                              return  <Autocomplete
                                        id="size-small-clearOnEsc"
                                        disableClearable
                                        size="small"
                                        getOptionLabel={option => t(`${option}`)}
                                        options={categories}
                                        disabled={disabled}
                                        defaultValue={data.area.filter(item => item.id == areaId)[0].title}
                                        onChange={(event,value) => {
                                          //it returns nested city instance data->city->id,title
                                          // setArea({...data, area: data.area.filter(item => item.title == value)});
                                          setAreaId(data.area.filter(item => item.title === value)[0].id); 
                                        }}
                                        renderInput={(params) => (
                                          <TextField {...params} 
                                          variant="outlined" 
                                          label={t("Location*")} 
                                          // margin="normal" 
                                          // className={classes.textField}
                                          />
                                        )}
                                      />;
                                    }}
                    </Query>
                  </FormControl>
                  <FormControl fullWidth className={classes.field}>
                  <TextField
                    multiline
                    rows="4"
                    label={t("Description*")}
                    placeholder={t("Add Description")}
                    onChange={event => setDescription(event.target.value)}
                    value={description}
                    disabled={disabled}
                    variant="outlined"
                    // className={classes.textField}
                  />
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                      <TextField
                      label={t("Email")}
                      placeholder={t("Add email")}
                      onChange={(event) => setEmail(event.target.value)}
                      value={email}
                      disabled={disabled}
                      variant="outlined"
                      />
                  </FormControl>
                  <FormControl fullWidth className={classes.field}>
                    <InputMask 
                      mask="+\9\9\4 (99) 999 99 99"
                      //maskChar=""
                      style={{height:"50px", fontSize:"16px" }}
                      alwaysShowMask
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      disabled={disabled}
                    />
                  </FormControl>  
                  <FormControl fullWidth className={classes.field}>
                      <TextField
                      label={t("Facebook account")}
                      disabled={disabled}
                      placeholder={t("Add facebook account")}
                      onChange={(event) => setFacebook(event.target.value)}
                      value={facebook}
                      variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth className={classes.field}>
                      <TextField
                      label={t("Instagram account")}
                      disabled={disabled}
                      placeholder={t("Add instagram account")}
                      onChange={(event) => setInstagram(event.target.value)}
                      value={instagram}
                      variant="outlined"
                      />
                    </FormControl>              
                {/* <FormControl fullWidth>
                  <NativeSelect
                    value={priceRange}
                    onChange={event => {
                      setPriceRange(parseInt(event.target.value));
                      }}
                    name="priceRange"
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'priceRange' }}
                    variant="outlined"  
                  >
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                    <option value="4">$$$$</option>
                  </NativeSelect>
                </FormControl> */}

                {/* <h5>{t("Select relevant services")}</h5>
                <FormControl fullWidth className={classes.field}>
                  <Query query={HAIR_QUERY}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.hairCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={hairCategories.map(catId => data.hairCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                        // setHairCategories({...data, hairCat: data.hairCat.filter(item => value.includes(item.title))});
                                        setHairCategories(data.hairCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Hair categories")} 
                                placeholder={t("More hair")}
                                />
                              )}
                            />;
                    }}
                  </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={NAILS_QUERY}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.nailsCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={nailsCategories.map(catId => data.nailsCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setNailsCategories(data.nailsCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Nails categories")} 
                                placeholder={t("More nails")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={HAIR_REMOVAL_QUERY} className={classes.field}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.hairRemovalCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={hairRemovalCategories.map(catId => data.hairRemovalCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setHairRemovalCategories(data.hairRemovalCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Hair removal categories")} 
                                placeholder={t("More hair removal")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={MAKEUP_QUERY} className={classes.field}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.makeupCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={makeupCategories.map(catId => data.makeupCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setMakeupCategories(data.makeupCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Makeup categories")} 
                                placeholder={t("More makeup")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={MASSAGE_QUERY} className={classes.field}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.massageCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={massageCategories.map(catId => data.massageCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setMassageCategories(data.massageCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Massage/spa categories")} 
                                placeholder={t("More massage")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={EYEBROW_QUERY} className={classes.field}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.eyebrowCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={eyebrowCategories.map(catId => data.eyebrowCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setEyebrowCategories(data.eyebrowCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Eyebrow/lashes categories")} 
                                placeholder={t("More eyebrow")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={COSMETOLOGY_QUERY} className={classes.field}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.cosmetologyCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={cosmetologyCategories.map(catId => data.cosmetologyCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {                              
                                setCosmetologyCategories(data.cosmetologyCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Cosmetology categories")} 
                                placeholder={t("More cosmetology")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={TATTOO_QUERY}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.tattooCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={tattooCategories.map(catId => data.tattooCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setTattooCategories(data.tattooCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Tattoo/piercing categories")} 
                                placeholder={t("More tattoo")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field}>
                  <Query query={AESTHETICS_QUERY} className={classes.field}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.aestheticsCat.map(item => item.title);
                    
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              getOptionLabel={option => t(`${option}`)}
                              options={categories}
                              disabled={disabled}
                              defaultValue={aestheticsCategories.map(catId => data.aestheticsCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setAestheticsCategories(data.aestheticsCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label={t("Aesthetics categories")} 
                                placeholder={t("More aesthetics")} />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl> */}

                <Box
                  mt={1}
                  justifyContent="left"
                  display="flex"
                >
                  <h4> {t("Female")} </h4>
                  <Checkbox
                    disabled={disabled}
                    checked={female}
                    color="primary"
                    onChange={() => {
                      setFemale(!female);
                    }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <h4> {t("Male")} </h4>
                  <Checkbox
                    disabled={disabled}
                    checked={male}
                    color="primary"
                    onChange={() => {
                      setMale(!male);
                    }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Box>

                <h5>{t("Upload photos of your workplace or services provided. Visitors will be able to see your photos while reviewing your salon")}</h5>
                <FormControl fullWidth className={classes.field} error={Boolean(fileError)}>
                  <input
                    id="photoMain"
                    type="file"
                    accept="image/*"
                    disabled={disabled}
                    className={classes.input}
                    onChange={handlePhotoMainChange}
                  />
                  {/* <Box display="flex" justifyContent="flex-start"> */}
                  <label htmlFor="photoMain" className={classes.label} >
                    <Button
                      variant="outlined"
                      size="small"
                      color={img0||data_salon.photoMain ? "secondary" : "inherit"}
                      component="span"
                      className={classes.button}
                    >
                      {t("Main photo*")}
                    </Button>
                    {(img0 && typeof(img0)!=="string") && img0.name}
                    <FormHelperText>{fileError.sizeError0}</FormHelperText>
                {/* </Box> */}
                    {(img0 && typeof(img0) ==="string") &&
                      <img src={`${API_BASE}/${img0}`} className={classes.imgThumb} />
                        //'\xa0\xa0'+img0.split('/').pop() 
                    }
                    {imgThumb.img0 && <img src={imgThumb.img0} className={classes.imgThumb} />}   
                  </label>                                                        
                </FormControl>
                <FormControl fullWidth error={Boolean(fileError)}>
                  <input
                    id="photo1"
                    type="file"   
                    accept=".jpg, .jpeg, .png"
                    disabled={disabled}
                    className={classes.input}
                    onChange={handlePhoto1Change}
                  />
                  <Box display="flex" justifyContent="flex-start">
                    <label htmlFor="photo1" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo1||imgThumb.img1 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 1")}
                      </Button>
                      <FormHelperText>{fileError.sizeError1}</FormHelperText>
                      {(photo1 && typeof(photo1)!=="string") && photo1.name }
                      {(photo1 && typeof(photo1) ==="string") &&
                        <img src={`${API_BASE}/${photo1}`} className={classes.imgThumb} />
                      }
                      {imgThumb.img1 && <img src={imgThumb.img1} className={classes.imgThumb} />} 
                    </label>  
                    {photo1 && !disabled &&
                      (<Box ml={1} mt={0.5}>
                        <DeleteForeverIcon 
                            disabled={disabled}
                            fontSize="small" 
                            onClick={() => {
                                            setPhoto1("")
                                            setImgThumb({...imgThumb, img1:""})
                                          } 
                                    }
                            className={classes.button2} 
                        />                                                                                                                    
                      </Box>)}
                  </Box>                                                        
                </FormControl>  
                <FormControl fullWidth error={Boolean(fileError)}>
                  <input
                    id="photo2"                                                                                                                                                                                        
                    type="file"
                    accept=".jpg, .jpeg, .png"                                                                                     
                    disabled={disabled}
                    className={classes.input}
                    onChange={handlePhoto2Change}
                  />
                  <Box display="flex" justifyContent="flex-start">
                    <label htmlFor="photo2" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo2||imgThumb.img2 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 2")}
                      </Button>
                      <FormHelperText>{fileError.sizeError2}</FormHelperText>
                      {(photo2 && typeof(photo2)!=="string") && photo2.name }
                      {(photo2 && typeof(photo2) ==="string") &&
                        <img src={`${API_BASE}/${photo2}`} className={classes.imgThumb} />
                      }
                      {imgThumb.img2 && <img src={imgThumb.img2} className={classes.imgThumb} />} 
                    </label>
                    {photo2 && !disabled &&
                      (<Box ml={1} mt={0.5}>
                        <DeleteForeverIcon 
                            disabled={disabled}
                            fontSize="small" 
                            onClick={() => {
                                            setPhoto2("")
                                            setImgThumb({...imgThumb, img2:""})
                                          } 
                                    }
                            className={classes.button2} 
                        />                                                                                                                    
                      </Box>)}
                  </Box>
                </FormControl>
                <FormControl fullWidth error={Boolean(fileError)}>
                  <input
                    id="photo3"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    disabled={disabled}
                    className={classes.input}
                    onChange={handlePhoto3Change}
                  />
                  <Box display="flex" justifyContent="flex-start">
                    <label htmlFor="photo3" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo3||imgThumb.img3 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 3")}
                      </Button>
                      <FormHelperText>{fileError.sizeError3}</FormHelperText>
                      {(photo3 && typeof(photo3)!=="string") && photo3.name }
                      {(photo3 && typeof(photo3) ==="string") &&
                        <img src={`${API_BASE}/${photo3}`} className={classes.imgThumb} />
                      }
                      {imgThumb.img3 && <img src={imgThumb.img3} className={classes.imgThumb} />} 
                    </label>
                    {photo3 && !disabled &&
                      (<Box ml={1} mt={0.5}>
                        <DeleteForeverIcon 
                            disabled={disabled}
                            fontSize="small" 
                            onClick={() => {
                                            setPhoto3("")
                                            setImgThumb({...imgThumb, img3:""})
                                          } 
                                    }
                            className={classes.button2} 
                        />                                                                                                                    
                      </Box>)}
                  </Box>
                </FormControl>
                <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo4"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      disabled={disabled}
                      className={classes.input}
                      onChange={handlePhoto4Change}
                    />
                  <Box display="flex" justifyContent="flex-start">
                    <label htmlFor="photo4" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo4||imgThumb.img4 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 4")}
                      </Button>
                      <FormHelperText>{fileError.sizeError4}</FormHelperText>
                      {(photo4 && typeof(photo4)!=="string") && photo4.name }
                      {(photo4 && typeof(photo4) ==="string") &&
                        <img src={`${API_BASE}/${photo4}`} className={classes.imgThumb} />
                      }
                      {imgThumb.img4 && <img src={imgThumb.img4} className={classes.imgThumb} />} 
                    </label>
                    {photo4 && !disabled &&
                      (<Box ml={1} mt={0.5}>
                        <DeleteForeverIcon 
                            disabled={disabled}
                            fontSize="small" 
                            onClick={() => {
                                            setPhoto4("")
                                            setImgThumb({...imgThumb, img4:""})
                                          } 
                                    }
                            className={classes.button2} 
                        />                                                                                                                    
                      </Box>)}
                  </Box>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo5"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      disabled={disabled}
                      className={classes.input}
                      onChange={handlePhoto5Change}
                    />
                  <Box display="flex" justifyContent="flex-start">
                    <label htmlFor="photo5" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo5||imgThumb.img5 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 5")}
                      </Button>
                      <FormHelperText>{fileError.sizeError5}</FormHelperText>
                      {(photo5 && typeof(photo5)!=="string") && photo5.name }
                      {(photo5 && typeof(photo5) ==="string") &&
                        <img src={`${API_BASE}/${photo5}`} className={classes.imgThumb} />
                      }
                      {imgThumb.img5 && <img src={imgThumb.img5} className={classes.imgThumb} />} 
                    </label>
                    {photo5 && !disabled &&
                      (<Box ml={1} mt={0.5}>
                        <DeleteForeverIcon 
                            disabled={disabled}
                            fontSize="small" 
                            onClick={() => {
                                            setPhoto5("")
                                            setImgThumb({...imgThumb, img5:""})
                                          } 
                                    }
                            className={classes.button2} 
                        />                                                                                                                    
                      </Box>)}
                  </Box>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo6"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      disabled={disabled}
                      className={classes.input}
                      onChange={handlePhoto6Change}
                    />
                  <Box display="flex" justifyContent="flex-start">
                    <label htmlFor="photo6" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo6||imgThumb.img6 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 6")}
                      </Button>
                      <FormHelperText>{fileError.sizeError6}</FormHelperText>
                      {(photo6 && typeof(photo6)!=="string") && photo6.name }
                      {(photo6 && typeof(photo6) ==="string") &&
                        <img src={`${API_BASE}/${photo6}`} className={classes.imgThumb} />
                      }
                      {imgThumb.img6 && <img src={imgThumb.img6} className={classes.imgThumb} />} 
                    </label>
                    {photo6 && !disabled &&
                      (<Box ml={1} mt={0.5}>
                        <DeleteForeverIcon 
                            disabled={disabled}
                            fontSize="small" 
                            onClick={() => {
                                            setPhoto6("")
                                            setImgThumb({...imgThumb, img6:""})
                                          } 
                                    }
                            className={classes.button2} 
                        />                                                                                                                    
                      </Box>)}
                  </Box>
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
                      {t("Start updating")}
                    </Button>
                  </Box>)
                : (<Box
                      mt={1}
                      justifyContent="center"
                      display="flex"
                    >
                      <Button
                        disabled={submitting}
                        variant="outlined"
                        className={classes.cancel}
                        onClick={() => setDisabled(true)}
                      >
                        {t("Cancel")}
                      </Button>
                    {/* <Box flexGrow={1} /> */}
                    <Button
                      variant="outlined"
                      disabled={
                        submitting ||
                        !name.trim() ||
                        !address.trim() ||
                        !cityId ||
                        !areaId ||
                        !description.trim()
                      }
                      type="submit"
                      className={classes.save}
                    >
                      {submitting ? (
                        <CircularProgress className={classes.save} size={24} />
                      ) : (
                        `${t("Submit")}`
                      )}
                    </Button>
                  </Box>)                  
                }
                </form>
              );
            }}

          </Mutation>
      </Paper>
      {/* Success Dialog */}
        <Snackbar open={snack.snackOpen} autoHideDuration={1000} onClose={() => history.push(`/partner/${currentUser.id}/salon/view`)}>
          <Alert onClose={() => history.push(`/partner/${currentUser.id}/salon/view`)} severity={snack.snackType}>
            {snack.snackMessage}
          </Alert>
        </Snackbar>
        {/* <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
        >
          <DialogTitle>
            {t("Salon successfully updated!")}
          </DialogTitle>
           <DialogContent>
            <DialogContentText>
              {t("We will review your changes before publishing on the website.")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Link to={`/partner/${userId}/salon/view`}>
                {t("Return to the main.")}
              </Link>
            </Button>
          </DialogActions>
      </Dialog> */}
    </div>
)}

const UPDATE_SALON_MUTATION = gql`
  mutation($salonData:SalonInput!,$salonId:Int!) {
    updateSalon(salonData: $salonData, salonId: $salonId) {
      salon {
        id
        name
        address
        description
        phone
        email
      }
    }
  }
`;

const FILE_MUTATION = gql`
  mutation($file: Upload!){
    uploadImg(file: $file){
      url
      success
    }
  }
`;


const CITY_QUERY = gql`
{
    city {
        id
        title
        
      }
}
`;

const AREA_QUERY = gql`
{
    area {
        id
        title
        city {
          id
          title
        }
        salonSet{
          id
          name
        }
      }
}
`;

const HAIR_QUERY = gql`
{
    hairCat{
        id
        title
    }
}
`;

const NAILS_QUERY = gql`
{
    nailsCat{
        id
        title
      }
}
`;

const HAIR_REMOVAL_QUERY = gql`
{
    hairRemovalCat{
        id
        title
      }
}
`;

const MAKEUP_QUERY = gql`
{
    makeupCat{
        id
        title
      }
}
`;

const MASSAGE_QUERY = gql`
{
    massageCat{
        id
        title
      }
}
`;

const EYEBROW_QUERY = gql`
{
    eyebrowCat{
        id
        title
      }
}
`;

const COSMETOLOGY_QUERY = gql`
{
    cosmetologyCat{
        id
        title
      }
}
`;

const TATTOO_QUERY = gql`
{
    tattooCat{
        id
        title
      }
}
`;

const AESTHETICS_QUERY = gql`
{
    aestheticsCat{
        id
        title
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
  button2: {
    color: "#c0c0c0",
    cursor: "pointer",
    "&:hover,&:focus": {
      color: "red"
    }
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
  imgThumb: {
    width:"100%"
  },
  label:{
    display:"block", 
    width:"130px"
  },
  breadcrumb: {
    paddingLeft: "10px",
    paddingTop: "15px"
  }
});

export default withStyles(styles)(UpdateSalon);