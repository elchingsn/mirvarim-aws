/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  makeStyles
} from '@material-ui/core';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import PieChartIcon from '@material-ui/icons/PieChart';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
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
  const { t } = useTranslation();


  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const sections = [
    {
      subheader: `${t("Finances")}`,
      items: [
        {
          title: `${t("Balance")}`,
          href: `/partner/${user.id}/account`,
          icon: AccountBalanceIcon
        }
      ]
    },
    {
      subheader: `${t("Listings")}`,
      items: [
        {
          title: `${t("Salon")}`,
          href: `/partner/${user.id}/salon/view`,
          icon: BusinessCenterIcon,
          items: [
            {
              title: `${t("Browse Salon")}`,
              href: `/partner/${user.id}/salon/view`
            },
            {
              title: `${t("Add Salon")}`,
              href: `/partner/${user.id}/salon/create`
            },
            {
              title: `${t("Update Salon")}`,
              href: `/partner/${user.id}/salon/edit`
            }
          ]
        },
        {
          title: `${t("Masters")}`,
          href: `/partner/${user.id}/master/view`,
          icon: SupervisorAccountIcon,
          items: [
            // {
            //   title: 'View Masters',
            //   href: `/partner/${user.id}/master/view`
            // },
            {
              title: `${t("Add Master")}`,
              href: `/partner/${user.id}/master/add`
            },
            {
              title: `${t("Update Master")}`,
              href: `/partner/${user.id}/master/edit`
            },
            {
              title: `${t("Business hours")}`,
              href: `/partner/${user.id}/master/hours`
            }
          ]
        },
        {
          title: `${t("Services")}`,
          href: `/partner/salon/:id/service/view`,
          icon: LoyaltyIcon,
          items: [
            // {
            //   title: 'Browse Services',
            //   href: `/partner/${user.id}/service/view`
            // },
            {
              title: `${t("Add Service")}`,
              href: `/partner/${user.id}/service/create`
              // href: `/partner/salon/create`
            },
            {
              title: `${t("Update Service")}`,
              href: `/partner/${user.id}/service/edit`
            }
          ]
        }
      ]
    },
    {
      subheader: `${t("Applications")}`,
      items: [
        {
          title: `${t("Calendar")}`,
          href: `/partner/${user.id}/calendar`,
          icon: ReceiptIcon
        }
      ]  
    },
    {
      subheader: `${t("Reports")}`,
      items: [
        {
          title: `${t("Dashboard")}`,
          icon: PieChartIcon,
          href: `/partner/${user.id}/report`
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
              {t("Need Help?")}
            </h4>
            <Link
              variant="subtitle1"
              color="secondary"
              component={RouterLink}
              to={`/partner/${user.id}/contact`}
            >
              {t("Contact us")}
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
