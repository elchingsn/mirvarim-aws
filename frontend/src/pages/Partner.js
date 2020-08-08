import React, {useState} from "react";
import {Link} from "react-router-dom";

import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles"; 
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Parallax from "../components/Partials/Parallax.js";
import Footer from "../components/Partials/Footer.js";
import GridContainer from "../components/Partials/GridContainer.js";
import GridItem from "../components/Partials/GridItem.js";
import Button from "../components/Partials/Button.js";
import Card from "../components/Partials/Card.js";
import CardBody from "../components/Partials/CardBody.js";
import CustomInput from "../components/Partials/CustomInput.js";

import presentationStyle from "../assets/jss/presentationStyle.js";
import CreateSalon from "../components/Salon/CreateSalon.js";

const useStyles = makeStyles(presentationStyle);

const Partner = ()=>{
    // const [form, setForm] = useState(false);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    });
    
    const classes = useStyles()

    return(
      <div>
        {/* <Button onClick={() => setForm(true)}>
          Add Salon
        </Button>
        {form && <CreateSalon/>} */}
      </div>
    );

}

export default Partner;