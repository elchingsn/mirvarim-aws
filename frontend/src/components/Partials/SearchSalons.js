import React, { useState, useRef, useEffect } from "react";
import {Link} from "react-router-dom";
import { ApolloConsumer, useApolloClient, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

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

const SearchSalons = ({setSearchResults}) =>{
    const classes = useStyles();
    const [search, setSearch] = useState("");
    const [autoptions, setAutoptions] = useState([]);
    const inputEl = useRef();

    const clearSearchInput = () => {
        setSearchResults([]);
        setSearch("");
        inputEl.current.focus();
      };

    const handleSubmit = async (event, client) => {
        event.preventDefault();
        const submitResults = await client.query({
            query: SEARCH_SALONS_QUERY,
            variables: {search}
        });
        client.writeData({data: {search: {search}}});
        console.log(submitResults.data.salons);
        setSearchResults(submitResults.data.salons);
        };

    // const refValue = useRef(search);
    // useEffect(() => {
    //     refValue.current = search;
    // });
    
    const handleChange = async (event, client) => {
        event.preventDefault(); 
    };

    const { data } = useQuery(SEARCH_SALONS_QUERY, {variables: {search}});
    // console.log(autoptions)

    useEffect(() => {   
        if (data) { 
            const options = data.salons.map((option) => option.name);
            setAutoptions(options);
        };
    }, [data]);


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
                <form onSubmit={event=>handleSubmit(event,client)}>
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
                        options={autoptions}
                        // onChange = {event => handleChange(event,client)}
                        renderInput={(params) => (
                        <TextField 
                        {...params} 
                        onChange = {event => {
                            setSearch(event.target.value);
                            handleChange(event,client);
                        }}
                        label = "Find service or salon"
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
                        options={autoptions}
                        renderInput={(params) => (
                        <TextField {...params} label = "location" margin="none" />
                        )}
                         />
                    </GridItem>
                    <GridItem xs={12} sm={2} md={2}>
                        <Link to={"/salon"}> 
                        <Button
                        block
                        color="primary"
                        className={classes.button}
                        type = "submit"
                        >
                        Search
                        </Button>
                        </Link>
                    </GridItem>
                    </GridContainer>
                </form>
             )}
        </ApolloConsumer>
    );

   
};
    
const SEARCH_SALONS_QUERY = gql`
    query($search:String) {
        salons(search: $search) {
            id
            name
            city{
              title
            }
            rating
            priceRange
            photoMain
          
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