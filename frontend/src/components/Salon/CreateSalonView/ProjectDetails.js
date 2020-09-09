import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Chip,
  FormHelperText,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  addTab: {
    marginLeft: theme.spacing(2)
  },
  tag: {
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  datePicker: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const ProjectDetails = ({
  className,
  onBack,
  onNext,
  ...rest
}) => {
  const classes = useStyles();
  const [tag, setTag] = useState('');

  return (

        <form
          onSubmit={()=>console.log("")}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Typography
            variant="h3"
            color="textPrimary"
          >
            Please select one option
          </Typography>
          <Box mt={2}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
            >
              Proin tincidunt lacus sed ante efficitur efficitur.
              Quisque aliquam fringilla velit sit amet euismod.
            </Typography>
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Project Name"
              name="projectName"
              onBlur={()=>console.log("")}
              onChange={()=>console.log("")}
              value="ans"
              variant="outlined"
            />
            </Box>
            <Box
              mt={3}
              display="flex"
              alignItems="center"
            >
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                variant="outlined"
              />
              <IconButton
                className={classes.addTab}
                onClick={() => {
                  if (!tag) {
                    return;
                  }
                }}
              >
                <SvgIcon>
                </SvgIcon>
              </IconButton>
            </Box>
            <Box mt={2}>
              {['a','b'].map((tag, i) => (
                <Chip
                  variant="outlined"
                  key={i}
                  label={tag}
                  className={classes.tag}
                  onDelete={() => {
                    const newTags = ['a','b'].filter((t) => t !== tag);
                  }}
                />
              ))}
            </Box>
          <Box
            mt={6}
            display="flex"
          >
            {onBack && (
              <Button
                onClick={onBack}
                size="large"
              >
                Previous
              </Button>
            )}
          <Box flexGrow={1} />
            <Button
              color="secondary"
              type="submit"
              variant="contained"
              size="large"
            >
              Next
            </Button>
          </Box>

        </form>

  );
};

ProjectDetails.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func
};

ProjectDetails.defaultProps = {
  onNext: () => {},
  onBack: () => {}
};

export default ProjectDetails;
