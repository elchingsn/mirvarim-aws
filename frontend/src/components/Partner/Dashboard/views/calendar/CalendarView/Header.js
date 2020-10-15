import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from "classnames";
import PropTypes from 'prop-types';
import {
  Button,
  Breadcrumbs,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ControlPointIcon from '@material-ui/icons/ControlPoint';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const Header = ({
  className,
  //onAddClick,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Grid
      className={classNames(classes.root, className)}
      container
      justify="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Calendar
          </Typography>
        </Breadcrumbs>
        {/* <Typography
          variant="h4"
          color="textPrimary"
        >
          Calendar manager
        </Typography> */}
      </Grid>
      <Grid item>
        {/* <Button
          color="secondary"
          variant="contained"
          onClick={onAddClick}
          className={classes.action}
          startIcon={
            <SvgIcon fontSize="small">
              <ControlPointIcon />
            </SvgIcon>
          }
        >
          New Event
        </Button> */}
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  onAddClick: PropTypes.func
};

Header.defaultProps = {
  onAddClick: () => {}
};

export default Header;
