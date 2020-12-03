// import 'assets/jss/fullcalendar/core_main.css';
// import 'assets/jss/fullcalendar/daygrid_main.css';
// import 'assets/jss/fullcalendar/timegrid_main.css';
// import 'assets/jss/fullcalendar/list_main.css';
//import '@fullcalendar/common/main.css';
import React, {
  useState,
  useRef,
  useEffect,
  useContext
} from 'react';
import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import gql from "graphql-tag";
import { UserContext } from "App.js"
//import {ME_QUERY} from "App.js"
import { useTranslation } from 'react-i18next';

// import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  Container,
  Dialog,
  Paper,
  useTheme,
  useMediaQuery,
  makeStyles,
  Button,
  Grid,
  SvgIcon
} from '@material-ui/core';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
// import Page from 'src/components/Page';
// import { useDispatch, useSelector } from 'src/store';
// import {
//   getEvents,
//   updateEvent,
//   selectEvent,
//   selectRange,
//   openModal,
//   closeModal
// } from 'src/slices/calendar';
import Header from './Header';
import Toolbar from './Toolbar';
import CreateEventForm from './CreateEventForm';
import UpdateEventForm from './UpdateEventForm';
// new addition
//import toDate from 'date-fns/toDate'
import formatISO from 'date-fns/formatISO'
//import Error from "components/Shared/Error"; 
import Loading from "components/Shared/Loading";

// const selectedEventSelector = (state) => {
//   const { events, selectedEventId } = state.calendar;

//   if (selectedEventId) {
//     return events.find((_event) => _event.id === selectedEventId);
//   } else {
//     return null;
//   }
// };

const CalendarView = () => {
  const history = useHistory();
  const currentUser = useContext(UserContext);

  const { data, loading, error } = useQuery(BOOKING_QUERY, {
    variables: {salonId: currentUser.salonSet[0].id},
    pollInterval: 3000,
  })
  if (loading) return <Loading />;
  if (error) { history.push('/login') }
  //console.log('all bookings',data)

  return <SelectedCalendar currentUser={currentUser} bookings={data.bookings}/>
}

const SelectedCalendar =({currentUser, bookings}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const salon = currentUser.salonSet[0];
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedMaster, setSelectedMaster] = useState ({
    masterName: "All",
    masterId: null,
    masterBookings: [] 
  })

  useEffect(() => {
    if (selectedMaster.masterName === "All") {
      setSelectedMaster ({
        ...selectedMaster,
        masterBookings: bookings
      })
    } else {
      setSelectedMaster ({
        ...selectedMaster,
        masterBookings: bookings.filter(booking => booking.master.masterName === selectedMaster.masterName)
      })
    }
  }, [bookings])

  const handleMasterSelect = (value) => {
    if (value === "All") {
      setSelectedMaster ({
        ...selectedMaster,
        masterName: value,
        masterId: null,
        masterBookings: bookings
      })
    } else {
      setSelectedMaster ({
        ...selectedMaster,
        masterName: value,
        masterId: salon.masterSet.filter(master => master.masterName === value)[0].id,
        masterBookings: bookings.filter(booking => booking.master.masterName === value)
      })
    }
  }

  return (
    <div>
    <Header/> 
      <Grid
        container
        justify="space-between"
        spacing={3}
        style={{paddingLeft:"30px", paddingRight:"30px"}}
      >
      <Grid item>
        <FormControl margin="normal" required fullWidth>
          <NativeSelect
            value={selectedMaster.masterName}
            onChange={event => handleMasterSelect(event.target.value)}
            name="service"
            inputProps={{ 'aria-label': 'role' }}
          > 
            <option value="All">{t("All")}</option>
            {[...new Set(bookings.map(booking => booking.master.masterName))].map((name,index) => (
              <option  key={index} value={name}>
                {name} 
              </option>
            ))}
          </NativeSelect>
        <FormHelperText>{t("Select master")}</FormHelperText>
      </FormControl>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => setModalOpen(true)}
          className={classes.action}
          startIcon={
            <SvgIcon fontSize="small">
              <ControlPointIcon />
            </SvgIcon>
          }
        >
          {t("New Event")}
        </Button>
      </Grid>
    </Grid>
    <Calendar 
      //currentUser={currentUser} 
      salon={salon}
      masterId={selectedMaster.masterId}
      bookings={selectedMaster.masterBookings} 
      isModalOpen={isModalOpen} 
      setModalOpen={setModalOpen} 
    />
  </div>
  )
}

