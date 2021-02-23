import React, {useContext} from "react";
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
import DescriptionIcon from '@material-ui/icons/Description';
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from "@material-ui/core/Divider";
import Button from '@material-ui/core/Button';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
//import format from "date-fns/format";
import { DELETE_BOOKING } from "components/Partner/Dashboard/views/calendar/CalendarView/CreateEventForm.js"

import GridContainer from "components/Partials/GridContainer.js";
import GridItem from "components/Partials/GridItem.js";
import NavPills from "components/Partials/NavPills.js";
import FavoriteListings from "components/Partials/FavoriteListings";
import Loading from "components/Shared/Loading";
import Error from "components/Shared/Error"
import { UserContext } from "App.js"
import format from 'date-fns/format'

import styles from "assets/jss/profilePageStyle.js";
const useStyles = makeStyles(styles);


const Profile = ({ match }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const currentUser = useContext(UserContext);

  const id = match.params.id;

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
    <Query query={PROFILE_QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;
       return (
          <div className={classes.container}>
          <div className={classes.profileTabs}>
            <NavPills
              alignCenter
              color="primary"
              tabs={[
                {
                  tabButton: `${t("Balance")}`,
                  tabIcon: AccountBalanceWalletIcon,
                  tabContent: (<Balance currentUser={currentUser} />)
                },
                {
                  tabButton: `${t("Transactions")}`,
                  tabIcon: DescriptionIcon,
                  tabContent: (<Transaction currentUser={currentUser} />)
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

const Balance = ({ currentUser }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let balance = []
  if (currentUser.salonSet[0]) {
    balance = currentUser.salonSet[0].balanceSet[0]
  } else {
      return (
        <GridContainer>
          <h4>{t("No salon added. Please add a salon")}</h4>
        </GridContainer>
      )
  }

  return (
    <GridContainer>
      <GridItem
        xs={12}
        sm={12}
        md={7}
        className={classes.gridItem}
      >
        <h3 className={classes.title}><b>{t("Balance details")}</b></h3>
        <ul className={classes.listUnstyled}>
          {balance === undefined ?
            (<li>
              {t("Amount")}: 0 AZN
            </li>) : 
            (<li>
              {t("Amount")}: {balance.amount} AZN
            </li>) 
          }
        </ul>      
      </GridItem>
    </GridContainer>
  )
}

const Transaction = ({ currentUser }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let transactions = []
  if (currentUser.salonSet[0]) {
    transactions = currentUser.salonSet[0].transactionSet
  } else {
      return (
        <GridContainer>
          <h4>{t("No salon added. Please add a salon")}</h4>
        </GridContainer>
      )
  }

  return (
    <GridContainer>
      <GridItem
        xs={12}
        sm={12}
        md={7}
        className={classes.gridItem}
      >
        <h3 className={classes.title}><b>{t("Transaction details")}</b></h3>
        <ul className={classes.listUnstyled}>
          {(transactions===undefined) || (transactions.length===0) ?
            (<li>
              {t("No transaction recorded")}
            </li>) : 
            (<div>
              {transactions.map(transaction => {
                return (
                  <li key={transaction.id}>
                    {transaction.date.slice(0,16).replace("T","/")}:
                    {transaction.amount} AZN ({t(transaction.description.split(' ').slice(0,-1).join(' '))} {transaction.description.split(' ').slice(-1)})
                  </li>
                )
              })}
            </div>
            )}
        </ul>      
      </GridItem>
    </GridContainer>
  )
}

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
