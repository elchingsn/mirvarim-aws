/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  Typography,
  makeStyles
} from '@material-ui/core';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import PieChartIcon from '@material-ui/icons/PieChart';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NavItem from './NavItem';

function renderNavItems({
  items,
  pathname,
  depth = 0
}) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth
}) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile, user }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const sections = [
    {
      subheader: 'Reports',
      items: [
        {
          title: 'Dashboard',
          icon: PieChartIcon,
          href: `/partner/${user.id}/report`
        }
      ]
    },
    {
      subheader: 'Listings',
      items: [
        {
          title: 'Salons',
          href: `/partner/${user.id}/salon/view`,
          icon: BusinessCenterIcon,
          items: [
            {
              title: 'Browse Salon',
              href: `/partner/${user.id}/salon/view`
            },
            {
              title: 'Create Salon',
              href: `/partner/${user.id}/salon/create`
            },
            {
              title: 'Update Salon',
              href: `/partner/${user.id}/salon/edit`
            }
          ]
        },
        {
          title: 'Masters',
          href: `/partner/${user.id}/master/view`,
          icon: BusinessCenterIcon,
          items: [
            // {
            //   title: 'View Masters',
            //   href: `/partner/${user.id}/master/view`
            // },
            {
              title: 'Add Master',
              href: `/partner/${user.id}/master/add`
            },
            {
              title: 'Update Master',
              href: `/partner/${user.id}/master/edit`
            }
          ]
        },
        {
          title: 'Services',
          href: `/partner/salon/:id/service/view`,
          icon: BusinessCenterIcon,
          items: [
            // {
            //   title: 'Browse Services',
            //   href: `/partner/${user.id}/service/view`
            // },
            {
              title: 'Create Service',
              href: `/partner/${user.id}/service/create`
              // href: `/partner/salon/create`
            },
            {
              title: 'Update Service',
              href: `/partner/${user.id}/service/edit`
            }
          ]
        }
      ]
    },
    {
      subheader: 'Applications',
      items: [
        {
          title: 'Calendar',
          href: `/partner/${user.id}/calendar`,
          icon: ReceiptIcon
        }
      ]  
    }
  ];
  
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
        <Box p={2}>
          {sections.map((section) => (
            <List
              key={section.subheader}
              subheader={(
                <ListSubheader
                  disableGutters
                  disableSticky
                >
                  {section.subheader}
                </ListSubheader>
              )}
            >
              {renderNavItems({
                items: section.items,
                pathname: location.pathname
              })}
            </List>
          ))}
        </Box>
        <Divider />
        <Box p={2}>
          <Box
            p={2}
            borderRadius="borderRadius"
            bgcolor="background.dark"
          >
            <h4>
              Need Help?
              </h4>
            <Link
              variant="subtitle1"
              color="secondary"
              component={RouterLink}
              to="/"
            >
              Contact us
            </Link>
          </Box>
        </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