const Calendar = ({salon, masterId, bookings, isModalOpen, setModalOpen}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const calendarRef = useRef(null);
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  // const dispatch = useDispatch();
  // const { events, isModalOpen, selectedRange } = useSelector((state) => state.calendar);
  // const selectedEvent = useSelector(selectedEventSelector);
  const [date, setDate] = useState(formatISO(new Date()));
  const [view, setView] = useState(mobileDevice ? 'listWeek' : 'dayGridMonth');
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedRange, setSelectedRange] = useState({
    start: '',
    duration: 30
  });

  // Math.floor((new Date(end) - new Date(start))/60000) converts the milliseconds to duration in minutes
  // const [createBooking, { data: create_data }] = useMutation(CREATE_BOOKING);
  // const [updateBooking, { data: update_data }] = useMutation(UPDATE_BOOKING);
  // const [deleteBooking, { data: delete_data }] = useMutation(DELETE_BOOKING);

  const events = _.map(bookings, function(item, index) {
    return {
      id: index.toString(),
      title: item.customerName,
      start: item.start,
      end: item.end,
      extendedProps: {
        bookingId: parseInt(item.id),
        mobile: item.customerMobile,
        service: item.serviceTitle,
        price: item.servicePrice
      }
    }
  })

  //console.log ('events', events);

  //create array of all services offered by the salon
  const hairServices = salon.hairserviceSet
  const nailsServices = salon.nailsserviceSet
  const hairRemovalServices = salon.hairremovalserviceSet 
  const makeupServices = salon.makeupserviceSet
  const massageServices = salon.massageserviceSet
  const services = [...hairServices, ...nailsServices, ...hairRemovalServices, ...makeupServices, ...massageServices]   

  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  // const handleAddClick = () => {
  //   setModalOpen(true)
  // };

  const handleRangeSelect = async (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    await setSelectedRange({
      ...selectedRange,
      start: formatISO(arg.start).slice(0,16),
      duration: Math.floor((arg.end - arg.start)/60000)
    })
    setModalOpen(true)
  };

  const handleEventSelect = async (arg) => {
    // dispatch(selectEvent(arg.event.id));
    await setSelectedEvent(events[arg.event.id]);
    setUpdateModalOpen(true);
  };

  // const handleEventResize = async ({ event }) => {
  //   try {
  //     await dispatch(updateEvent(event.id, {
  //       allDay: event.allDay,
  //       start: event.start,
  //       end: event.end
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleEventDrop = async ({ event }) => {
  //   try {
  //     await dispatch(updateEvent(event.id, {
  //       allDay: event.allDay,
  //       start: event.start,
  //       end: event.end
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleModalClose = () => {
    setModalOpen(false)
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false)
  };

  useEffect(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = mobileDevice ? 'listWeek' : 'dayGridMonth';

      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [mobileDevice]);

  return (
    <div
      className={classes.root}
    >
      <Container maxWidth={false}>
        {/* <Header onAddClick={handleAddClick} /> */}
        <Toolbar
          date={date}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onDateToday={handleDateToday}
          onViewChange={handleViewChange}
          view={view}
        />
        {!salon.appointment && 
          <h6> 
            {t("Customer access to your calendar and booking from the website is available in standard package.")}
          </h6>
        }
        <Paper className={classes.calendar}>
          <FullCalendar
            schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
            headerToolbar={false}
            allDayMaintainDuration
            defaultDate={date}
            defaultView={view}
            droppable
            editable
            eventClick={handleEventSelect}
            //eventDrop={handleEventDrop}
            eventLimit
            eventResizableFromStart
            //eventResize={handleEventResize}
            events={events}
            header={false}
            height={800}
            ref={calendarRef}
            rerenderDelay={10}
            select={handleRangeSelect}
            selectable
            weekends 
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              timelinePlugin
            ]}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: true
            }}
            eventColor='#378006'
            eventBackgroundColor='green'
            className={classes.calendar}
          />
        </Paper>
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleModalClose}
          open={isModalOpen}
        >
          {isModalOpen && (
            <CreateEventForm
              salon={salon}
              services={services}
              masterId={masterId}
              range={selectedRange}
              handleModalClose={handleModalClose}
              // range={selectedRange}

              // onAddComplete={handleModalClose}
              // onCancel={handleModalClose}
              // onDeleteComplete={handleModalClose}
              // onEditComplete={handleModalClose}
            />
          )}
        </Dialog> 
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleUpdateModalClose}
          open={isUpdateModalOpen}
        >
          {isUpdateModalOpen && (
            <UpdateEventForm
              salon={salon}
              services={services}
              handleUpdateModalClose={handleUpdateModalClose}
              event={selectedEvent}
              // range={selectedRange}

              // onAddComplete={handleModalClose}
              // onCancel={handleModalClose}
              // onDeleteComplete={handleModalClose}
              // onEditComplete={handleModalClose}
            />
          )}
        </Dialog> 
      </Container>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  calendar: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    '& .fc .fc-head': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc .fc-body': {
      backgroundColor: theme.palette.background.default
    },
    '& .fc .fc-row': {
      borderColor: theme.palette.divider
    },
    '& .fc .fc-axis': {
      ...theme.typography.body2
    },
    '& .fc .fc-divider': {
      backgroundColor: theme.palette.background.dark,
      borderColor: theme.palette.divider
    },
    '& .fc th': {
      borderColor: theme.palette.divider
    },
    '& .fc td': {
      borderColor: theme.palette.divider
    },
    '& .fc td.fc-today': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc .fc-highlight': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc .fc-event': {
      backgroundColor: theme.palette.primary.light,
      //color: theme.palette.secondary.contrastText,
      color: "white",
      borderWidth: 2,
      opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit'
      },
      '& .fc-title': {
        ...theme.typography.body1,
        color: 'inherit'
      }
    },
    '& .fc .fc-day-top': {
      ...theme.typography.body2
    },
    '& .fc .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.dark
    },
    '& .fc .fc-list-view': {
      borderColor: theme.palette.divider
    },
    '& .fc .fc-list-empty': {
      ...theme.typography.subtitle1
    },
    '& .fc .fc-list-heading td': {
      backgroundColor: theme.palette.background.dark,
      borderColor: theme.palette.divider
    },
    '& .fc .fc-list-heading-main': {
      ...theme.typography.h6
    },
    '& .fc .fc-list-heading-alt': {
      ...theme.typography.h6
    },
    '& .fc .fc-list-item:hover td': {
      backgroundColor: theme.palette.background.dark,
    },
    '& .fc .fc-event-title': {
      ...theme.typography.body3
    },
    '& .fc .fc-event-time': {
      ...theme.typography.body3
    }
  }
}));

