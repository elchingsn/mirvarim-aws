import React, {useState, useEffect} from "react";
import { Query } from "@apollo/react-components";
import { ApolloConsumer, useApolloClient, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
// nodejs library that concatenates classes
import classNames from "classnames";
// plugin that creates slider
import Slider from "nouislider";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"; 
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from '@material-ui/core/Divider';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Pagination from '@material-ui/lab/Pagination';
// @material-ui icons
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Cached from "@material-ui/icons/Cached";
import Subject from "@material-ui/icons/Subject";
import Check from "@material-ui/icons/Check";

// core components
import FilterListings from "./FilterListings";
import Accordion from "./Accordion.js";
import GridContainer from "./GridContainer.js";
import GridItem from "./GridItem.js";
import Card from "./Card.js";
import CardHeader from "./CardHeader.js";
import CardBody from "./CardBody.js";
import CardFooter from "./CardFooter.js";
import Button from "./Button.js";
import Clearfix from "./Clearfix.js";

import salonImage from "../../assets/img/salon1.jpeg"
// import color1 from "assets/img/examples/color1.jpg";
// import color3 from "assets/img/examples/color3.jpg";
// import color2 from "assets/img/examples/color2.jpg";
// import dg3 from "assets/img/dg3.jpg";
// import dg1 from "assets/img/dg1.jpg";

import styles from "../../assets/jss/filterStyle.js";
import { node } from "prop-types";

const useStyles = makeStyles(styles);

export default function Filter({initCatValue, initCheckedCat}) {
  const [area, setArea] = useState([]);
  const [hair, setHair] = useState([]);
  const [nails, setNails] = useState([]);
  const [hairRemoval, setHairRemoval] = useState([]);
  const [makeup, setMakeup] = useState([]);
  const [massage, setMassage] = useState([]);
  
  const [areaSelected, setAreaSelected] = useState(0);
  const [hairSelected, setHairSelected] = useState(0);
  const [nailsSelected, setNailsSelected] = useState(0);
  const [hairRemovalSelected, setHairRemovalSelected] = useState(0);
  const [makeupSelected, setMakeupSelected] = useState(0);
  const [massageSelected, setMassageSelected] = useState(0);

  const [areaTitle, setAreaTitle] = useState("Area");
  const [hairTitle, setHairTitle] = useState("Hair Services");
  const [nailsTitle, setNailsTitle] = useState("Nails Services");

  const [catValue, setCatValue] = useState(initCatValue);
  const [catDisplay, setCatDisplay] = useState(true);
  const [checkedCat, setCheckedCat] = useState(initCheckedCat);

  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage, setSalonsPerPage] = useState(3);
  const [count, setCount] = useState(1);
  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;

  // const { data:area_data } = useQuery(AREA_QUERY);
  // const { data:hair_data } = useQuery(HAIR_QUERY);
  // const { data:nails_data } = useQuery(NAILS_QUERY);

  // React.useEffect(() => {
  //   if (area_data) {setArea(area_data.area.map(item => item.title))}
  //   if (hair_data) {setHair(hair_data.hairCat.map(item => item.title))}
  //   if (nails_data) {setNails(nails_data.nailsCat.map(item => item.title))}
  // },[area_data, hair_data, nails_data])

  // console.log(area);
  // console.log(hair);
  // console.log(nails);

  useEffect(() => {
    if(initCatValue) {setCatDisplay(false)}
  },[])
  
  React.useEffect(() => {
    (areaSelected)? setAreaTitle(`Area (${areaSelected} selected)`) : setAreaTitle("Area");
  }, [areaSelected]);

  React.useEffect(() => {
    (hairSelected)? setHairTitle(`Hair Services (${hairSelected} selected)`) : setHairTitle("Hair Services");
  }, [hairSelected]);

  React.useEffect(() => {
    (nailsSelected)? setNailsTitle(`Nails Services (${nailsSelected} selected)`) : setNailsTitle("Nails Services");
  }, [nailsSelected]);

  const handleCatChange = event => {
    setCatValue(event.target.value);
    setTimeout(() => setCatDisplay(false), 1000);
    setCurrentPage(1);
  };

  const handlePageChange = (event,value) => {
    setCurrentPage(value)
  } 
  
  // const [priceRange, setPriceRange] = React.useState([101, 790]);
  // React.useEffect(() => {
  //   if (
  //     !document
  //       .getElementById("sliderRegular")
  //       .classList.contains("noUi-target")
  //   ) {
  //     Slider.create(document.getElementById("sliderRegular"), {
  //       start: priceRange,
  //       connect: true,
  //       range: { min: 30, max: 900 },
  //       step: 1
  //     }).on("update", function(values) {
  //       setPriceRange([Math.round(values[0]), Math.round(values[1])]);
  //     });
  //   }
  //   return function cleanup() {};
  // });

  const {data} = useQuery(FILTERED_SALONS_QUERY, {variables:{area, hair, nails}});
    
  const handleCatToggle = value => {
    const currentIndex = checkedCat.indexOf(value);
    const newCheckedCat = [...checkedCat];
    if (currentIndex === -1) {
      newCheckedCat.push(value);
    } else {
      newCheckedCat.splice(currentIndex, 1);
    }
    setCheckedCat(newCheckedCat);
    setCurrentPage(1);
  };

  const classes = useStyles(); 

  const CategoryServices = ({catValue}) => {
    switch (catValue) {
      case "Hair":
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}> Hair Services</FormLabel>
            <FormGroup>
            <Query query={HAIR_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.hairCat.map(item => item.title);
                console.log("checkedCat",checkedCat);
                console.log("hair",hair);
                if (checkedCat.length) {setHair(checkedCat)}
                else if (hair.length != categories.length) {setHair(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    control={
                    <Checkbox
                      onClick={() => handleCatToggle(node)}
                      checked={ 
                        checkedCat.includes(node)
                      }
                      checkedIcon={
                        <Check className={classes.checkedIcon} />
                      }
                      icon={
                        <Check className={classes.uncheckedIcon} />
                      }
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={node}
                />
                )));
            }}
            </Query>
            </FormGroup>
            </FormControl>
          </div>
        );
        case "Nails":
          return(
            <div className={classes.paddingTB}>
              <FormControl component="fieldset" >
              <FormLabel component="legend" className={classes.paddingB}> Nails Services</FormLabel>
              <FormGroup>
              <Query query={NAILS_QUERY}>
                {({data, loading, error}) => {
                  if (loading) return <Loading />;
                  if (error) return <Error error={error} />;
                  const categories = data.nailsCat.map(item => item.title);
                  if (checkedCat.length) {setNails(checkedCat)}
                  else if (nails.length != categories.length) {setNails(categories)}
                  return(
                  categories.map(node => (
                    <FormControlLabel
                      control={
                      <Checkbox
                        onClick={() => handleCatToggle(node)}
                        checked={ 
                          checkedCat.includes(node)
                        }
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={
                          <Check className={classes.uncheckedIcon} />
                        }
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{ label: classes.label }}
                    label={node}
                  />
                  )));
                }}
              </Query>
          </FormGroup>
          </FormControl>
        </div>
      );
      case "Hair Removal":
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}> Hair Removal Services</FormLabel>
            <FormGroup>
            <Query query={HAIR_REMOVAL_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.hairRemovalCat.map(item => item.title);
                if (checkedCat.length) {setHairRemoval(checkedCat)}
                else if (hairRemoval.length != categories.length) {setHairRemoval(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    control={
                    <Checkbox
                      onClick={() => handleCatToggle(node)}
                      checked={ 
                        checkedCat.includes(node)
                      }
                      checkedIcon={
                        <Check className={classes.checkedIcon} />
                      }
                      icon={
                        <Check className={classes.uncheckedIcon} />
                      }
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={node}
                />
                )));
              }}
            </Query>
          </FormGroup>
          </FormControl>
        </div>
       );
       case "Makeup":
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}> Makeup Services</FormLabel>
            <FormGroup>
            <Query query={MAKEUP_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.makeupCat.map(item => item.title);
                if (checkedCat.length) {setMakeup(checkedCat)}
                else if (makeup.length != categories.length) {setMakeup(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    control={
                    <Checkbox
                      onClick={() => handleCatToggle(node)}
                      checked={ 
                        checkedCat.includes(node)
                      }
                      checkedIcon={
                        <Check className={classes.checkedIcon} />
                      }
                      icon={
                        <Check className={classes.uncheckedIcon} />
                      }
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={node}
                />
                )));
            }}
            </Query>
            </FormGroup>
            </FormControl>
          </div>
        );
        case "Massage":
          return(
            <div className={classes.paddingTB}>
              <FormControl component="fieldset" >
              <FormLabel component="legend" className={classes.paddingB}> Massage Services</FormLabel>
              <FormGroup>
              <Query query={MASSAGE_QUERY}>
                {({data, loading, error}) => {
                  if (loading) return <Loading />;
                  if (error) return <Error error={error} />;
                  const categories = data.massageCat.map(item => item.title);
                  if (checkedCat.length) {setMassage(checkedCat)}
                  else if (massage.length != categories.length) {setMassage(categories)}
                  return(
                  categories.map(node => (
                    <FormControlLabel
                      control={
                      <Checkbox
                        onClick={() => handleCatToggle(node)}
                        checked={ 
                          checkedCat.includes(node)
                        }
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={
                          <Check className={classes.uncheckedIcon} />
                        }
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{ label: classes.label }}
                    label={node}
                  />
                  )));
                }}
              </Query>
          </FormGroup>
          </FormControl>
        </div>
      );       
      default:
        return null;
    }
  }

  return (
    <div className={classes.container}>
     {/* <Container> */}
        <GridContainer>
          <GridItem xs={12} sm={12} md={4} lg={3} >
          <div className={classNames(classes.tab, classes.mainRaised)}>
            <Card plain>
              <CardBody className={classes.cardBodyRefine}>
                <h4 className={classes.cardTitle + " " + classes.textLeft}>
                  Refine
                  <Tooltip
                    id="tooltip-top"
                    title="Reset Filter"
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button
                      link
                      justIcon
                      size="sm"
                      className={classes.pullRight + " " + classes.refineButton}
                    >
                      <Cached />
                    </Button>
                  </Tooltip>
                  <Clearfix />
                </h4>
                <Divider/>
                <div className={classes.paddingTB}>
                <FormControlLabel
                  control={
                    <Checkbox
                      tabIndex={-1}
                      //onClick={() => handleToggle(1)}
                      checked={false}
                      checkedIcon={
                        <Check className={classes.checkedIcon} />
                      }
                      icon={
                        <Check className={classes.uncheckedIcon} />
                      }
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label="Promotions"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      tabIndex={-1}
                      //onClick={() => handleToggle(2)}
                      checked={true}
                      checkedIcon={
                        <Check className={classes.checkedIcon} />
                      }
                      icon={
                        <Check className={classes.uncheckedIcon} />
                      }
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label="Online booking"
                />
                </div>
                <Divider/>
                <div className={classes.paddingB}>
                  <h4>{areaTitle}</h4>
                  <Query query={AREA_QUERY}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.area.map(item => item.title);
                    return  <Autocomplete
                              multiple
                              limitTags={3}
                              id="size-small-standard-multi"
                              size="small"
                              options={categories}
                              onChange={(event,value) => {
                                setArea(value);
                                setAreaSelected(value.length);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                variant="outlined" 
                                label="Location" 
                                placeholder="More areas" />
                              )}
                            />
                          }}
                  </Query>
                </div>
                <Divider/>
                <div className={classes.paddingTB}>
                {catDisplay ? (
                  <FormControl component="fieldset">
                    <FormLabel component="legend" style={{paddingBottom:"10px"}}>Category</FormLabel>
                    <RadioGroup
                      aria-label="category"
                      name="category"
                      value={catValue}
                      onChange={handleCatChange}
                    >
                      <FormControlLabel value="Hair" control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}} />} label="Hair" />
                      <FormControlLabel value="Nails" control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label="Nails" />
                      <FormControlLabel value="Hair Removal" control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label="Hair Removal" />
                      <FormControlLabel value="Makeup" control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label="Makeup" />
                      <FormControlLabel value="Massage" control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label="Massage" />
                    </RadioGroup>
                  </FormControl>) : 
                  (<div>
                    <span>
                      {catValue} &nbsp;
                      <button
                        style={{ border: "none", borderRadius: "30px" }}
                        onClick={() => {
                          setCatDisplay(true);
                          setCatValue("");
                          setCheckedCat([]);
                          setHair([]);
                          setNails([]);
                        }}
                      >
                        X
                      </button>
                    </span>
                  </div>
                )}
                </div>
                <Divider/>
                <CategoryServices catValue={catValue}/>



