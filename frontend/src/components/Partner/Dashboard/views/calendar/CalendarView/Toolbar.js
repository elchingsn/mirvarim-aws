import React from 'react';
import classNames from 'classnames';
import { format, toDate } from 'date-fns'
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const viewOptions = [
    {
      label: `${t("Month")}`,
      value: 'dayGridMonth',
      icon: ViewConfigIcon
    },
    {
      label: `${t("Week")}`,
      value: 'timeGridWeek',
      icon: ViewWeekIcon
    },
    {
      label: `${t("Day")}`,
      value: 'timeGridDay',
      icon: ViewDayIcon
    },
    {
      label: `${t("Agenda")}`,
      value: 'listWeek',
      icon: ViewAgendaIcon
    }
  ];

  const viewOptionsMobile = [
    {
      label: `${t("Day")}`,
      value: 'timeGridDay',
      icon: ViewDayIcon
    },
    {
      label: `${t("Agenda")}`,
      value: 'listWeek',
      icon: ViewAgendaIcon
    }
  ];

  const classes = useStyles();
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
          <Button onClick={onDatePrev}>{t("Prev")}</Button>
          <Button onClick={onDateToday}>{t("Today")}</Button>
          <Button onClick={onDateNext}>{t("Next")}</Button>
        </ButtonGroup>
      </Grid>
        <Grid item>
          <Typography
            variant="h6"
            color="textPrimary"
          >
            {(view === 'listWeek') ?
              `${format(new Date(date),'dd')} - ${format(new Date(new Date(date).getTime() + 7*1440*60000),'dd MMMM yyyy')}` :
              ((view === 'timeGridDay') ? format(new Date(date),'dd MMMM yyyy') : format(new Date(date),'MMMM yyyy'))
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
      <Hidden mdUp>
        <Grid item>
          {viewOptionsMobile.map((viewOption) => {
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