const BOOKING_QUERY = gql `
  query ($salonId:String, $customerEmail:String) {
    bookings (id:$salonId, email:$customerEmail)
    {
      id
      master {
        id
        masterName
        masterEmail
        masterPhone
        salon {
          id
          name
        }
      }
      customer {
        id  
        username
        email
      }
      customerName
      customerMobile
      serviceTitle
      servicePrice
      start
      end
    }    
  }
`;

const CREATE_BOOKING = gql `
  mutation ($bookingData: BookingInput!) {
    createBooking(
      bookingData: $bookingData
    ) {
      booking {
        id
        master {
          id
          masterName
          masterEmail
          masterPhone
          salon {
            id
            name
          }
        }
        customer {
          id
          username
        }
      }
    }
  }
`;

const UPDATE_BOOKING = gql `
  mutation ($bookingId: Int!, $bookingData: BookingInput!) {
    updateBooking(
      bookingId: $bookingId,
      bookingData: $bookingData
    ) {
      booking {
        id
        master {
          id
          masterName
          masterEmail
          masterPhone
          salon {
            id
            name
          }
        }  
        customer {
          id
          username
        }
      }
    }
  }
`;

const DELETE_BOOKING = gql `
  mutation ($bookingId: Int!) {
    deleteBooking (bookingId: $bookingId)
     {
      booking {
        id
        master {
          id
          masterName
          masterEmail
          masterPhone
          salon {
            id
            name
          }
        }  
        customer {
          id
          username
        }
      }
    }
  }
`;

export default CalendarView;
