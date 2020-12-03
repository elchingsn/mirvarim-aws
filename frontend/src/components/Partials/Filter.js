import React, {useState, useEffect} from "react";
import { Query } from "@apollo/react-components";
import { useTranslation } from 'react-i18next';
import gql from "graphql-tag";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
// nodejs library that concatenates classes
import classNames from "classnames";
// plugin that creates slider
//import Slider from "nouislider";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"; 
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
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
// @material-ui icons
import Cached from "@material-ui/icons/Cached";
import Check from "@material-ui/icons/Check";
//import FilterListIcon from '@material-ui/icons/FilterList';
import Close from "@material-ui/icons/Close";

// core components
import FilterListings from "components/Partials/FilterListings";
//import Accordion from "./Accordion.js";
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import Card from "components/Partials/Card.js";
import CardBody from "components/Partials/CardBody.js";
import Button from "components/Partials/Button.js";
import Clearfix from "components/Partials/Clearfix.js";

import styles from "assets/jss/filterStyle.js";

const useStyles = makeStyles(styles);

export default function Filter({initCatValue, initCheckedCat, initServiceValue, initAreaValue}) {
  
  //console.log('filter', initCatValue, initCheckedCat, initServiceValue, initAreaValue)
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const [booking, setBooking] = useState(false);
  const [onlysalons, setOnlysalons] = useState(false);
  const [outcall, setOutcall] = useState(false);
  const [area, setArea] = useState([]);
  const [hair, setHair] = useState([]);
  const [nails, setNails] = useState([]);
  const [hairRemoval, setHairRemoval] = useState([]);
  const [makeup, setMakeup] = useState([]);
  const [massage, setMassage] = useState([]);
  const [eyebrow, setEyebrow] = useState([]);
  const [cosmetology, setCosmetology] = useState([]);
  const [tattoo, setTattoo] = useState([]);
  const [aesthetics, setAesthetics] = useState([]);
  
  const [areaSelected, setAreaSelected] = useState(0);
  // const [hairSelected, setHairSelected] = useState(0);

  const [areaTitle, setAreaTitle] = useState("Area");
  // const [hairTitle, setHairTitle] = useState("Hair Services");

  const [catValue, setCatValue] = useState(initCatValue);
  const [catDisplay, setCatDisplay] = useState(true);
  const [checkedCat, setCheckedCat] = useState(initCheckedCat);
  //const [serviceValue, setServiceValue] = useState(initServiceValue);

  const [resultsnum, setResultsnum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage, setSalonsPerPage] = useState(5);
  const [count, setCount] = useState(1);
  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;

  // const { data:area_data } = useQuery(AREA_QUERY);
  // const { data:hair_data } = useQuery(HAIR_QUERY);
  // const { data:nails_data } = useQuery(NAILS_QUERY);

  useEffect(() => {
    if(initCatValue) {setCatDisplay(false)}
    if(initAreaValue) {setArea(initAreaValue.split())}
  },[])
  
  useEffect(() => {
    (areaSelected)? setAreaTitle(`Area (${areaSelected} selected)`) : setAreaTitle("Area");
  }, [areaSelected])

  useEffect(() => {
    setHair([]);
    setNails([]);
    setHairRemoval([]);
    setMakeup([]);
    setMassage([]);
    setEyebrow([]);    
    setCosmetology([]); 
    setTattoo([]);    
    setAesthetics([]);      
    setCatValue(t(initCatValue));
    setCheckedCat(initCheckedCat);
    if(initCatValue) { setTimeout(() => setCatDisplay(false), 1000) }
    setCurrentPage(1);
  }, [initCatValue, initCheckedCat])

  // React.useEffect(() => {
  //   (hairSelected)? setHairTitle(`Hair Services (${hairSelected} selected)`) : setHairTitle("Hair Services");
  // }, [hairSelected]);

  // React.useEffect(() => {
  //   (nailsSelected)? setNailsTitle(`Nails Services (${nailsSelected} selected)`) : setNailsTitle("Nails Services");
  // }, [nailsSelected]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCatChange = event => {
    setCatValue(event.target.value);
    setTimeout(() => setCatDisplay(false), 1000);
    setCurrentPage(1);
  };

  const handlePageChange = (event,value) => {
    setCurrentPage(value)
  } 
  
  // const {data} = useQuery(FILTERED_SALONS_QUERY, {variables:{area, hair, nails}}, { fetchPolicy: 'network-only' });
    
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
      case `${t("Hair")}`:
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}>{t("Hair Services")}</FormLabel>
            <FormGroup>
            <Query query={HAIR_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.hairCat.map(item => item.title);
                if (checkedCat.length) {setHair(checkedCat)}
                else if (hair.length !== categories.length) {setHair(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    key={node}
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
                  label={t(`${node}`)}
                />
                )));
            }}
            </Query>
            </FormGroup>
            </FormControl>
          </div>
        );
        case `${t("Nails")}`:
          return(
            <div className={classes.paddingTB}>
              <FormControl component="fieldset" >
              <FormLabel component="legend" className={classes.paddingB}>{t("Nails Services")}</FormLabel>
              <FormGroup>
              <Query query={NAILS_QUERY}>
                {({data, loading, error}) => {
                  if (loading) return <Loading />;
                  if (error) return <Error error={error} />;
                  const categories = data.nailsCat.map(item => item.title);
                  if (checkedCat.length) {setNails(checkedCat)}
                  else if (nails.length !== categories.length) {setNails(categories)}
                  return(
                  categories.map(node => (
                    <FormControlLabel
                      key={node}
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
                    label={t(`${node}`)}
                  />
                  )));
                }}
              </Query>
          </FormGroup>
          </FormControl>
        </div>
      );
      case `${t("Hair Removal")}`:
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}>{t("Hair Removal Services")}</FormLabel>
            <FormGroup>
            <Query query={HAIR_REMOVAL_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.hairRemovalCat.map(item => item.title);
                if (checkedCat.length) {setHairRemoval(checkedCat)}
                else if (hairRemoval.length !== categories.length) {setHairRemoval(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    key={node}
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
                  label={t(`${node}`)}
                />
                )));
              }}
            </Query>
          </FormGroup>
          </FormControl>
        </div>
       );
       case `${t("Makeup")}`:
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}>{t("Makeup Services")}</FormLabel>
            <FormGroup>
            <Query query={MAKEUP_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.makeupCat.map(item => item.title);
                if (checkedCat.length) {setMakeup(checkedCat)}
                else if (makeup.length !== categories.length) {setMakeup(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    key={node}
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
                  label={t(`${node}`)}
                />
                )));
            }}
            </Query>
            </FormGroup>
            </FormControl>
          </div>
        );
        case `${t("Massage")}`:
          return(
            <div className={classes.paddingTB}>
              <FormControl component="fieldset" >
              <FormLabel component="legend" className={classes.paddingB}>{t("Massage&Spa Services")} </FormLabel>
              <FormGroup>
              <Query query={MASSAGE_QUERY}>
                {({data, loading, error}) => {
                  if (loading) return <Loading />;
                  if (error) return <Error error={error} />;
                  const categories = data.massageCat.map(item => item.title);
                  if (checkedCat.length) {setMassage(checkedCat)}
                  else if (massage.length !== categories.length) {setMassage(categories)}
                  return(
                  categories.map(node => (
                    <FormControlLabel
                      key={node}
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
                    label={t(`${node}`)}
                  />
                  )));
                }}
              </Query>
          </FormGroup>
          </FormControl>
        </div>
      );
      case `${t("Eyebrow")}`:
        return(
          <div className={classes.paddingTB}>
            <FormControl component="fieldset" >
            <FormLabel component="legend" className={classes.paddingB}>{t("Eyebrow/Eyelashes Services")}</FormLabel>
            <FormGroup>
            <Query query={EYEBROW_QUERY}>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                const categories = data.eyebrowCat.map(item => item.title);

                if (checkedCat.length) {setEyebrow(checkedCat)}
                else if (eyebrow.length !== categories.length) {setEyebrow(categories)}
                return(
                categories.map(node => (
                  <FormControlLabel
                    key={node}
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
                  label={t(`${node}`)}
                />
                )));
            }}
            </Query>
            </FormGroup>
            </FormControl>
          </div>
        );
        case `${t("Cosmetology")}`:
          return(
            <div className={classes.paddingTB}>
              <FormControl component="fieldset" >
              <FormLabel component="legend" className={classes.paddingB}>{t("Cosmetology Services")}</FormLabel>
              <FormGroup>
              <Query query={COSMETOLOGY_QUERY}>
                {({data, loading, error}) => {
                  if (loading) return <Loading />;
                  if (error) return <Error error={error} />;
                  const categories = data.cosmetologyCat.map(item => item.title);

                  if (checkedCat.length) {setCosmetology(checkedCat)}
                  else if (cosmetology.length !== categories.length) {setCosmetology(categories)}
                  return(
                  categories.map(node => (
                    <FormControlLabel
                      key={node}
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
                    label={t(`${node}`)}
                  />
                  )));
              }}
              </Query>
              </FormGroup>
              </FormControl>
            </div>
          );
          case `${t("Tattoo/Piercing")}`:
            return(
              <div className={classes.paddingTB}>
                <FormControl component="fieldset" >
                <FormLabel component="legend" className={classes.paddingB}>{t("Tattoo/Piercing Services")} </FormLabel>
                <FormGroup>
                <Query query={TATTOO_QUERY}>
                  {({data, loading, error}) => {
                    if (loading) return <Loading />;
                    if (error) return <Error error={error} />;
                    const categories = data.tattooCat.map(item => item.title);
 
                    if (checkedCat.length) {setTattoo(checkedCat)}
                    else if (tattoo.length !== categories.length) {setTattoo(categories)}
                    return(
                    categories.map(node => (
                      <FormControlLabel
                        key={node}
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
                      label={t(`${node}`)}
                    />
                    )));
                }}
                </Query>
                </FormGroup>
                </FormControl>
              </div>
            );
            case `${t("Aesthetics")}`:
              return(
                <div className={classes.paddingTB}>
                  <FormControl component="fieldset" >
                  <FormLabel component="legend" className={classes.paddingB}>{t("Aesthetic Medicine Services")} </FormLabel>
                  <FormGroup>
                  <Query query={AESTHETICS_QUERY}>
                    {({data, loading, error}) => {
                      if (loading) return <Loading />;
                      if (error) return <Error error={error} />;
                      const categories = data.aestheticsCat.map(item => item.title);

                      if (checkedCat.length) {setAesthetics(checkedCat)}
                      else if (aesthetics.length !== categories.length) {setAesthetics(categories)}
                      return(
                      categories.map(node => (
                        <FormControlLabel
                          key={node}
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
                        label={t(`${node}`)}
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
          <Hidden smDown implementation="css" className={classes.hidden}>
          <div className={classNames(classes.tab, classes.mainRaised)}>
            <Card plain>
              <CardBody className={classes.cardBodyRefine}>
                <h4 className={classes.cardTitle + " " + classes.textLeft}>
                  {t("Reset filter")}
                  <Tooltip
                    id="tooltip-top"
                    title={t("Reset filter")}
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button
                      link
                      justIcon
                      size="sm"
                      className={classes.pullRight + " " + classes.refineButton}
                      onClick={() => {
                        setCatDisplay(true);
                        setCatValue("");
                        setCheckedCat([]);
                        setOutcall(false);
                        setOnlysalons(false);
                        setBooking(false);                        
                        setArea([]);
                        setHair([]);
                        setNails([]);
                        setHairRemoval([]);
                        setMakeup([]);
                        setMassage([]);
                        setEyebrow([]);    
                        setCosmetology([]); 
                        setTattoo([]);    
                        setAesthetics([]);                            
                      }}
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
                      //tabIndex={-1}
                      onClick={() => setBooking(!booking)}
                      checked={booking}
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
                  label={t("Online booking")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={() => setOnlysalons(!onlysalons)}
                      checked={onlysalons}
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
                  label={t("Only salons")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      //tabIndex={-1}
                      onClick={() => setOutcall(!outcall)}
                      checked={outcall}
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
                  label={t("Home visit")}
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
                      //const categories1 = data.area.map(item => item.id);
                    return  <Autocomplete
                              multiple
                              limitTags={5}
                              id="size-small-standard-multi"
                              size="small"
                              options={categories}
                              getOptionLabel={option => t(`${option}`)}
                              value={area}
                              onChange={(event,value) => {
                                setArea(value);
                                setAreaSelected(value.length);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} 
                                  variant="outlined" 
                                  label={t("Location")} 
                                  placeholder={t("More areas")}
                                />
                              )}
                            />
                          }}
                  </Query>
                </div>
                <Divider/>
                <div className={classes.paddingTB}>
                {catDisplay ? (
                  <FormControl component="fieldset">
                    <FormLabel component="legend" style={{paddingBottom:"10px"}}>{t("Category")}</FormLabel>
                    <RadioGroup
                      aria-label="category"
                      name="category"
                      value={catValue}
                      onChange={handleCatChange}
                    >
                      <FormControlLabel value={t("Hair")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}} />} label={t("Hair")} />
                      <FormControlLabel value={t("Nails")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Nails")} />
                      <FormControlLabel value={t("Hair Removal")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Hair Removal")} />
                      <FormControlLabel value={t("Makeup")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Makeup")} />
                      <FormControlLabel value={t("Massage")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Massage")} />
                      <FormControlLabel value={t("Eyebrow")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Eyebrow")} />
                      <FormControlLabel value={t("Cosmetology")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Cosmetology")} />
                      <FormControlLabel value={t("Tattoo/Piercing")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Tattoo/Piercing")} />
                      <FormControlLabel value={t("Aesthetics")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Aesthetics")} />
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
                          setHairRemoval([]);
                          setMakeup([]);
                          setMassage([]);
                          setEyebrow([]);    
                          setCosmetology([]); 
                          setTattoo([]);    
                          setAesthetics([]);                            
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

              </CardBody>
            </Card>
            </div>
            </Hidden>
          </GridItem>
  
            <Hidden mdUp implementation="js">
              <Drawer
                variant="temporary"
                anchor={"bottom"}
                open={mobileOpen}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={handleDrawerToggle}
              >
                <IconButton
                  color="inherit"
                  aria-label="close filter"
                  onClick={handleDrawerToggle}
                  // className={classes.closeButtonDrawer}
                >
                  <Close />
                </IconButton>
                <div className={classes.container}>
                  <h4 className={classes.cardTitle + " " + classes.textLeft}>
                    {t("Reset filter")}
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
                        onClick={() => {
                          setCatDisplay(true);
                          setCatValue("");
                          setCheckedCat([]);
                          setOnlysalons(false);
                          setOutcall(false);
                          setBooking(false);
                          setArea([]);
                          setHair([]);
                          setNails([]);
                          setHairRemoval([]);
                          setMakeup([]);
                          setMassage([]);
                          setEyebrow([]);    
                          setCosmetology([]); 
                          setTattoo([]);    
                          setAesthetics([]);                            
                        }}
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
                          onClick={() => setBooking(!booking)}
                          checked={booking}
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
                      label={t("Online booking")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onClick={() => setOnlysalons(!onlysalons)}
                          checked={onlysalons}
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
                      label={t("Only salons")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onClick={() => setOutcall(!outcall)}
                          checked={outcall}
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
                      label={t("Home visit")}
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
                                  getOptionLabel={option => t(`${option}`)}
                                  value={area}
                                  onChange={(event,value) => {
                                    setArea(value);
                                    setAreaSelected(value.length);
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} 
                                    variant="outlined" 
                                    label={t("Location")} 
                                    placeholder={t("More areas")}
                                    />
                                  )}
                                />
                              }}
                      </Query>
                    </div>
                    <Divider/>
                    <div className={classes.paddingTB}>
                    {catDisplay ? (
                      <FormControl component="fieldset">
                        <FormLabel component="legend" style={{paddingBottom:"10px"}}>{t("Category")}</FormLabel>
                        <RadioGroup
                          aria-label="category"
                          name="category"
                          value={catValue}
                          onChange={handleCatChange}
                        >
                          <FormControlLabel value={t("Hair")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}} />} label={t("Hair")} />
                          <FormControlLabel value={t("Nails")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Nails")} />
                          <FormControlLabel value={t("Hair Removal")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Hair Removal")} />
                          <FormControlLabel value={t("Makeup")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Makeup")} />
                          <FormControlLabel value={t("Massage")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Massage")} />
                          <FormControlLabel value={t("Eyebrow")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Eyebrow")} />
                          <FormControlLabel value={t("Cosmetology")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Cosmetology")} />
                          <FormControlLabel value={t("Tattoo/Piercing")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Tattoo/Piercing")} />
                          <FormControlLabel value={t("Aesthetics")} control={<Radio style={{paddingTop:"5px", paddingBottom:"5px"}}/>} label={t("Aesthetics")} />
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
                              setHairRemoval([]);
                              setMakeup([]);
                              setMassage([]);
                              setEyebrow([]);    
                              setCosmetology([]); 
                              setTattoo([]);    
                              setAesthetics([]);                                                            
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
                  </div>
                  </Drawer>
            </Hidden>


          <GridItem xs={12} sm={12} md={8} lg={9}>
            {/* <GridContainer> */}
            <Query query={FILTERED_SALONS_QUERY} 
              variables={{booking, onlysalons, outcall, area, hair, nails, makeup, massage, eyebrow, cosmetology, tattoo, aesthetics}} 
              fetchPolicy='network-only'>
              {({data, loading, error}) => {
                if (loading) return <Loading />;
                if (error) return <Error error={error} />;
                setResultsnum(data.salonsFiltered.length)
                if (data.salonsFiltered.length === 0) return <p> {t("No listing found")} </p>
                  // Get current salons
                const currentSalons = data.salonsFiltered.slice(indexOfFirstSalon, indexOfLastSalon);
                setCount(Math.ceil(data.salonsFiltered.length/salonsPerPage))
                return (
                  <div>
                    <p> {t("Listings found:")} {resultsnum} </p>
                   <FilterListings listings = {currentSalons}/>
                  </div>
                )
              }}
            </Query>
            {/* </GridContainer> */}
            {Boolean(resultsnum) &&
              (<div style={{display:"flex", justifyContent:"center", paddingTop:"30px"}}>
              <Pagination count={count} page={currentPage} onChange={handlePageChange} />
              </div>)
            }
          </GridItem>       
        </GridContainer>
        <Hidden mdUp>
          <div className={classes.stickyFilter}>
            <Button
              color="primary"
              aria-label="open filter"
              onClick={handleDrawerToggle}
              className={classes.button}
            >
              <i className="fas fa-sliders-h"></i>
              {/* <FilterListIcon /> */}
            </Button>
          </div>
        </Hidden>
      {/* </Container> */}
    </div>
  );
}

const FILTERED_SALONS_QUERY = gql`
query(
      $booking: Boolean,
      $onlysalons: Boolean,
      $outcall: Boolean,
      $area:[String],
      $hair:[String],
      $nails:[String]
      $makeup:[String],
      $massage:[String],
      $eyebrow:[String],
      $cosmetology:[String],
      $tattoo:[String],
      $aesthetics:[String]
      ) {
    salonsFiltered(booking: $booking,
                   onlysalons: $onlysalons,
                   outcall: $outcall,
                   area: $area,
                   hair: $hair,
                   nails: $nails
                   makeup: $makeup,
                   massage: $massage,
                   eyebrow: $eyebrow,
                   cosmetology: $cosmetology,
                   tattoo: $tattoo,
                   aesthetics: $aesthetics) {
        id
        name
        address
        description
        city{
          id
          title
        }
        reviewSet{
          id
          rating
        }
        priceRange
        photoMain 
        hairserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        nailsserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        hairremovalserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        makeupserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        massageserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        eyebrowserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }     
        cosmetologyserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        tattooserviceSet {
          id
          title
          price
          promotionPrice
          duration
        }
        aestheticsserviceSet {
          id
          title
          price
          promotionPrice
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
        salonSet{
          id
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
          id
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
          id
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
          id
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
          id
          name
        }
      }
}
`;

const EYEBROW_QUERY = gql`
{
    eyebrowCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;

const COSMETOLOGY_QUERY = gql`
{
    cosmetologyCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;

const TATTOO_QUERY = gql`
{
    tattooCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;

const AESTHETICS_QUERY = gql`
{
    aestheticsCat{
        id
        title
        salonSet{
          id
          name
        }
      }
}
`;


