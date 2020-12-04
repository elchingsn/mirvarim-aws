import React from "react";
import { Query } from "@apollo/react-components";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Favorite from "@material-ui/icons/Favorite";
import EventIcon from '@material-ui/icons/Event';
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from "@material-ui/core/Divider";
import Button from '@material-ui/core/Button';
//import format from "date-fns/format";
import { DELETE_BOOKING } from "components/Partner/Dashboard/views/calendar/CalendarView/CreateEventForm.js"

import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import NavPills from "components/Partials/NavPills.js";
import FavoriteListings from "components/Partials/FavoriteListings";
import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error"

import styles from "assets/jss/profilePageStyle.js";
const useStyles = makeStyles(styles);


const Profile = ({ match }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const id = match.params.id;

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const [deleteBooking, { data: delete_data }] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: PROFILE_QUERY, variables: { id }}],
    awaitRefetchQueries: true,
  });

  const handleDeleteBooking = (id) =>{  
    deleteBooking({variables: { bookingId: id }}).catch(err => {
      console.error(err);
    });
  }

  return (
    <Query query={PROFILE_QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;
        const favoriteSalons = data.user.likeSet.map(el => el.salon);
        const countReviews = data.user.reviewSet.length;
        const countLikes = data.user.likeSet.length;
        const countVotes = data.user.voteSet.length;
       return (
          <div className={classes.container}>
            {/* User Info Card */}
            <Card className={classes.card}>
              <CardHeader
                avatar={<Avatar>{data.user.username[0]}</Avatar>}
                title={`${t("Welcome")}, ${data.user.username}`}
                subheader={`${t("Joined on")} ${data.user.dateJoined.substring(0,10).split("-").reverse().join("/")}`}
              />
            </Card>

          <div className={classes.profileTabs}>
            <NavPills
              alignCenter
              color="primary"
              tabs={[
                {
                  tabButton: `${t("Favorites")}`,
                  tabIcon: Favorite,
                  tabContent: (
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={7}
                        className={classes.gridItem}
                      >
                        <h4 className={classes.title}>{t("Latest Favorites")}</h4>
                        <FavoriteListings listings={favoriteSalons}/>
                      </GridItem>

                      <GridItem
                        xs={12}
                        sm={12}
                        md={2}
                        className={classes.gridItem}
                      >
                        <h4 className={classes.title}>{t("Stats")}</h4>
                        <ul className={classes.listUnstyled}>
                          <li>
                            <b>{countLikes}</b> {t("favorite",{count:{countLikes}})}
                          </li>
                          <li>
                            <b>{countReviews}</b> {t("review",{count:{countReviews}})}
                          </li>
                          <li>
                            <b>{countVotes}</b> {t("vote",{count:{countVotes}})}
                          </li>
                        </ul>
                      </GridItem>
                    </GridContainer>
                  )
                },
                {
                  tabButton: `${t("Bookings")}`,
                  tabIcon: EventIcon,
                  tabContent: (
                    <div>
                      <Paper elevation={1} className={classes.paper}>
                        <Typography variant="title" className={classes.title}>
                          {`${t("Upcoming bookings")}: ${data.user.bookingSet.filter(event => (new Date(event.start)-new Date())>0).length}`}
                        </Typography>
                        {data.user.bookingSet.filter(event => (new Date(event.start)-new Date())>0).map(booking => (
                          <div key={booking.id} className={classes.collections}>
                          <GridContainer>
                            <GridItem
                              xs={9}
                              sm={6}
                              md={4}
                              lg={3}
                              className={classes.gridItem}
                            >
                            <Typography variant="title" className={classes.title}>
                              {`${new Date(booking.start).toString().slice(0,21)}`}
                            </Typography>
                            <Typography>
                              {`${t("Salon")}: ${booking.master.salon.name} ${t("with")} ${booking.master.masterName}`}
                            </Typography>
                            <Typography>
                              {`${t("Service")}: ${booking.serviceTitle}`}
                            </Typography>
                            <Typography>
                              {`${t("Amount")}: ${booking.servicePrice} AZN`}
                            </Typography>
                            <Typography>
                              {`${t("Address")}: ${booking.master.salon.address}`}
                            </Typography>
                            <Typography>
                              {`${t("Phone")}: ${booking.master.salon.phone}`}
                            </Typography>
                            </GridItem>
                            <GridItem
                              xs={3}
                              sm={6}
                              md={8}
                              lg={9}
                              className={classes.gridItem}
                            >
                              <Button color="primary" size="large" onClick={() => handleDeleteBooking(booking.id)}>
                                <DeleteIcon/>
                              </Button>
                            </GridItem>
                            </GridContainer>
                            <Divider className={classes.divider} />
                          </div>
                        ))}
                      </Paper>
                    </div>
                  )
                },
                {
                  tabButton: `${t("Reviews")}`,
                  tabIcon: ThumbUpIcon,
                  tabContent: (
                    <div>
                      <Paper elevation={1} className={classes.paper}>
                        <Typography variant="title" className={classes.title}>
                          {t("Comments")}
                        </Typography>
                        {data.user.reviewSet.filter(review => (review.comment != "")).map(review => (
                          <div key={review.id} className={classes.collections}>
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
          id
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
      voteSet{
        id
        isUseful
        isReported
      }
      bookingSet {
        id
        serviceTitle
        servicePrice
        start
        master {
          id
          masterName
          salon {
            id
            name
            address
            phone
          }
        }
      }   
    }
  }
`;

export default Profile;
