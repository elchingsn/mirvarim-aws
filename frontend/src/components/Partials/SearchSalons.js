import React, { useState, useRef, useEffect } from "react";
import {Link} from "react-router-dom";
import { ApolloConsumer, useApolloClient, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from 'react-i18next';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from "@material-ui/core/styles"; 
// import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
// import Paper from "@material-ui/core/Paper";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

import GridContainer from "./GridContainer.js";
import GridItem from "./GridItem.js";     
import Button from "./Button.js"
import CustomInput from "./CustomInput.js"; 

import presentationStyle from "../../assets/jss/presentationStyle.js";
const useStyles = makeStyles(presentationStyle);

const SearchSalons = ({state, setSearchOpen}) =>{
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    //needed to pass search field values from home page to search component of salon page
    // const [search, setSearch] = useState(state["search"]);
    // const [location, setLocation] = useState(state["location"]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [catValue, setCatValue] = useState("");
    const [checkedCat, setCheckedCat] = useState("");
    const [salon_set, setSalonSet] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [salonId, setSalonId] = useState("0");
    const inputEl = useRef();
    // state from footer panel

    useEffect(() => {
      if (state) {
        setLocation(state["location"])
        setSearch(state["search"])        
      }
    }, [state]);
    

    // setSearchResults is passed down as a prop
    // const clearSearchInput = () => {
    //     setSearchResults([]);
    //     setSearch("");
    //     inputEl.current.focus();
    //   };

    // const handleSubmit = async (event, client) => {
    //     event.preventDefault();
    //     const submitResults = await client.query({
    //         query: SEARCH_SALONS_QUERY,
    //         variables: {search}
    //     });
    //     client.writeData({data: {search: {search}}});
    //     console.log('search salons', submitResults.data.salons);
    //     setSearchResults(submitResults.data.salons);
    //     };

    // const refValue = useRef(search);
    // useEffect(() => {
    //     refValue.current = search;
    // });
    
    const handleChange = async (event, client) => {
        event.preventDefault(); 
    };

    //const { data: data_salon } = useQuery(SEARCH_SALONS_QUERY, {variables: {search}});
    const { data: data_salon } = useQuery(SEARCH_SALONS_QUERY);
    console.log(data_salon);
    const { data: data_area } = useQuery(AREA_QUERY, {variables: {location}});
    let options = [];

    useEffect(() => {   
        if (data_salon) { 
          setSalonSet(data_salon.salons.map(el => el.name).flat(1));
          // creating array of services
          // const hairService_set = data_salon.salons.map(el => (el.hairserviceSet.map(item => item.title))).flat(1);
          // creating array of categories as alias to services
          const hairService_set = data_salon.salons.map(el => (el.hairCategories.map(item => item.title))).flat(1);
          const nailsService_set = data_salon.salons.map(el => (el.nailsCategories.map(item => item.title))).flat(1);
          const hairRemovalService_set = data_salon.salons.map(el => (el.hairRemovalCategories.map(item => item.title))).flat(1);
          const makeupService_set = data_salon.salons.map(el => (el.makeupCategories.map(item => item.title))).flat(1);
          const massageService_set = data_salon.salons.map(el => (el.massageCategories.map(item => item.title))).flat(1);
          const eyebrowService_set = data_salon.salons.map(el => (el.eyebrowCategories.map(item => item.title))).flat(1);
          const cosmetologyService_set = data_salon.salons.map(el => (el.cosmetologyCategories.map(item => item.title))).flat(1);
          const tattooService_set = data_salon.salons.map(el => (el.tattooCategories.map(item => item.title))).flat(1);
          const aestheticsService_set = data_salon.salons.map(el => (el.aestheticsCategories.map(item => item.title))).flat(1);
          const search_set = [].concat(salon_set,hairService_set,nailsService_set,hairRemovalService_set,makeupService_set,
                              massageService_set,eyebrowService_set,cosmetologyService_set,tattooService_set,aestheticsService_set);
          if (search) { options = search_set.filter(el => el.toLowerCase().includes(search.toLowerCase()))};
          console.log(search);
          console.log(searchOptions);
          // when search field is cleared no drop down option will be visible
          search ? setSearchOptions(options) : setSearchOptions([]);
          if (salon_set.includes(search)) 
            {setSalonId(data_salon.salons.find(el => el.name === search).id)}
          else {setCheckedCat(search)}
          if (hairService_set.includes(search)) {setCatValue("Hair")}
          if (nailsService_set.includes(search)) {setCatValue("Nails")}
          if (hairRemovalService_set.includes(search)) {setCatValue("Hair Removal")}
          if (makeupService_set.includes(search)) {setCatValue("Makeup")}
          if (massageService_set.includes(search)) {setCatValue("Massage")}
          if (eyebrowService_set.includes(search)) {setCatValue("Eyebrow")}
          if (cosmetologyService_set.includes(search)) {setCatValue("Cosmetology")}
          if (tattooService_set.includes(search)) {setCatValue("Tattoo")}
          if (aestheticsService_set.includes(search)) {setCatValue("Aesthetics")}
        };
    }, [search]);

    useEffect(() => {   
      if (data_area) { 
          const options = data_area.area.map((option) => option.title);
          setLocationOptions(options);
      };
    }, [data_area]);


    // const handleChange = (event, client) => {
    //     event.preventDefault();
    //     let p1 = new Promise(
    //         (resolve, reject) =>  {
    //             setSearch(event.target.value);
    //             console.log(event.target.value);
    //         })
    //     p1.then( async () => {
    //         const changeResults = await client.query({
    //             query: SEARCH_SALONS_QUERY,
    //             variables: {search}
    //         });
    //         setSearchResults(changeResults.data.salons);
    //         // const options = changeResults.data.salons.map ((option) => option.name);
    //         // setAutoptions(options);
    //         console.log(changeResults.data.salons);
    //     }).catch(
    //         // Log the rejection reason
    //        (reason) => {
    //             console.log('Handle rejected promise ('+reason+') here.');
    //     });
    // };

    return(
        <ApolloConsumer>
            {client => (                   
                <form 
                // onSubmit={event=>handleSubmit(event,client)}
                >
                    <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                        {/* <CustomInput
                        id="name"
                        inputProps={{
                            placeholder: "Find service or salon"
                        }}
                        formControlProps={{
                            fullWidth: true,
                            className: classes.formControl
                        }} 
                        onChange={event => {
                            console.log(event.target.value);
                            return (
                                setSearch(event.target.value)
                            )
                        }}
                        value={search}
                        inputRef={inputEl}
                        /> */}
                        <Autocomplete
                        id="search"
                        freeSolo
                        size="small"
                        getOptionLabel={option => t(`${option}`)}
                        options={searchOptions}
                        onChange = {(event,values) => setSearch(values)}
                        value = {search}
                        classes={{listbox:classes.listbox,
                                input: classes.input}}
                        renderInput={(params) => (
                        <TextField 
                        {...params} 
                        onChange = {event => {
                            setSearch(event.target.value);
                            handleChange(event,client);
                        }}
                        label = {t("Find service or salon")}
                        margin="none" />
                        )}
                         />
                    </GridItem>
                    <GridItem xs={12} sm={4} md={4}>
                        {/* <CustomInput
                        id="location"
                        inputProps={{
                            placeholder: "Location"
                        }}
                        formControlProps={{
                            fullWidth: true,
                            className: classes.formControl
                        }}
                        /> */}
                        <Autocomplete
                        id="location"
                        freeSolo
                        size="small"
                        classes={{listbox: classes.listbox,
                          option: classes.input}}
                        getOptionLabel={option => t(`${option}`)}
                        options={locationOptions}
                        onChange = {(event,values) => setLocation(values)}
                        value = {location}
                        renderInput={(params) => (
                        <TextField 
                        {...params}
                        margin="none"
                        onChange = {event => {
                          setLocation(event.target.value);
                          handleChange(event,client);
                        }}
                        label = {t("Location")} 
                        />
                        )}
                         />
                    </GridItem>
                    <GridItem xs={12} sm={2} md={2}>
                      {(salon_set.includes(search)) ?
                        (<Link 
                          to={{
                            pathname: `/salon/${salonId}`,
                            state: {
                              search: search,
                              location: location
                            }
                          }} > 
                          <Button
                          block
                          color="primary"
                          className={classes.button}
                          type = "submit"
                          // onClick={event=>
                          //   {
                          //   handleSubmit(event,client);
                          //   window.location.href="/salon";
                          // }}
                          onClick={()=>setSearchOpen(false)}
                          >
                            {t("Search")}
                          </Button>
                        </Link> ) :
                        (<Link 
                          style={{color: "white"}}
                          to={{
                            pathname: "/salon",
                            state: {
                              search: search,
                              location: location,
                              catValue: catValue,
                              checkedCat: checkedCat
                            }
                          }} > 
                            <Button
                              block
                              color="primary"
                              className={classes.button}
                              type = "submit"
                              onClick={()=>setSearchOpen(false)}
                              >
                              {t("Search")}
                            </Button>
                        </Link>
                      )}
                    </GridItem>
                    </GridContainer>
                </form>
             )}
        </ApolloConsumer>
    );

   
};
    
const SEARCH_SALONS_QUERY = gql`
    query SEARH_SALON_OR_SERVICE {
        salons {
            id
            name
            city {
              id
              title
            }
            rating
            priceRange
            photoMain
            hairCategories {
              id
              title
            }
            nailsCategories {
              id
              title
            }
            hairRemovalCategories {
              id
              title
            }
            makeupCategories {
              id
              title
            }
            massageCategories {
              id
              title
            }
            eyebrowCategories {
              id
              title
            }
            cosmetologyCategories {
              id
              title
            }
            tattooCategories {
              id
              title
            }
            aestheticsCategories {
              id
              title
            }
            hairserviceSet {
              id
              title
            }
            nailsserviceSet {
              id
              title
            }
        }
    }
`;

const AREA_QUERY = gql`
    query($search:String) {
      area (search: $search) {
          id
          title
          salonSet{
            name
          }
        }
  }
  `;


export default SearchSalons; 

 // return (
    //     <ApolloConsumer>
    //         {client => (
    //             <form onSubmit={event => handleSubmit(event, client)}>
    //             <Paper className={classes.root} elevation={1}>
    //                 <IconButton onClick={clearSearchInput}>
    //                 <ClearIcon />
    //                 </IconButton>
    //                 <TextField
    //                 fullWidth
    //                 placeholder="Search All Salons"
    //                 InputProps={{
    //                     disableUnderline: true
    //                 }}
    //                 onChange={event => setSearch(event.target.value)}
    //                 value={search}
    //                 inputRef={inputEl}
    //                 />
    //                 <IconButton type="submit">
    //                 <SearchIcon />
    //                 </IconButton>
    //             </Paper>
    //             </form>
    //         )}
    //     </ApolloConsumer>
    // );

    // const styles = theme => ({
//     root: {
//       padding: "2px 4px",
//       margin: theme.spacing.unit,
//       display: "flex",
//       alignItems: "center"
//     }
//   });
  
//   export default withStyles(styles)(SearchSalons);