import React, {useState} from "react";
import {Link} from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';
import axios from "axios";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';

import { ApolloConsumer, Query, Mutation } from "@apollo/react-components";
import { useHistory } from 'react-router-dom';
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles"; 
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { IconButton } from '@material-ui/core';
import MoodIcon from '@material-ui/icons/Mood';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import Parallax from "components/Partials/Parallax.js";
import Footer from "components/Partials/Footer.js";
import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import Card from "components/Partials/Card.js";
import CardBody from "components/Partials/CardBody.js";
import CustomInput from "components/Partials/CustomInput.js";
import StarRating from "components/Partials/StarRating.js";

import presentationStyle from "assets/jss/presentationStyle.js";

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Error from "components/Shared/Error"; 
import {container} from "assets/jss/mirvarix-react"

// const useStyles = makeStyles(presentationStyle);

const labels = {
  0: 'Not rated',
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

const Review = ({match})=>{
    // const [form, setForm] = useState(false);
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
  }, []);
  const history = useHistory();

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const [question1, setQuestion1] = useState(0);
  const [question2, setQuestion2] = useState(0);
  const [question3, setQuestion3] = useState(0);
  const [question4, setQuestion4] = useState(0);
  const [question5, setQuestion5] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const salon_id = match.params.id;

  function getSteps() {
    return [`${t("Provide feedback")}`, `${t("Add rating")}`, `${t("Add comment [optional]")}`, `${t("Submit")}`];
  }

  const Question = ({setQuestion, number, question, style, selected}) => {
    return(
      <div>
        <GridContainer style = {{width:"100%"}}>
          <GridItem xs={12} sm={12} md={12} >
          <h4 style = {{marginLeft: "30px", marginBottom: "0"}}> {number} {question} </h4>
          </GridItem>
          <GridItem xs={6} sm={2} md={2} lg={1} className = {classes.grid}>
              <IconButton className = {classNames({[classes[`${style}`]] : selected === 1})}
              aria-label="question1" onClick = {() => setQuestion(1)}
              >
                <MoodIcon className = {classes.button} color="primary"/>
              </IconButton>
              <h5 style = {{ textAlign: "center", margin: "0"}} > {t("Yes")} </h5>
          </GridItem> 
          <GridItem xs={6} sm={2} md={2} lg={1} className = {classes.grid}>
          <IconButton className = {classNames({[classes[`${style}`]] : selected === 2})}
              aria-label="question1" onClick = {() => setQuestion(2)} >
                <SentimentSatisfiedIcon className = {classes.button} color="secondary" />
              </IconButton>
              <h5 style = {{ textAlign: "center", margin: "0"}} > {t("Almost")} </h5>
          </GridItem> 
          <GridItem xs={6} sm={2} md={2} lg={1} className = {classes.grid}>
          <IconButton className = {classNames({[classes[`${style}`]] : selected === 3})}
              aria-label="question1" onClick = {() => setQuestion(3)} >
                <SentimentVeryDissatisfiedIcon className = {classes.button} color="error" />
              </IconButton>
              <h5 style = {{ textAlign: "center", margin: "0"}} > {t("No")} </h5>
          </GridItem> 
          <GridItem xs={6} sm={2} md={2} lg={1} className = {classes.grid}>
          <IconButton className = {classNames({[classes[`${style}`]] : selected === 4})}
              aria-label="question1" onClick = {() => setQuestion(4)} >
                <NotInterestedIcon className = {classes.button} />
              </IconButton>
              <h5 style = {{ textAlign: "center", margin: "0"}} > {t("No opinion")} </h5>
          </GridItem> 
        </GridContainer>
      </div>
    );
  }
  
  function getStepContent(stepIndex) {
    
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <h3 style = {{marginLeft: "20px"}}> {t("Please answer below questions")}</h3>
            <Question setQuestion={setQuestion1} number="1." question={t("Was it clean?")} style="button1" selected={question1}/>
            <Question setQuestion={setQuestion2} number="2." question={t("Was it professional?")} style="button1" selected={question2}/>
            <Question setQuestion={setQuestion3} number="3." question={t("Was it punctual?")} style="button1" selected={question3}/>
            <Question setQuestion={setQuestion4} number="4." question={t("Was it easy to find?")} style="button1" selected={question4}/>
            <Question setQuestion={setQuestion5} number="5." question={t("Was it good value for money?")} style="button1" selected={question5}/>
            {console.log (question1, question2, question3, question4, question5)}
          </div>
        );
      case 1:
        return (
          <div style = {{marginLeft: "30px"}}>
            <h3> {t("Please rate the salon")}</h3>
            <StarRating
            numberOfStars="5"
            rating="0"
            setRating={setRating}
            setHover={setHover}
          />
          {console.log(rating)}
          <h4>{labels[hover == 0 ? rating: hover]}</h4>
          </div>
        );
      case 2:
        return (
          <div style = {{marginLeft: "30px"}}>
            <h3> {t("Please add a comment if you wish")}</h3>
            <GridContainer style = {{width:"100%"}}>
              <GridItem xs={12} sm={12} md={8} >
                <TextField
                  multiline
                  rows="6"
                  label={t("Comment")}
                  placeholder={t("Add Comment")}
                  onChange={event => setComment(event.target.value)}
                  value={comment}
                  variant="outlined"
                  fullWidth
                />
                </GridItem>
              </GridContainer>
          </div>
        );
      case 3:
        return (
          <div style = {{marginLeft: "30px"}}>
            <h3> {("Thank you for your feedback!")} </h3>
          </div>
        );      
      default:
        return 'Unknown stepIndex';
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = (createReview) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    createReview({variables: {
      reviewData: {
         salonId: salon_id,rating, question1, question2, question3,
         question4, question5, comment 
    }}}).catch(err => {
      console.error(err);
      history.push('/login');
    });
  }

  return(
    <div className={classes.root, classes.container}>
      <Mutation
        mutation={CREATE_REVIEW_MUTATION}
        onCompleted={data => {
          console.log(data)
        }}
        // update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_TRACKS_QUERY }]}
      >
        {(createReview, { loading, error }) => {
        if (error) return <Error error={error} />;
          return(
                <div>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <div>
                  {activeStep === steps.length ? (
                    <div>
                      <Button onClick={handleReset} className={classes.backButton}>{("Change")}</Button>
                      <Link to={`/salon/${salon_id}`}>
                        <Button className={classes.backButton}
                        variant="contained" color="primary" > {("Go to the salon page")} </Button>
                      </Link> 
                    </div>
                  ) : (
                    <div>
                      <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className={classes.backButton}
                        >
                          Back
                        </Button>
                        {activeStep === steps.length - 1 ?
                          ( <Button variant="contained" color="primary" 
                          className={classes.backButton} onClick={() => handleSubmit(createReview)}>
                            Submit
                          </Button>) :
                          ( <Button variant="contained" color="primary" 
                          className={classes.backButton} onClick={handleNext}>
                            Next
                          </Button>)
                        }
                      </div>
                    </div>
                  )}
                </div>
                </div>);
              }}
      </Mutation>
      
    </div>
    );

} 

export default Review;

const CREATE_REVIEW_MUTATION = gql`
  mutation($reviewData:ReviewInput!) {
    createReview(reviewData: $reviewData) {
      review {
        id
        salon {
          name
        }
        rating
        postedBy {
          username
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(3)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  container: {
    ...container,
    zIndex: 2
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
    //margin: theme.spacing.unit * 2,
    // width: 150, height: 150,
    fontSize: 35,
    padding: 0
  },
  button1: {
  //  "&:focus":{
      border: "3px solid red"
  //  }
  },
  button2: {
    "&:active":{
      border: "3px solid orange"
    }
  },
  icon: {
    marginLeft: theme.spacing.unit,
    width: 64, height: 64,
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  },
  grid: {
    verticalAlign: "top",
    display: "inline-block",
    textAlign: "center",
    width: "50px",
  },
  rating: {
    color: "#ffb400",
    fontSize: "1.8rem",
    width: "50px",

  }
}));


