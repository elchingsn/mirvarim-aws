import React from "react";
import { ApolloConsumer, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Favorite from "@material-ui/icons/Favorite";
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import Divider from "@material-ui/core/Divider";
import Badge from '@material-ui/core/Badge';
import format from "date-fns/format";

import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import NavPills from "components/Partials/NavPills.js";
import FavoriteListings from "components/Partials/FavoriteListings";
import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error"

import styles from "assets/jss/profilePageStyle.js";
const useStyles = makeStyles(styles);


const Profile = ({ match }) => {
  const classes = useStyles();
  const id = match.params.id;
  console.log(id);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
    <Query query={PROFILE_QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;
        const favoriteSalons = data.user.likeSet.map(el => el.salon);
        console.log(data);
       return (
          <div className={classes.container}>
            {/* User Info Card */}
            <Card className={classes.card}>
              <CardHeader
                avatar={<Avatar>{data.user.username[0]}</Avatar>}
                title={data.user.username}
                subheader={`Joined on ${data.user.dateJoined.substring(0,10).split("-").reverse().join("/")}`}
              />
            </Card>

          <div className={classes.profileTabs}>
            <NavPills
              alignCenter
              color="primary"
              tabs={[
                {
                  tabButton: "Favorites",
                  tabIcon: Favorite,
                  tabContent: (
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={7}
                        className={classes.gridItem}
                      >
                        <h4 className={classes.title}>Latest Favorites</h4>
                        <FavoriteListings listings={favoriteSalons}/>
                      </GridItem>

                      <GridItem
                        xs={12}
                        sm={12}
                        md={2}
                        className={classes.gridItem}
                      >
                        <h4 className={classes.title}>Stats</h4>
                        <ul className={classes.listUnstyled}>
                          <li>
                            <b>{data.user.likeSet.length}</b> Favorites
                          </li>
                          <li>
                            <b>{data.user.reviewSet.length}</b> Reviews
                          </li>
                          <li>
                            <b>0</b> Votes
                          </li>
                        </ul>
                      </GridItem>
                    </GridContainer>
                  )
                },
                {
                  tabButton: "Reviews",
                  tabIcon: ThumbUpIcon,
                  tabContent: (
                    <div>
                      <Paper elevation={1} className={classes.paper}>
                        <Typography variant="title" className={classes.title}>
                          Comments
                        </Typography>
                        {data.user.reviewSet.filter(review => (review.comment != "")).map(review => (
                          <div key={review.id}>
                            <Typography variant="title" className={classes.title}>
                              {`${review.salon.name} on ${review.postDate.substring(0,10)}`}
                            </Typography>
                            <Typography>
                              {review.comment}
                            </Typography>
                            <Divider className={classes.divider} />
                          </div>
                        ))}
                      </Paper>
                    </div>
                  )
                }
              ]}
            />
          </div>
          </div>
       );
     }}
    </Query>
  );
};

export const PROFILE_QUERY = gql`
  query profile ($id:ID!){
    user(id: $id) {
      id
      username
      dateJoined
      reviewSet {
        id
        salon {
          name
        }
        comment
        postDate
      }
      role
      likeSet {
        id
        salon {
          id 
          name
          address
          priceRange
          photoMain
          reviewSet{
            rating
          }
        }
      }
    }
  }
`;

export default Profile;
