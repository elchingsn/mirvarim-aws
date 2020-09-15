// noValidate in the form ignores required html input fields in the form
import React, { useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
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

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const UpdateSalon = ({classes}) => {
    //query the salon data updated by the current user
    const currentUser = useContext(UserContext);
    if (!currentUser.salonSet[0]) {
      return <div> No salon added. Please add a salon</div>
  } else {
    return <UpdateSalonForm classes={classes} currentUser={currentUser} />
  }
};

const UpdateSalonForm = ({classes, currentUser}) => {
  const userId = currentUser.id;
  const data_salon = currentUser.salonSet[0];
  const salonId = data_salon.id;
  //const { data: data_user } = useQuery(PROFILE_QUERY, {variables: {id:userId}});
  console.log('update salon user', currentUser);
  const history = useHistory();

  const [name, setName] = useState(data_salon.name);
  const [address, setAddress] = useState(data_salon.address);
  const [cityId, setCityId] = useState(data_salon.city.id);
  const [areaId, setAreaId] = useState(data_salon.area.id);
  const [description, setDescription] = useState(data_salon.description);
  const [priceRange, setPriceRange] = useState(2);
  const [masters, setMasters] = useState(1);
  const [hairCategories, setHairCategories] = useState(data_salon.hairCategories.map(item => item.id).flat(1));
  const [nailsCategories, setNailsCategories] = useState(data_salon.nailsCategories.map(item => item.id).flat(1));
  const [hairRemovalCategories, setHairRemovalCategories] = useState(data_salon.hairRemovalCategories.map(item => item.id).flat(1));
  const [makeupCategories, setMakeupCategories] = useState(data_salon.makeupCategories.map(item => item.id).flat(1));
  const [massageCategories, setMassageCategories] = useState(data_salon.massageCategories.map(item => item.id).flat(1));
  const [cosmetologyCategories, setCosmetologyCategories] = useState(data_salon.cosmetologyCategories.map(item => item.id).flat(1));
  const [eyebrowCategories, setEyebrowCategories] = useState(data_salon.eyebrowCategories.map(item => item.id).flat(1));
  const [tattooCategories, setTattooCategories] = useState(data_salon.tattooCategories.map(item => item.id).flat(1));
  const [aestheticsCategories, setAestheticsCategories] = useState(data_salon.aestheticsCategories.map(item => item.id).flat(1));
  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [img0, setImg0] = useState(`${data_salon.photoMain}`);
  const [photo1, setPhoto1] = useState(data_salon.photo1 ? `${data_salon.photo1}` : "");
  const [photo2, setPhoto2] = useState(data_salon.photo2 ? `${data_salon.photo2}` : "");
  const [photo3, setPhoto3] = useState(data_salon.photo3 ? `${data_salon.photo3}` : "");
  const [photo4, setPhoto4] = useState(data_salon.photo4 ? `${data_salon.photo4}` : "");
  const [photo5, setPhoto5] = useState(data_salon.photo5 ? `${data_salon.photo5}` : "");
  const [photo6, setPhoto6] = useState(data_salon.photo6 ? `${data_salon.photo6}` : "");
  console.log('data photo1', data_salon.photo1, 'photo1', photo1)
  console.log('massage',massageCategories);

  const [disabled, setDisabled] = useState(true)
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

  const dt = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '/' );

  const [uploadImg] = useMutation(FILE_MUTATION);

  const handlePhotoMainChange = event => {
    console.log(event.target.files);
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 1000000; // 1mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`);
    } else {
      setImg0(selectedFile);
      console.log(selectedFile);
      setFileError("");
    }
  };

  const handlePhoto1Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 1000000; // 1mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`);
    } else {
      setPhoto1(selectedFile);
      setFileError("");
    }
  };

  const handlePhoto2Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 1000000; // 1mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`);
    } else {
      setPhoto2(selectedFile);
      setFileError("");
    }
  };

  const handlePhoto3Change = event => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 1000000; // 1mb
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`);
    } else {
      setPhoto3(selectedFile);
      setFileError("");
    }
  };

  const handleImageUpload = async (img) => {
    try {
      const res = await uploadImg({variables:{file: img}});
      console.log(res);
      return res.data.uploadImg.url;
    } catch (err) {
      console.error("Error uploading file", err);
      setSubmitting(false);
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
      console.log(uploadedUrl)
    }

    console.log( salonId, name, address, cityId, areaId, description, priceRange, masters, hairCategories, nailsCategories,
      hairRemovalCategories, makeupCategories, massageCategories, eyebrowCategories, cosmetologyCategories,
      tattooCategories, aestheticsCategories,
      male, female, email, phone, uploadedUrl[0],
      uploadedUrl[1], uploadedUrl[2], uploadedUrl[3],
      uploadedUrl[4], uploadedUrl[5], uploadedUrl[6] );
    console.log('massage', massageCategories)
    updateSalon({variables: {
                 salonData: {
                    name, address, cityId, areaId, description, priceRange, masters, hairCategories, nailsCategories, 
                    hairRemovalCategories, makeupCategories, massageCategories, eyebrowCategories, cosmetologyCategories,
                    tattooCategories, aestheticsCategories, male, female, email, phone, photoMain: img0,
                    photo1: uploadedUrl[1], photo2: uploadedUrl[2], photo3: uploadedUrl[3],
                    photo4: uploadedUrl[4], photo5: uploadedUrl[5], photo6: uploadedUrl[6] 
                }, salonId}}).catch(err => {
                  console.error(err);
                  history.push('/login');
                });
  };

  return(
    <div className={classes.container}>
      <Paper className={classes.paper}>
          <h3>Update Salon</h3>
          <Mutation
            mutation={UPDATE_SALON_MUTATION}
            onCompleted={data => {
            console.log({ data });
            setSubmitting(false);
            setOpen(true);
            }}
            // update={handleUpdateCache}
            refetchQueries={() => [{ query: ME_QUERY, variables: {id:currentUser.id} }]}
            >
            {(updateSalon, { loading, error }) => {
            if (error) return <Error error={error} />;
              return(
                <form onSubmit={event => handleSubmit(event, updateSalon)} >
                  <FormControl fullWidth className={classes.field}>
                    <TextField
                    label="Name"
                    placeholder="Add Name"
                    onChange={event => setName(event.target.value)}
                    value={name}
                    variant="outlined"
                    disabled={disabled}
                    // className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth className={classes.field}>
                    <TextField
                    label="Address"
                    placeholder="Add Address"
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
                                        clearOnEscape
                                        size="small"
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
                                          label="City" 
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
                                const categories = data.area.map(item => item.title); 
                              
                              return  <Autocomplete
                                        id="size-small-clearOnEsc"
                                        clearOnEscape
                                        size="small"
                                        options={categories}
                                        disabled={disabled}
                                        defaultValue={data.area.filter(item => item.id == areaId)[0].title}
                                        onChange={(event,value) => {
                                          //it returns nested city instance data->city->id,title
                                          // setArea({...data, area: data.area.filter(item => item.title == value)});
                                          setAreaId(data.area.filter(item => item.title == value)[0].id); 
                                        }}
                                        renderInput={(params) => (
                                          <TextField {...params} 
                                          variant="outlined" 
                                          label="Location" 
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
                    label="Description"
                    placeholder="Add Description"
                    onChange={event => setDescription(event.target.value)}
                    value={description}
                    disabled={disabled}
                    variant="outlined"
                    // className={classes.textField}
                  />
                </FormControl>
                {/* <FormControl fullWidth>
                  <NativeSelect
                    value={priceRange}
                    onChange={event => {
                      setPriceRange(parseInt(event.target.value));
                      console.log(priceRange);}}
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
                <h5>Select relevant services</h5>
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={hairCategories.map(catId => data.hairCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                        // setHairCategories({...data, hairCat: data.hairCat.filter(item => value.includes(item.title))});
                                        setHairCategories(data.hairCat.filter(item => value.includes(item.title)).map(item => item.id))
                                        console.log(hairCategories)
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Haircut categories " 
                                placeholder="More haircut"
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={nailsCategories.map(catId => data.nailsCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setNailsCategories(data.nailsCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Nails categories " 
                                placeholder="More nails" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={hairRemovalCategories.map(catId => data.hairRemovalCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setHairRemovalCategories(data.hairRemovalCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Hair removal categories " 
                                placeholder="More hair removal" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={makeupCategories.map(catId => data.makeupCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setMakeupCategories(data.makeupCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Makeup categories " 
                                placeholder="More makeup" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={massageCategories.map(catId => data.massageCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setMassageCategories(data.massageCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Massage categories " 
                                placeholder="More massage" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={eyebrowCategories.map(catId => data.eyebrowCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setEyebrowCategories(data.eyebrowCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Eyebrow categories " 
                                placeholder="More eyebrow" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={cosmetologyCategories.map(catId => data.cosmetologyCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {                              
                                setCosmetologyCategories(data.cosmetologyCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Cosmetology categories " 
                                placeholder="More cosmetology" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={tattooCategories.map(catId => data.tattooCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setTattooCategories(data.tattooCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Tattoo categories " 
                                placeholder="More tattoo" />
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
                              options={categories}
                              disabled={disabled}
                              defaultValue={aestheticsCategories.map(catId => data.aestheticsCat.filter(item => item.id == catId)[0].title)}
                              onChange={(event,value) => {
                                setAestheticsCategories(data.aestheticsCat.filter(item => value.includes(item.title)).map(item => item.id))
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Aesthetics categories " 
                                placeholder="More aesthetics" />
                              )}
                            />;
                          }}
                    </Query>
                </FormControl>
                <FormControl fullWidth className={classes.field} error={Boolean(fileError)}>
                  <input
                    id="photoMain"
                    type="file"
                    accept="image/*"
                    disabled={disabled}
                    className={classes.input}
                    onChange={handlePhotoMainChange}
                  />
                  <label htmlFor="photoMain">
                    <Button
                      variant="outlined"
                      size="small"
                      color={img0 ? "secondary" : "inherit"}
                      component="span"
                      className={classes.button}
                    >
                      Main photo
                    </Button>
                    {img0 ? img0.name : '\xa0\xa0'+data_salon.photoMain.split('/').pop()}
                    <FormHelperText>{fileError}</FormHelperText>
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
                  <label htmlFor="photo1">
                    <Button
                      variant="outlined"
                      size="small"
                      color={photo1 ? "secondary" : "inherit"}
                      component="span"
                      className={classes.button}
                    >
                      Photo 1
                    </Button>
                    {photo1 ? photo1.name : '\xa0\xa0'+data_salon.photo1.split('/').pop()}
                    <FormHelperText>{fileError}</FormHelperText>
                  </label>
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
                  <label htmlFor="photo2">
                    <Button
                      variant="outlined"
                      size="small"
                      color={photo2 ? "secondary" : "inherit"}
                      component="span"
                      className={classes.button}
                    >
                      Photo 2
                    </Button>
                    {photo2 ? photo2.name : '\xa0\xa0'+data_salon.photo2.split('/').pop()}
                    <FormHelperText>{fileError}</FormHelperText>
                  </label>
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
                  <label htmlFor="photo3">
                    <Button
                      variant="outlined"
                      size="small"
                      color={photo3 ? "secondary" : "inherit"}
                      component="span"
                      className={classes.button}
                    >
                      Photo 3
                    </Button>
                    {photo3 ? photo3.name : '\xa0\xa0'+data_salon.photo3.split('/').pop()}
                    <FormHelperText>{fileError}</FormHelperText>
                  </label>
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
                    <Link to={`/partner/${salonId}`}>
                      <Button
                        disabled={submitting}
                        variant="outlined"
                        className={classes.cancel}
                      >
                        Cancel
                      </Button>
                    </Link>
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
      {/* Success Dialog */}
        <Dialog
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
        >
          <DialogTitle>
            Salon successfully updated!
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              We will review your changes before publishing on the website.
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
              <Link to={`/partner/${userId}/salon/browse`}>
                Return to the main.
              </Link>
            </Button>
          </DialogActions>
      </Dialog>
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
        salonSet{
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
  }
});


export default withStyles(styles)(UpdateSalon);