{/* 
                <div>        
                <Accordion
                  active={[0,1,2,3]}
                  activeColor="info"
                  collapses={[
                    // {
                    //   title: "Price Range",
                    //   content: (
                    //     <CardBody className={classes.cardBodyRefine}>
                    //       <span
                    //         className={classNames(
                    //           classes.pullLeft,
                    //           classes.priceSlider
                    //         )}
                    //       >
                    //         €{priceRange[0]}
                    //       </span>
                    //       <span
                    //         className={classNames(
                    //           classes.pullRight,
                    //           classes.priceSlider
                    //         )}
                    //       >
                    //         €{priceRange[1]}
                    //       </span>
                    //       <br />
                    //       <br />
                    //       <div id="sliderRegular" className="slider-rose" />
                    //     </CardBody>
                    //   )
                    // },
                    {
                      title: `${nailsTitle}`,
                      content: (
                        <div>
                          <div>
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
                                          setNails(value);
                                          setNailsSelected(value.length);
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
                          </div>
                        </div>
                      )
                    }
                  ]}
                />
                </div> */}


              </CardBody>
            </Card>
            </div>
          </GridItem>

          <GridItem xs={12} sm={12} md={8} lg={9}>
            {/* <GridContainer> */}
              <Query query={FILTERED_SALONS_QUERY} variables={{area, hair, nails}}>
                {({data, loading, error}) => {
                  if (loading) return <Loading />;
                  if (error) return <Error error={error} />;
                    // Get current salons
                  const currentSalons = data.salonsFiltered.slice(indexOfFirstSalon, indexOfLastSalon);
                  setCount(Math.ceil(data.salonsFiltered.length/salonsPerPage))
                  console.log(currentSalons)
                return <FilterListings listings = {currentSalons}/>
                      }}
                </Query>
            {/* </GridContainer> */}
            <div style={{display:"flex", justifyContent:"center", paddingTop:"30px"}}>
             <Pagination count={count} page={currentPage} onChange={handlePageChange} />
            </div>
          </GridItem>       
        </GridContainer>
      {/* </Container> */}
    </div>
  );
}

const FILTERED_SALONS_QUERY = gql`
query ($area:[String],
       $hair:[String],
       $nails:[String]) {
    salonsFiltered(area: $area,
                   hair: $hair,
                   nails: $nails) {
        id
        name
        address
        description
        city{
          title
        }
        reviewSet{
          rating
        }
        priceRange
        photoMain 
        hairserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        nailsserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        hairremovalserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        makeupserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
        massageserviceSet {
          title,
          price,
          promotionPrice,
          duration
        }
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
        salonSet{
          name
        }
      }
}
`;

const NAILS_QUERY = gql`
{
    nailsCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const HAIR_REMOVAL_QUERY = gql`
{
    hairRemovalCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const MAKEUP_QUERY = gql`
{
    makeupCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;

const MASSAGE_QUERY = gql`
{
    massageCat{
        id
        title
        salonSet{
          name
        }
      }
}
`;
