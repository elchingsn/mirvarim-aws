import React, {
  useRef,
  useState,
  useEffect
} from 'react';
import gql from "graphql-tag";
import { useMutation } from '@apollo/react-hooks'; 
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {ME_QUERY} from "App.js"


const useStyles = makeStyles((theme) => ({
  popover: {
    width: 250
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  sup: {
    verticalAlign: "super",
    fontSize: "12px",
    //color: "red" 
  }
}));

const Notifications = ({ user }) => {

  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);    
  const { t } = useTranslation();
  
  const [updateMaster, { data: update_data }] = useMutation(UPDATE_MASTER_MUTATION, {
    onCompleted({ updateMaster }) {
      //history.push(`/partner/${user.id}/salon/view`);
      console.log(update_data)
    },
    refetchQueries: [{ query: ME_QUERY, variables: {id:user.id} }],
    awaitRefetchQueries: true,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let notifications = []
  const staff = user.masterSet[0]

  if (staff) {
    if (staff.staffStatus === "pending") {
      notifications.push({
        "title": "Connection request",
        "description": `${staff.salon.name} wants to add you`
      })
    }
  }

  return (
    <>
      <Tooltip title={t("Notifications")}>
        <IconButton
          color="inherit"
          ref={ref}
          onClick={handleOpen}
        >
          {/* <NotificationsIcon /> */}
          <i className="fas fa-bell">
            {notifications.length > 0 ? (<sup className={classes.sup}>&nbsp;{notifications.length}</sup>) : null}
          </i>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={1}>
          <h3><strong>{t("Notifications")}</strong></h3>
        </Box>
        {notifications.length === 0 ? (
          <Box p={1}>
            <h4> {t("There are no notifications")} </h4>
          </Box>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification) => {

                return (
                  <div key={notification.id}>
                    <ListItem
                      component={RouterLink}
                      divider
                      key={notification.id}
                    >
                    {/* <ListItemAvatar>
                      <Avatar
                        className={classes.icon}
                      >
                        <SvgIcon fontSize="small">
                          <Icon />
                        </SvgIcon>
                      </Avatar>
                    </ListItemAvatar> */}
                    <ListItemText
                      primary={notification.title}
                      primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                      secondary={notification.description}
                    />
                  </ListItem>
                  <Box
                      p={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Button
                        size="small"
                        onClick={() => 
                          updateMaster({variables: { 
                            masterData: {
                              name: staff.masterName,
                              email: staff.masterEmail,
                              phone: staff.masterPhone,
                              isStaff: false,
                              status: "rejected"
                            },
                            masterId: parseInt(staff.id) 
                          }}).catch(err => {
                            console.error(err);
                          })
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        size="small"
                        onClick={() => 
                          updateMaster({variables: { 
                            masterData: {
                              name: staff.masterName,
                              email: staff.masterEmail,
                              phone: staff.masterPhone,
                              isStaff: true,
                              status: "confirmed"
                            },
                            masterId: parseInt(staff.id) 
                          }}).catch(err => {
                            console.error(err);
                          })
                        }
                      >
                        Approve
                      </Button>
                    </Box>
                  </div>
                );
              })}
            </List>
            {/* <Box
              p={1}
              display="flex"
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                size="small"
                to="#"
              >
                Mark all as read
              </Button>
            </Box> */}
          </>
        )}
      </Popover>
    </>
  );
};

const UPDATE_MASTER_MUTATION = gql`
  mutation($masterData:MasterInput!,$masterId:Int!) {
    updateMaster(masterData: $masterData, masterId: $masterId) {
      master {
        id
        masterName
        masterEmail
        masterPhone
      }
    }
  }
`;

export default Notifications;
