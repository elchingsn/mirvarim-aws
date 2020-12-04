/*eslint-disable*/
import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from '@apollo/react-components';
import { useTranslation } from 'react-i18next';

// nodejs library that concatenates classes
import classNames from "classnames";
// react components used to create a google map
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker
// } from "react-google-maps";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import PinDrop from "@material-ui/icons/PinDrop";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

// core components
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";


// const CustomSkinMap = withScriptjs(
//   withGoogleMap(() => (
//     <GoogleMap
//       defaultZoom={14}
//       defaultCenter={{ lat: 44.43353, lng: 26.093928 }}
//       defaultOptions={{
//         scrollwheel: false,
//         zoomControl: true,
//         styles: [
//           {
//             featureType: "water",
//             stylers: [
//               { saturation: 43 },
//               { lightness: -11 },
//               { hue: "#0088ff" }
//             ]
//           },
//           {
//             featureType: "road",
//             elementType: "geometry.fill",
//             stylers: [
//               { hue: "#ff0000" },
//               { saturation: -100 },
//               { lightness: 99 }
//             ]
//           },
//           {
//             featureType: "road",
//             elementType: "geometry.stroke",
//             stylers: [{ color: "#808080" }, { lightness: 54 }]
//           },
//           {
//             featureType: "landscape.man_made",
//             elementType: "geometry.fill",
//             stylers: [{ color: "#ece2d9" }]
//           },
//           {
//             featureType: "poi.park",
//             elementType: "geometry.fill",
//             stylers: [{ color: "#ccdca1" }]
//           },
//           {
//             featureType: "road",
//             elementType: "labels.text.fill",
//             stylers: [{ color: "#767676" }]
//           },
//           {
//             featureType: "road",
//             elementType: "labels.text.stroke",
//             stylers: [{ color: "#ffffff" }]
//           },
//           { featureType: "poi", stylers: [{ visibility: "off" }] },
//           {
//             featureType: "landscape.natural",
//             elementType: "geometry.fill",
//             stylers: [{ visibility: "on" }, { color: "#b8cb93" }]
//           },
//           { featureType: "poi.park", stylers: [{ visibility: "on" }] },
//           {
//             featureType: "poi.sports_complex",
//             stylers: [{ visibility: "on" }]
//           },
//           { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
//           {
//             featureType: "poi.business",
//             stylers: [{ visibility: "simplified" }]
//           }
//         ]
//       }}
//     >
//       <Marker position={{ lat: 44.43353, lng: 26.093928 }} />
//     </GoogleMap>
//   ))
// );

const Contact = ({classes}) => {
  const { t, i18n } = useTranslation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const [contactData, setContactData] = useState({
    subject: '',
    message: '',
    email: ''
  })  

  const handleSubmit = async (event, sendFeedback) => {
    event.preventDefault();
  
    sendFeedback({variables: { contactData: contactData }}).catch(err => {
      console.error(err);
      history.push('/');
    });
  };

  return (
    <div>
      {/* <div className={classes.bigMap}>
        <CustomSkinMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={
            <div
              style={{
                height: `100%`,
                borderRadius: "6px",
                overflow: "hidden"
              }}
            />
          }
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div> */}
      <div className={classes.container}>
      <Paper className={classes.paper}>
          <h2>{t("Send us a message")}</h2> 
          <GridContainer>
              <GridItem md={12} sm={12}>
                <p>
                  {t("You can contact us with anything related to our services. We will get in touch with you as soon as possible.")}
                  <br />
                  <br />
                </p>
                <Mutation
                  mutation={SEND_FEEDBACK}
                  // onCompleted={data => {
                  // console.log({ data });
                  // }}
                >
                  {(sendFeedback, { loading, error }) => {
                  if (error) return <Error error={error} />;
                    return(
                      <form onSubmit={event => handleSubmit(event, sendFeedback)}>
                        <FormControl fullWidth className={classes.field}>
                          <TextField
                          label={t("Subject")}
                          placeholder={t("Add subject")}
                          onChange={(event) => setContactData({ ...contactData, subject:event.target.value })}
                          value={contactData.subject}
                          maxLength={25}
                          variant="outlined"
                          />
                        </FormControl>
                        <FormControl fullWidth className={classes.field}>
                          <TextField
                          label={t("Message")}
                          placeholder={t("Add message")}
                          multiline
                          rows="7"
                          onChange={(event) => setContactData({ ...contactData, message:event.target.value })}
                          value={contactData.message}
                          variant="outlined"
                          />
                        </FormControl>
                        <FormControl fullWidth className={classes.field}>
                          <TextField
                          label={t("Email")}
                          placeholder={t("Add email")}
                          onChange={(event) => setContactData({ ...contactData, email:event.target.value })}
                          value={contactData.email}
                          variant="outlined"
                          />
                        </FormControl>
                      <Box
                        mt={1}
                        justifyContent="center"
                        display="flex"
                      >
                        <Button
                          variant="outlined"
                          disabled={
                            !contactData.message.trim() ||
                            !contactData.email.trim()
                          }
                          type="submit"
                          className={classes.save}
                        >
                          {t("Send")}
                        </Button>
                      </Box>
                    </form>
                  );
                }}
              </Mutation>
              </GridItem>
              {/* <GridItem md={4} sm={4} className={classes.mlAuto}>
                <PinDrop/>
                <h4> Find us at the office </h4>
                <p>Port Baku</p>
              </GridItem> */}
            </GridContainer>
      </Paper>
      </div>
    </div>
  );
}

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth:"1080px",
    marginLeft:"auto",
    marginRight:"auto",
    alignItems:"center"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    width: "100%",
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
  bigMap: {
    height: "55vh",
    maxHeight: "550px",
    width: "100%",
    display: "block"
  }
});

const SEND_FEEDBACK = gql`
  mutation($contactData:ContactInput!) {
    sendFeedback(contactData: $contactData) {
      success
    }
  }
`;

export default withStyles(styles)(Contact)
