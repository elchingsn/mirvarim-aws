import React, {
  useState,
  useRef
} from 'react';
import {
  Badge,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Popover,
  Select,
  SvgIcon,
  Switch,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import useSettings from 'utils/hooks/useSettings';
import { THEMES } from 'constants.js';

import { useTranslation } from 'react-i18next';
import aze_flag from "assets/img/aze.png"
import ru_flag from "assets/img/ru.png"
import en_flag from "assets/img/eng.png"

const useStyles = makeStyles((theme) => ({
  badge: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5
  },
  popover: {
    width: 320,
    padding: theme.spacing(2)
  }
}));

const Settings = () => {
  const classes = useStyles();
  const ref = useRef(null);
  const { settings, saveSettings } = useSettings();
  const [isOpen, setOpen] = useState(false);
  const [values, setValues] = useState({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });
  const { t, i18n } = useTranslation();
  const [flag, setFlag] = useState(localStorage.getItem("i18nextLng"));

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setFlag(code);
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setValues({
      ...values,
      [field]: value
    });
  };

  const handleSave = () => {
    saveSettings(values);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Settings">
        <Badge
          color="secondary"
          variant="dot"
          classes={{ badge: classes.badge }}
        >
          <IconButton
            color="inherit"
            onClick={handleOpen}
            ref={ref}
          >
            <SvgIcon fontSize="small">
              <SettingsIcon />
            </SvgIcon>
          </IconButton>
        </Badge>
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
        <h3>
          Settings
        </h3>
        <Box
          mt={2}
          px={1}
        >
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            variant="outlined"
            value={flag}
            onChange={(event) => changeLang(event.target.value)}
            label="flag"
          >
            <MenuItem value="aze">
              <img alt="az" src={aze_flag} style={{width: 21, height: 21}}/>
            </MenuItem>
            <MenuItem value="ru">
              <img alt="ru" src={ru_flag} style={{width: 21, height: 21}}/>
            </MenuItem>
            <MenuItem value="en">
              <img alt="en" src={en_flag} style={{width: 21, height: 21}}/>
            </MenuItem>
          </Select>
        </Box>
        {/* <Box
          mt={2}
          px={1}
        >
          <FormControlLabel
            control={(
              <Switch
                checked={values.direction === 'rtl'}
                edge="start"
                name="direction"
                onChange={(event) => handleChange('direction', event.target.checked ? 'rtl' : 'ltr')}
              />
            )}
            label="RTL"
          />
        </Box>
        <Box
          mt={2}
          px={1}
        >
          <FormControlLabel
            control={(
              <Switch
                checked={values.responsiveFontSizes}
                edge="start"
                name="direction"
                onChange={(event) => handleChange('responsiveFontSizes', event.target.checked)}
              />
            )}
            label="Responsive font sizes"
          />
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Theme"
            name="theme"
            onChange={(event) => handleChange('theme', event.target.value)}
            select
            SelectProps={{ native: true }}
            value={values.theme}
            variant="outlined"
          >
            {Object.keys(THEMES).map((theme) => (
              <option
                key={theme}
                value={theme}
              >
                {theme}
              </option>
            ))}
          </TextField>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}

export default Settings;
