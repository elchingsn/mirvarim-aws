import React, { useState, useRef, useEffect } from "react";
import {Link} from "react-router-dom";
import { ApolloConsumer, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from "@material-ui/core/styles"; 
import TextField from "@material-ui/core/TextField";
//import SearchIcon from "@material-ui/icons/Search";

import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";     
import Button from "components/Partials/Button.js"

import presentationStyle from "assets/jss/presentationStyle.js";
const useStyles = makeStyles(presentationStyle);

const SearchSalons = ({state, setSearchOpen, t, i18n}) =>{
    //const { t } = useTranslation(['common','alternate']);
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
    // const inputEl = useRef();
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
    const { data: data_area } = useQuery(AREA_QUERY, {variables: {location}});
    let options1 = [];
    let options2 = [];
    let options1_filtered = [];

    useEffect(() => {   
        if (data_salon) { 
          setSalonSet(data_salon.salons.filter(el => el.isPublished === true).map(el => el.name).flat(1));
          // creating array of services
          // const hairService_set = data_salon.salons.map(el => (el.hairserviceSet.map(item => item.title))).flat(1);
          // creating array of categories as alias to services
          // const hairService_set = data_salon.salons.map(el => (el.hairCategories.map(item => item.title))).flat(1);
          // const nailsService_set = data_salon.salons.map(el => (el.nailsCategories.map(item => item.title))).flat(1);
          // const hairRemovalService_set = data_salon.salons.map(el => (el.hairRemovalCategories.map(item => item.title))).flat(1);
          // const makeupService_set = data_salon.salons.map(el => (el.makeupCategories.map(item => item.title))).flat(1);
          // const massageService_set = data_salon.salons.map(el => (el.massageCategories.map(item => item.title))).flat(1);
          // const eyebrowService_set = data_salon.salons.map(el => (el.eyebrowCategories.map(item => item.title))).flat(1);
          // const cosmetologyService_set = data_salon.salons.map(el => (el.cosmetologyCategories.map(item => item.title))).flat(1);
          // const tattooService_set = data_salon.salons.map(el => (el.tattooCategories.map(item => item.title))).flat(1);
          // const aestheticsService_set = data_salon.salons.map(el => (el.aestheticsCategories.map(item => item.title))).flat(1);
          // const _search_set = [].concat(hairService_set,nailsService_set,hairRemovalService_set,makeupService_set,
          //                     massageService_set,eyebrowService_set,cosmetologyService_set,tattooService_set,aestheticsService_set);
          // const search_set = [...new Set(_search_set)];     //unique elements             
          // //if (search) { options1 = search_set.filter(el => t(el).toLowerCase().includes(search.toLowerCase()))}

          const hairService_set = ["Haircut","Blow-drying","Hair Styling","Hair Coloring","Hair Extension","Highlights/Lowlights","Hair Tinting",
          "Balayage","Ombre","Keratin Straightening","Permanent Curls","Hair Botox","Hair Lamination","Hair Spa",
          "Braids/Dreads","Bridal Hairstyle","Men Haircut","Beard/Mustache Trim","Children Haircut","Hair Treatment/Trichology"]
          const nailsService_set = ["Manicure","Pedicure","Gel Manicure","Nails Extension","Nail Design","Nail Strengthening","Gel Polish Removal",
          "Spa Treatment for Hands","Spa Treatment for Feet","Men Manicure","Men Pedicure"]
          const hairRemovalService_set = ["Laser Hair Removal","Threading","Waxing","Sugaring","IPL Hair Removal","Electrolysis Hair Removal"]
          const makeupService_set = ["Special Occasion Makeup","Wedding/Bridal Makeup","Daily Makeup","Thematic Makeup","Permanent Lip Makeup","Permanent Eyeliner",
          "Lip Blushing"]
          const massageService_set = ["Relaxing Massage","Toning Massage","Sports Massage","Aroma Therapy","Body Peeling",
          "Anti-cellulite Massage","Pregnancy Massage","Therapeutic Massage","Lymphatic Massage","Children Massage",
          "Sauna","Steam Cabin","Hammam","Pool","Hot Tube"]
          const eyebrowService_set = ["Eyebrow Shaping","Eyebrow Tinting","Eyebrow Lamination","Eyebrow Microblading","Eyebrow Tattoo","Eyebrow Microshading","Eyebrow Tattoo Removal","Eyelash Tinting",
          "Eyelash Curling","Eyelash Extension","Eyelash Lamination"]
          const cosmetologyService_set = ["Facial Cleansing for Women","Facial Cleansing for Men","Face Peeling","Cosmetic Injections","Anti-wrinkle Face Massage","Face Spa Treatment","Face Mesotherapy",
          "Hyperpigmentation Treatment","Facial Contouring","Face Biorevitalization","Face Lifting","Mole/Papilloma Removal",
          "Acne Treatment"]
          const tattooService_set = ["Tattoo","Face Piercing","Body Piercing","Ear Piercing"]
          const aestheticsService_set = ["Rhinoplasty","Lip Augmentation","Spider Vein Treatment","Scar and Stretch Mark Removal","Varicose Vein Treatment","Blepharoplasty","Ear Surgery",
          "Abdominoplasty","Face/Neck Lift","Buttock Augmentation","Liposuction","Lipofilling","Breast Augmentation",
          "Breast Reduction","Breast Lift","Hair Transplantation","Hip Sculpting","Labiaplasty"]
          const search_set = [].concat(hairService_set,nailsService_set,hairRemovalService_set,makeupService_set,
                              massageService_set,eyebrowService_set,cosmetologyService_set,tattooService_set,aestheticsService_set);
          if (search) { 
            if(search_set.some(el => t(el).toLowerCase().includes(search.toLowerCase()))) {
              options1 = search_set.filter(el => t(el).toLowerCase().includes(search.toLowerCase())).concat(salon_set.filter(el => el.toLowerCase().includes(search.toLowerCase())))
            } else if(search_set.some(el => t(`alternate::${el}`).toLowerCase().includes(search.toLowerCase()))){
              options1 = search_set.filter(el => t(`alternate::${el}`).toLowerCase().includes(search.toLowerCase())).concat(salon_set.filter(el => el.toLowerCase().includes(search.toLowerCase())))
            } else {
              options1 = search_set.filter(el => el.toLowerCase().includes(search.toLowerCase())).concat(salon_set.filter(el => el.toLowerCase().includes(search.toLowerCase())))
            }
          }
          // when search field is cleared no drop down option will be visible
          options1_filtered = options1.filter(el => !salon_set.includes(el));
          search ? setSearchOptions(options1) : setSearchOptions([]);
          if (salon_set.includes(search)) { 
            setSalonId(data_salon.salons.find(el => el.name === search).id)
          } else if (search && 
              (search_set.some(el => t(el).toLowerCase().includes(search.toLowerCase())) || search_set.some(el => t(`alternate::${el}`).toLowerCase().includes(search.toLowerCase())) )
             ) {
            setCheckedCat(options1_filtered[0])
          } else {setCheckedCat(search)}
          //autofill of 1st mathed category in search field
          //if (nailsService_set.includes(search)) {setCatValue("Hair")}
          if (hairService_set.includes(options1_filtered[0])) {
            setCatValue("Hair")
          } else if (nailsService_set.includes(options1_filtered[0])) {
            setCatValue("Nails")
          } else if (hairRemovalService_set.includes(options1_filtered[0])) {
            setCatValue("Hair Removal")
          } else if (makeupService_set.includes(options1_filtered[0])) {
            setCatValue("Makeup")
          } else if (massageService_set.includes(options1_filtered[0])) {
            setCatValue("Massage")
          } else if (eyebrowService_set.includes(options1_filtered[0])) {
            setCatValue("Eyebrow")
          } else if (cosmetologyService_set.includes(options1_filtered[0])) {
            setCatValue("Cosmetology")
          } else if (tattooService_set.includes(options1_filtered[0])) {
            setCatValue("Tattoo")
          } else if (aestheticsService_set.includes(options1_filtered[0])) {
            setCatValue("Aesthetics")
          } else {setCatValue("")}
        }
        // console.log('search',search)
        // console.log("options1",options1)
        // console.log("options1_filtered",options1_filtered)
        // console.log('catValue',catValue)
        // console.log('checkedCat',checkedCat)
    }, [search])

    useEffect(() => {   
      if (data_area) { 
          const area_set = data_area.area.map((option) => option.title);
          //console.log(area_set.map(el => t(`alternate::${el}`)))
          if (location) { 
            //options2 = area_set.filter(el => t(el).toLowerCase().includes(location.toLowerCase()))
            if(area_set.filter(el => t(el).toLowerCase().includes(location.toLowerCase())).length>0) {
              options2 = area_set.filter(el => t(el).toLowerCase().includes(location.toLowerCase()))
            } else {
              options2 = area_set.filter(el => t(`alternate::${el}`).toLowerCase().includes(location.toLowerCase())) 
            }    
          }
          //console.log('options2', options2)
          location ? setLocationOptions(options2) : setLocationOptions([]);
      }
    }, [location]);

    // console.log('search',search)
    // console.log('location',location)


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
                  //onSubmit={event=>handleSubmit(event,client)}
                >
                    <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
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
                        InputProps={{ 
                          ...params.InputProps,
                          classes: {  
                            input: classes.resize
                          }
                        }}
                        InputLabelProps={{ style: { fontSize: "0.8rem" } }}
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
                          getOptionLabel={option => t(`${option}`)}
                          options={locationOptions}
                          onChange = {(event,values) => setLocation(values)}
                          value = {location}
                          classes={{listbox: classes.listbox,
                            input: classes.input}}
                          renderInput={(params) => (
                          <TextField 
                          {...params}
                          InputProps={{ 
                            ...params.InputProps,
                            classes: {  
                              input: classes.resize
                            }
                          }}
                          InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                          onChange = {event => {
                            setLocation(event.target.value);
                            handleChange(event,client);
                          }}
                          label = {t("Location")} 
                          margin="none"
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
                          //onClick={()=>setSearchOpen(false)}
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
                              //location: location,
                              location:locationOptions[0] || location,
                              catValue: catValue,
                              checkedCat: checkedCat
                            }
                          }} > 
                            <Button
                              block
                              color="primary"
                              className={classes.button}
                              type = "submit"
                              onClick={()=> {
                                setSearchOpen(false)
                              }}
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
            isPublished
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
            id
            name
          }
        }
  }
  `;

export default withTranslation()(SearchSalons); 
