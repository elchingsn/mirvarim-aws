import React from 'react';
import classNames from 'classnames';
import { format, toDate } from 'date-fns'
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Grid,
  Hidden,
  IconButton,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import ViewConfigIcon from '@material-ui/icons/ViewComfyOutlined';
import ViewWeekIcon from '@material-ui/icons/ViewWeekOutlined';
import ViewDayIcon from '@material-ui/icons/ViewDayOutlined';
import ViewAgendaIcon from '@material-ui/icons/ViewAgendaOutlined';

const viewOptions = [
  {
    label: 'Month',
    value: 'dayGridMonth',
    icon: ViewConfigIcon
  },
  {
    label: 'Week',
    value: 'timeGridWeek',
    icon: ViewWeekIcon
  },
  {
    label: 'Day',
    value: 'timeGridDay',
    icon: ViewDayIcon
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: ViewAgendaIcon
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const Toolbar = ({
  className,
  date,
  onDateNext,
  onDatePrev,
  onDateToday,
  onAddClick,
  onViewChange,
  view,
  ...rest
}) => {
  const classes = useStyles();
  console.log('toolbar date', date)
  console.log('view', view)
  //{format(new Date(date),'dd')} - {format(new Date(new Date(date).getTime() + 7*1440*60000),'dd MMMM yyyy')}

  return (
    <Grid
      className={classNames(classes.root, className)}
      alignItems="center"
      container
      justify="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <ButtonGroup size="small">
          <Button onClick={onDatePrev}>Prev</Button>
          <Button onClick={onDateToday}>Today</Button>
          <Button onClick={onDateNext}>Next</Button>
        </ButtonGroup>
      </Grid>
        <Grid item>
          <Typography
            variant="h5"
            color="textPrimary"
          >
            {(view == 'listWeek') ?
              `${format(new Date(date),'dd')} - ${format(new Date(new Date(date).getTime() + 7*1440*60000),'dd MMMM yyyy')}` :
              format(new Date(date),'MMMM yyyy')
            } 
          </Typography>
        </Grid>
        <Hidden smDown>
        <Grid item>
          {viewOptions.map((viewOption) => {
            const Icon = viewOption.icon;

            return (
              <Tooltip
                key={viewOption.value}
                title={viewOption.label}
              >
                <IconButton
                  color={viewOption.value === view ? 'secondary' : 'default'}
                  onClick={() => onViewChange(viewOption.value)}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            );
          })}
        </Grid>
      </Hidden>
    </Grid>
  );
};

Toolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateToday: PropTypes.func,
  onAddClick: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'])
};

Toolbar.defaultProps = {
  onDateNext: () => {},
  onDatePrev: () => {},
  onDateToday: () => {},
  onAddClick: () => {},
  onViewChange: () => {}
};

export default Toolbar;
