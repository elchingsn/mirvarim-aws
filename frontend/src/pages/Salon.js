import React, {useState} from "react";
import classNames from "classnames";

import { makeStyles } from "@material-ui/core/styles";

import Parallax from "../components/Partials/Parallax.js";
import GridContainer from "../components/Partials/GridContainer.js";
import GridItem from "../components/Partials/GridItem.js";
import Card from "../components/Partials/Card.js";
import CardBody from "../components/Partials/CardBody.js";
import SearchSalons from "../components/Partials/SearchSalons.js";
import Filter from "../components/Partials/Filter.js";


import styles from "../assets/jss/salonStyle.js";
import { areIntervalsOverlapping } from "date-fns";
const useStyles = makeStyles(styles);

const Salon=({location}) => {
    const classes = useStyles();

    // const [searchResults, setSearchResults] = useState([]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      });

    React.useEffect(() =>{
      console.log(location.state);

      return () => {console.log(location.state)}

    })
    
    let initCatValue = ""
    let initServiceValue = ""
    let initAreaValue = ""
    let initCheckedCat = []
    let initValues = []

    console.log(initCheckedCat);

    if (location.state) {
      initValues = location.state;
      initCatValue = initValues["catValue"];
      if (initValues["checkedCat"]) {initCheckedCat.push(initValues["checkedCat"])};
      initServiceValue = initValues["search"];
      initAreaValue = initValues["location"];
    }

    // if(initValues.length == 2) { 
    //   initCatValue = initValues[0];
    //   initCheckedCat.push(initValues[1])
    //  }
    //  if (initValues.length == 1) {
    //   initCatValue = initValues[0]
    //  }

    return (
    <div>
        {/* <Parallax 
        image={require("../assets/img/salon_parallax.jpg")}
        className={classes.parallax}
        >
        </Parallax> */}
        {/* <div className={classes.container}>
        <GridContainer>
        <GridItem
                xs={12}
                sm={12}
                md={12}
                className={classNames(classes.mlAuto, classes.mrAuto)}
              >
                <Card raised className={classes.card}>
                  <CardBody formHorizontal>
                    <SearchSalons state = {location.state} /> 
                  </CardBody>
                </Card>
        </GridItem> 
        </GridContainer>
        </div> */}

        <div className={classNames(classes.main, classes.mainRaised)}>
        <Filter 
          initCatValue={initCatValue} 
          initCheckedCat={initCheckedCat}
          initServiceValue={initServiceValue}
          initAreaValue={initAreaValue}
        />
        </div>
        
    </div>
    );
};

export default Salon;

