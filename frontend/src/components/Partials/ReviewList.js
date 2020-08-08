import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Rating from '@material-ui/lab/Rating';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const ReviewList = ({reviews}) => {
  return (
    <div>
    {reviews.map(review => (
      <Paper style={{ padding: "10px 10px", marginTop: 10 }}>
        <Grid justifyContent="left" item xs zeroMinWidth>
            <div>
            <Rating value={review.rating} size="small" readOnly/> 
            </div>
            <h5 style={{ margin: 0, textAlign: "left" }}>
              {review.postedBy.username}
              <span style={{color: "gray"}}> 
              &nbsp;on {review.postDate.substring(0,10).split('-').reverse().join('/')}
              </span>    
            </h5>
            <p style={{ textAlign: "left" }}>
              {review.comment}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              Did you find this review useful?
              &nbsp;<button onClick={()=> console.log("YES")} style={{padding: "2px", border: "none", borderRadius:"15px", background: "gray", color:"white", cursor:"pointer"}}>Yes</button>
              &nbsp;<button style={{padding: "2px", border: "none", borderRadius:"15px", background: "gray", color:"white", cursor:"pointer"}}>No</button>
            </p>
        </Grid>
      </Paper>

    ))}
    </div>
  );
} 

export default ReviewList;
                    