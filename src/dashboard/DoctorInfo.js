import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function DoctorInfo({doctor}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography component="p" variant="h4">
        {`Dr. ${doctor.first_name} ${doctor.last_name}`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`${doctor.last_name.toLowerCase()}${doctor.id}@codistry.io`}
      </Typography>
    </React.Fragment>
  );
}
