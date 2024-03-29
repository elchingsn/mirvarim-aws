import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation } from '@apollo/react-hooks';
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
//import NativeSelect from '@material-ui/core/NativeSelect';
import CircularProgress from "@material-ui/core/CircularProgress";
import InputMask from 'react-input-mask';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { UserContext } from "App";
import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";
import {ME_QUERY} from "App.js"

//import { ADD_MASTER_MUTATION } from "components/Master/AddMaster.js"

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const CreateSalon = ({classes}) => {
    const { t } = useTranslation();
    const currentUser = useContext(UserContext);
    if (currentUser.masterSet[0] && currentUser.masterSet[0].isStaff && currentUser.masterSet[0].staffStatus === "confirmed") {
      return (
        <div className={classes.container}>
          <div className={classes.field}> {t("This account is the confirmed staff member of ")}{currentUser.masterSet[0].salon.name} </div>
        </div>
      ) 
    } else 
    if (currentUser.salonSet[0]) {
        return (
          <div className={classes.container}>
            <div className={classes.field}> {t("This account has successfully added a salon. Please, contact us if you want to delete your salon.")} </div>
          </div>
        ) 
    } else {
      return <AddSalonForm classes={classes} currentUser={currentUser} />
    }
}

const AddSalonForm = ({ classes, currentUser }) => {
    const history = useHistory();
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [cityId, setCityId] = useState("");
    const [areaId, setAreaId] = useState("");
    const [description, setDescription] = useState("");
    // const [hairCategories, setHairCategories] = useState([]);
    // const [nailsCategories, setNailsCategories] = useState([]);
    // const [hairRemovalCategories, setHairRemovalCategories] = useState([]);
    // const [makeupCategories, setMakeupCategories] = useState([]);
    // const [massageCategories, setMassageCategories] = useState([]);
    // const [cosmetologyCategories, setCosmetologyCategories] = useState([]);
    // const [eyebrowCategories, setEyebrowCategories] = useState([]);
    // const [tattooCategories, setTattooCategories] = useState([]);
    // const [aestheticsCategories, setAestheticsCategories] = useState([]);
    const [male, setMale] = useState(false);
    const [female, setFemale] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [img0, setImg0] = useState("");
    const [photo1, setPhoto1] = useState("");
    const [photo2, setPhoto2] = useState("");
    const [photo3, setPhoto3] = useState("");
    const [photo4, setPhoto4] = useState("");
    const [photo5, setPhoto5] = useState("");
    const [photo6, setPhoto6] = useState("");

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

    //const [addMaster, { data: master_data }] = useMutation(ADD_MASTER_MUTATION);

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
    };

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
        setSubmitting(false);
      }
    };
  
    // const handleUpdateCache = (cache, { data: { createTrack } }) => {
    //   const data = cache.readQuery({ query: GET_TRACKS_QUERY });
    //   const tracks = data.tracks.concat(createTrack.track);
    //   cache.writeQuery({ query: GET_TRACKS_QUERY, data: { tracks } });
    // };

    const handleSubmit = async (event, createSalon) => {
      event.preventDefault();
      setSubmitting(true);
      const photos = [img0, photo1, photo2, photo3,
                          photo4, photo5, photo6];
      const numImages = photos.length;
      const uploadedUrl = [...Array(numImages)].map(x => "");

      for(let i=0; i<numImages; i++){
        const photo = photos[i]
        if (photo) {uploadedUrl[i] = await handleImageUpload(photo)}
      }

      // console.log( name, address, cityId, areaId, description, hairCategories, nailsCategories,
      //   hairRemovalCategories, makeupCategories, massageCategories, eyebrowCategories, cosmetologyCategories,
      //   tattooCategories, aestheticsCategories,
      //   male, female, email, phone, uploadedUrl[0],
      //   uploadedUrl[1], uploadedUrl[2], uploadedUrl[3],
      //   uploadedUrl[4], uploadedUrl[5], uploadedUrl[6] );
      createSalon({variables: {
                   salonData: {
                      name, address, cityId, areaId, description, 
                      // priceRange, masters, hairCategories, nailsCategories,hairRemovalCategories, 
                      // makeupCategories, massageCategories, eyebrowCategories, cosmetologyCategories,
                      // tattooCategories, aestheticsCategories,
                      male, female, facebook, instagram, email, phone, photoMain: uploadedUrl[0],
                      photo1: uploadedUrl[1], photo2: uploadedUrl[2], photo3: uploadedUrl[3],
                      photo4: uploadedUrl[4], photo5: uploadedUrl[5], photo6: uploadedUrl[6] 
                  }}}).catch(err => {
                    console.error(err);
                    history.push('/partner'); 
                  });
      // if (currentUser.role == "A_2") {
      //   addMaster({variables: { masterData: {} }}).catch(err => {
      //     console.error(err);
      //     history.push('/login');
      //   });
      // }
    };

    function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return(
      <div className={classes.container}>
        <Paper className={classes.paper}>
            <h3>{t("Add Salon")}</h3>
            <Mutation
              mutation={CREATE_SALON_MUTATION}
              onCompleted={data => {
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
              {(createSalon, { loading, error }) => {
              if (error) return <Error error={error} />;
                return(
                  <form onSubmit={event => handleSubmit(event, createSalon)}>
                    <h5>{t("Fields marked with an asterisk (*) are required")}</h5>
                    <FormControl fullWidth className={classes.field}>
                      <TextField
                      label={t("Name*")}
                      placeholder={t("Add Name")}
                      onChange={event => setName(event.target.value)}
                      value={name}
                      variant="outlined"
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
                                          //clearOnEscape
                                          disableClearable
                                          size="small"
                                          getOptionLabel={option => t(`${option}`)}
                                          options={categories}
                                          onChange={(event,value) => {
                                            // it returns the id of the selected city in the City model
                                            setCityId(data.city.filter(item => item.title === value)[0].id); 
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
                    {cityId && 
                    <FormControl fullWidth className={classes.field}>
                      <Query query={AREA_QUERY}>
                                {({data, loading, error}) => {
                                  if (loading) return <Loading />;
                                  if (error) return <Error error={error} />;
                                  const categories = data.area.filter(item => item.city.id == cityId).map(item => item.title); 
                                
                                return  <Autocomplete
                                          id="size-small-clearOnEsc"
                                          //clearOnEscape
                                          disableClearable
                                          size="small"
                                          getOptionLabel={option => t(`${option}`)}
                                          options={categories}
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
                    }
                    <FormControl fullWidth className={classes.field}>
                      <TextField
                        multiline
                        rows="4"
                        label={t("Description*")}
                        placeholder={t("Add Description")}
                        onChange={event => setDescription(event.target.value)}
                        value={description}
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
                      />
                    </FormControl>
                    <FormControl fullWidth className={classes.field}>
                      <TextField
                      label={t("Facebook account")}
                      placeholder={t("Add facebook account")}
                      onChange={(event) => setFacebook(event.target.value)}
                      value={facebook}
                      variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth className={classes.field}>
                      <TextField
                      label={t("Instagram account")}
                      placeholder={t("Add instagram account")}
                      onChange={(event) => setInstagram(event.target.value)}
                      value={instagram}
                      variant="outlined"
                      />
                    </FormControl>
{/*                <h5>{t("Select relevant services")}</h5>
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
                                onChange={(event,value) => {
                                  setNailsCategories(data.nailsCat.filter(item => value.includes(item.title)).map(item => item.id))
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} 
                                  variant="outlined" 
                                  label={("Nails categories")} 
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
                      checked={female}
                      color="primary"
                      onChange={() => {
                        setFemale(!female);
                      }}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <h4> {t("Male")} </h4>
                    <Checkbox
                      checked={male}
                      color="primary"
                      onChange={() => {
                        setMale(!male);
                      }}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </Box>
                  <h5>{t("Upload photo of your workplace or services provided. Visitors will be able to see your photos while reviewing your salon")}</h5>
                  <FormControl fullWidth className={classes.field} error={Boolean(fileError)}>
                    <input
                      id="photoMain"
                      required
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhotoMainChange}
                    />
                    <label htmlFor="photoMain" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={img0 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Main photo*")}
                      </Button>
                      {img0 && img0.name}
                      <FormHelperText>{fileError.sizeError0}</FormHelperText>
                      {imgThumb.img0 && <img src={imgThumb.img0} className={classes.imgThumb} />}   
                    </label>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo1"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhoto1Change}
                    />
                    <label htmlFor="photo1" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo1 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 1")}
                      </Button>
                      {photo1 && photo1.name}
                      <FormHelperText>{fileError.sizeError1}</FormHelperText>
                      {imgThumb.img1 && <img src={imgThumb.img1} className={classes.imgThumb} />}   
                    </label>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo2"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhoto2Change}
                    />
                    <label htmlFor="photo2" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo2 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 2")}
                      </Button>
                      {photo2 && photo2.name}
                      <FormHelperText>{fileError.sizeError2}</FormHelperText>
                      {imgThumb.img2 && <img src={imgThumb.img2} className={classes.imgThumb} />}   
                    </label>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo3"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhoto3Change}
                    />
                    <label htmlFor="photo3" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo3 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 3")}
                      </Button>
                      {photo3 && photo3.name}
                      <FormHelperText>{fileError.sizeError3}</FormHelperText>
                      {imgThumb.img3 && <img src={imgThumb.img3} className={classes.imgThumb} />}   
                    </label>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo4"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhoto4Change}
                    />
                    <label htmlFor="photo4" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo4 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 4")}
                      </Button>
                      {photo4 && photo4.name}
                      <FormHelperText>{fileError.sizeError4}</FormHelperText>
                      {imgThumb.img4 && <img src={imgThumb.img4} className={classes.imgThumb} />}   
                    </label>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo5"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhoto5Change}
                    />
                    <label htmlFor="photo5" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo5 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 5")}
                      </Button>
                      {photo5 && photo5.name}
                      <FormHelperText>{fileError.sizeError5}</FormHelperText>
                      {imgThumb.img5 && <img src={imgThumb.img5} className={classes.imgThumb} />}   
                    </label>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(fileError)}>
                    <input
                      id="photo6"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      capture="camera"
                      className={classes.input}
                      onChange={handlePhoto6Change}
                    />
                    <label htmlFor="photo6" className={classes.label} >
                      <Button
                        variant="outlined"
                        size="small"
                        color={photo6 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        {t("Photo 6")}
                      </Button>
                      {photo6 && photo6.name}
                      <FormHelperText>{fileError.sizeError6}</FormHelperText>
                      {imgThumb.img6 && <img src={imgThumb.img6} className={classes.imgThumb} />}   
                    </label>
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
                                    setName("");
                                    setAddress("");
                                   }}
                    className={classes.cancel}
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
                      !description.trim() ||
                      !img0
                    }
                    type="submit"
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress className={classes.save} size={24} />
                    ) : (
                      `${t("Add Salon")}`
                    )}
                  </Button>
                  </Box>
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
              {t("Salon successfully created!")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t("We will review your posting before publishing on the website.")}
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
                <Link to={`/partner/${currentUser.id}/salon/view`}>
                  {t("Return to the main page.")}
                </Link>
              </Button>
            </DialogActions>
        </Dialog> */}
      </div>

    )};

const CREATE_SALON_MUTATION = gql`
  mutation($salonData:SalonInput!) {
    createSalon(salonData: $salonData) {
      salon {
        id
        name
        address
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

export const HAIR_QUERY = gql`
{
    hairCat{
        id
        title
    }
}
`;

export const NAILS_QUERY = gql`
{
    nailsCat{
        id
        title
      }
}
`;

export const HAIR_REMOVAL_QUERY = gql`
{
    hairRemovalCat{
        id
        title
      }
}
`;

export const MAKEUP_QUERY = gql`
{
    makeupCat{
        id
        title
      }
}
`;

export const MASSAGE_QUERY = gql`
{
    massageCat{
        id
        title
      }
}
`;

export const EYEBROW_QUERY = gql`
{
    eyebrowCat{
        id
        title
      }
}
`;

export const COSMETOLOGY_QUERY = gql`
{
    cosmetologyCat{
        id
        title
      }
}
`;

export const TATTOO_QUERY = gql`
{
    tattooCat{
        id
        title
      }
}
`;

export const AESTHETICS_QUERY = gql`
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
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  },
  imgThumb: {
    width:"100%"
  },
  label:{
    display:"block", 
    width:"130px"
  }
});

export default withStyles(styles)(CreateSalon);