import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mutation } from '@apollo/react-components';
import { Query } from "@apollo/react-components";
import { useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";
import axios from "axios";
import Cookies from 'js-cookie';

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

import Error from "../Shared/Error"; 
import Loading from "../Shared/Loading";

//import styles from "../assets/jss/salonDetailStyle.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const CreateSalon = ({classes}) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [cityId, setCityId] = useState("");
    const [areaId, setAreaId] = useState("");
    const [description, setDescription] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [masters, setMasters] = useState(1);
    const [hairCategories, setHairCategories] = useState([]);
    const [nailsCategories, setNailsCategories] = useState([]);
    const [hairRemovalCategories, setHairRemovalCategories] = useState([]);
    const [makeupCategories, setMakeupCategories] = useState("");
    const [massageCategories, setMassageCategories] = useState("");
    const [male, setMale] = useState(false);
    const [female, setFemale] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [img0, setImg0] = useState("");
    const [photo1, setPhoto1] = useState("");
    const [photo2, setPhoto2] = useState("");
    const [photo3, setPhoto3] = useState("");
    const [photo4, setPhoto4] = useState("");
    const [photo5, setPhoto5] = useState("");
    const [photo6, setPhoto6] = useState("");

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
        console.log(uploadedUrl)
      }

      console.log( name, address, cityId, areaId, description, priceRange, masters,
        hairCategories, nailsCategories, male, female, email, phone, uploadedUrl[0],
        uploadedUrl[1], uploadedUrl[2], uploadedUrl[3],
        uploadedUrl[4], uploadedUrl[5], uploadedUrl[6] );
      createSalon({variables: {
                   salonData: {
                      name, address, cityId, areaId, description, priceRange, masters,
                      hairCategories, nailsCategories, male, female, email, phone, photoMain: uploadedUrl[0],
                      photo1: uploadedUrl[1], photo2: uploadedUrl[2], photo3: uploadedUrl[3],
                      photo4: uploadedUrl[4], photo5: uploadedUrl[5], photo6: uploadedUrl[6] 
                  }}});
    };

    return(
      <div className={classes.container}>
        <Paper className={classes.paper}>
            <Typography variant="headline">Add Salon</Typography>
            <Mutation
              mutation={CREATE_SALON_MUTATION}
              onCompleted={data => {
              console.log({ data });
              setSubmitting(false);
              setOpen(true);
              }}
              // update={handleUpdateCache}
              // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
            >
              {(createSalon, { loading, error }) => {
              if (error) return <Error error={error} />;
                return(
                  <form onSubmit={event => handleSubmit(event, createSalon)}>
                    <FormControl fullWidth>
                      <TextField
                      label="Name"
                      placeholder="Add Name"
                      onChange={event => setName(event.target.value)}
                      value={name}
                      className={classes.textField}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                      label="Address"
                      placeholder="Add Address"
                      onChange={event => setAddress(event.target.value)}
                      value={address}
                      className={classes.textField}
                      />
                    </FormControl>
                    <FormControl fullWidth>
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
                                          onChange={(event,value) => {
                                            // it returns the id of the selected city in the City model
                                            setCityId(data.city.filter(item => item.title == value)[0].id); 
                                          }}
                                          renderInput={(params) => (
                                            <TextField {...params} 
                                            variant="standard" 
                                            label="City" 
                                            // margin="normal" 
                                            className={classes.textField}
                                            />
                                          )}
                                        />;
                                      }}
                      </Query>
                    </FormControl>
                    <FormControl fullWidth>
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
                                          onChange={(event,value) => {
                                            //it returns nested city instance data->city->id,title
                                            // setArea({...data, area: data.area.filter(item => item.title == value)});
                                            setAreaId(data.area.filter(item => item.title == value)[0].id); 
                                          }}
                                          renderInput={(params) => (
                                            <TextField {...params} 
                                            variant="standard" 
                                            label="Location" 
                                            // margin="normal" 
                                            className={classes.textField}
                                            />
                                          )}
                                        />;
                                      }}
                      </Query>
                    </FormControl>
                    <FormControl fullWidth>
                    <TextField
                      multiline
                      rows="4"
                      label="Description"
                      placeholder="Add Description"
                      onChange={event => setDescription(event.target.value)}
                      value={description}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <NativeSelect
                      value={priceRange}
                      onChange={event => {
                        setPriceRange(parseInt(event.target.value));
                        console.log(priceRange);}}
                      name="priceRange"
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'priceRange' }}
                    >
                      <option value="1">$</option>
                      <option value="2">$$</option>
                      <option value="3">$$$</option>
                      <option value="4">$$$$</option>
                    </NativeSelect>
                  </FormControl>
                  <FormControl fullWidth>
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
                                onChange={(event,value) => {
                                          // setHairCategories({...data, hairCat: data.hairCat.filter(item => value.includes(item.title))});
                                          setHairCategories(data.hairCat.filter(item => value.includes(item.title)).map(item => item.id))
                                          console.log(hairCategories)
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} 
                                  variant="standard" 
                                  label="Hircut categories " 
                                  placeholder="More haircut" />
                                )}
                              />;
                      }}
                    </Query>
                  </FormControl>
                  <FormControl fullWidth>
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
                                onChange={(event,value) => {
                                  setNailsCategories(data.nailsCat.filter(item => value.includes(item.title)).map(item => item.id))
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} 
                                  variant="standard" 
                                  label="Nails categories " 
                                  placeholder="More nails" />
                                )}
                              />;
                            }}
                      </Query>
                  </FormControl>
                  <FormControl error={Boolean(fileError)}>
                    <input
                      id="photoMain"
                      required
                      type="file"
                      accept="image/*"
                      className={classes.input}
                      onChange={handlePhotoMainChange}
                    />
                    <label htmlFor="photoMain">
                      <Button
                        variant="outlined"
                        color={img0 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        Main photo
                      </Button>
                      {img0 && img0.name}
                      <FormHelperText>{fileError}</FormHelperText>
                    </label>
                  </FormControl>
                  <FormControl error={Boolean(fileError)}>
                    <input
                      id="photo1"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      className={classes.input}
                      onChange={handlePhoto1Change}
                    />
                    <label htmlFor="photo1">
                      <Button
                        variant="outlined"
                        color={photo1 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        Photo 1
                      </Button>
                      {photo1 && photo1.name}
                      <FormHelperText>{fileError}</FormHelperText>
                    </label>
                  </FormControl>
                  <FormControl error={Boolean(fileError)}>
                    <input
                      id="photo2"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      className={classes.input}
                      onChange={handlePhoto2Change}
                    />
                    <label htmlFor="photo2">
                      <Button
                        variant="outlined"
                        color={photo2 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        Photo 2
                      </Button>
                      {photo2 && photo2.name}
                      <FormHelperText>{fileError}</FormHelperText>
                    </label>
                  </FormControl>
                  <FormControl error={Boolean(fileError)}>
                    <input
                      id="photo3"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      className={classes.input}
                      onChange={handlePhoto3Change}
                    />
                    <label htmlFor="photo3">
                      <Button
                        variant="outlined"
                        color={photo3 ? "secondary" : "inherit"}
                        component="span"
                        className={classes.button}
                      >
                        Photo 3
                      </Button>
                      {photo3 && photo3.name}
                      <FormHelperText>{fileError}</FormHelperText>
                    </label>
                  </FormControl>
                  <FormControl fullWidth>
                  <Button
                    disabled={submitting}
                    onClick={() => {
                                    setName("");
                                    setAddress("");
                                   }}
                    className={classes.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting ||
                      !name.trim() ||
                      !address.trim() ||
                      !cityId ||
                      !areaId ||
                      !priceRange ||
                      !description.trim() ||
                      !img0
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
                  </FormControl>
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
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
});


export default withStyles(styles)(CreateSalon);