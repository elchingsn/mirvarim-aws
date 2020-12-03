import React, { useState } from "react";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Mutation} from "@apollo/react-components";
import gql from "graphql-tag";
// @material-ui/core components
import Rating from '@material-ui/lab/Rating';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Error from "components/Shared/Error";
import Auth from "components/Auth"
import { REVIEW_QUERY } from "pages/SalonDetail"
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FlagIcon from '@material-ui/icons/Flag';
import { Tooltip } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const ReviewList = ({ reviews, currentUser, classes }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleCreateVote = (createVote,reviewId,isUseful,isReported) =>{
    createVote({variables: {reviewId:reviewId, isUseful:isUseful, isReported:isReported}}).catch(err => {
      console.error(err);
      history.push('/login')
    });
  }

  const handleDeleteVote = (deleteVote, voteId) =>{
    deleteVote({variables: { voteId }}).catch(err => { 
      console.error(err);
      history.push('/login')
    });
  }

  const VoteButton = ({ review }) => {
    return(
      // <Box display="flex" justifyContent="flex-end">
      <div>
        {currentUser ? 
          (!review.voteSet.map(el => el.votedBy.email).includes(currentUser.email) ? 
            ( 
              <Mutation
                mutation={CREATE_VOTE}
                refetchQueries={() => [{ query: REVIEW_QUERY, variables: {id:review.salon.id} }]}
              >
                {(createVote, { loading, error }) => {
                if (error) return <Error error={error} />;
                  return(
                    <Box display="flex">
                      <h5 className={classes.text}>
                        {t("Did you find it helpful?")} 
                      </h5>
                      <Box ml={1}>
                        <ThumbUpIcon                     
                          fontSize="small" 
                          onClick={() => handleCreateVote(createVote,review.id,true,false)} 
                          className={classes.button1}
                        />
                      </Box>
                      <Box ml={1} flexGrow={1}>
                        <ThumbDownIcon 
                          fontSize="small" 
                          onClick={() => handleCreateVote(createVote,review.id,false,false)} 
                          className={classes.button1}
                        />
                      </Box>
                      <Box mr={3}>
                        <Tooltip
                        id="tooltip-top"
                        title={t("report")}
                        placement="top"
                        //classes={{ tooltip: classes.tooltip }}
                        >
                          <FlagIcon 
                            fontSize="small" 
                            className={classNames(classes.floatRight,classes.button2)}
                            onClick={() => handleCreateVote(createVote,review.id,false,true)} 
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  );      
                }}
              </Mutation>   
            ):
            (
            <Mutation
              mutation={DELETE_VOTE}
              refetchQueries={() => [{ query: REVIEW_QUERY, variables: {id:review.salon.id} }]}
            >
              {(deleteVote, { loading, error }) => {
              if (error) return <Error error={error} />;
                return(
                  <Box display="flex" justifyContent="flex-start">
                    <h5 className={classes.text}>
                      {t("You have already voted.")}
                    </h5>
                    <Box ml={1}>
                      <DeleteForeverIcon 
                        fontSize="small" 
                        onClick={() => handleDeleteVote(deleteVote,review.voteSet.filter(el=>el.votedBy.email === currentUser.email)[0].id)} 
                        className={classes.button2}
                      />
                    </Box>
                  </Box> 
                );
              }}
            </Mutation>
          ))
        : (<div>
            <Box display="flex">
              <h5 className={classes.text}>
                {t("Did you find it helpful?")} 
              </h5>
              <Box ml={1}>
                <ThumbUpIcon                     
                  fontSize="small" 
                  onClick={() => setOpen(true)} 
                  className={classes.button1}
                />
              </Box>
              <Box ml={1} flexGrow={1}>
                <ThumbDownIcon 
                  fontSize="small" 
                  onClick={() => setOpen(true)} 
                  className={classes.button1}
                />
              </Box>
              <Box mr={3}>
                <Tooltip
                id="tooltip-top"
                title={t("report")}
                placement="top"
                >
                  <FlagIcon 
                    fontSize="small" 
                    className={classNames(classes.floatRight,classes.button2)}
                    onClick={() => setOpen(true)} 
                  />
                </Tooltip>
              </Box>
            </Box>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
            >
              <Auth/>
            </Dialog>
          </div>)
        }
      </div>
    );
  }

  return (
    <div>
    {reviews.map(review => (
      <Paper key={review.id} style={{ padding: "10px 10px", marginTop: 10 }}>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <Box display="flex" justifyContent="flex-start">
            <Rating value={review.rating} precision={0.1} size="small" readOnly/> 
            {review.voteSet.map(el=>el.isUseful).filter(Boolean).length !==0 &&
            (<h5 style={{ margin: 0, textAlign: "left" }}>
              &nbsp;{review.voteSet.map(el=>el.isUseful).filter(Boolean).length} {t("from")} {review.voteSet.map(el=>el.isUseful).length} {t("found it helpful")}
            </h5>)
            }
          </Box>
          <h5 style={{ margin: 0, textAlign: "left" }}>
            {review.postedBy.username}
            <span style={{color: "gray"}}> 
            &nbsp;on {review.postDate.substring(0,10).split('-').reverse().join('/')}
            </span>    
          </h5>
          <p style={{ textAlign: "left" }}>
            {review.comment}
          </p>
          <VoteButton review={review}/>
        </Grid>
      </Paper>

    ))}
    </div>
  );
} 

const CREATE_VOTE = gql`
  mutation($reviewId:Int!, $isUseful:Boolean, $isReported:Boolean) {
    createVote(reviewId: $reviewId, isUseful:$isUseful, isReported:$isReported ) {
      vote {
        id
        votedBy {
          id
          email
        }
        isUseful
        isReported
      }
    }
  }
`;

const DELETE_VOTE = gql`
  mutation($voteId: Int!) {
    deleteVote(voteId: $voteId) {
      voteId
    }
  }
`;

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  text: {
    textAlign: "left", 
    color: "gray", 
    margin:"0"
  },
  floatRight: {
    float: "right!important"
  },
  button1: {
    color: "#c0c0c0",
    cursor: "pointer",
    "&:hover,&:focus": {
      color: "#6600cc"
    }
  },
  button2: {
    color: "#c0c0c0",
    cursor: "pointer",
    "&:hover,&:focus": {
      color: "red"
    }
  }
};

export default withStyles(styles)(ReviewList);
                    