import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

axios.defaults.baseURL = 'http://138.68.16.40:3000'
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const AppointmentList = forwardRef(({doctor, date}, ref) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState({
    first_name: '',
    last_name: ''});
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');

  const updateAppointments = async (newDate) => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      if (newDate) {
        date = newDate;
      }

      const url = `v1/appointments?doctor=${doctor.id}&date=${date.split(' ')[0]}`;
      let result = await axios(url);
      if (result.data.map) {
        result.data = await Promise.all(result.data.map(async (item) => {
          const res = await axios(`v1/patients/${item.patient}`);

          item.patientName = `${res.data[0].first_name} ${res.data[0].last_name}`
          return item;
        }))
        setAppointments(result.data);
        setSuccess(true);
        setLoading(false);
      }
    }
  };

  useImperativeHandle(ref, () => {
    return {
      updateAppointments: updateAppointments
    }
  });

  useEffect(() => {
    updateAppointments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visitTypes = [
    'Follow Up',
    'Consultation'
  ];

  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;

    return strTime;
  }

  const setPatientFirstName = (event) => {
    patient.first_name = event.target.value;
    setPatient(patient);
  }

  const setPatientLastName = (event) => {
    patient.last_name = event.target.value;
    setPatient(patient);
  }

  const onSetAppointmentTime = (event) => {
    setAppointmentTime(event.target.value);
  }

  const onSetAppointmentType = (event) => {
    setAppointmentType(event.target.value);
  }

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  function parseTime( t ) {
    var d = new Date();
    var time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
    d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
    d.setMinutes( parseInt( time[2]) || 0 );
    return `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:00`;
 }

  const addAppointment = () => {
    (async () => {
      let result = await axios.get(`v1/patients?first_name=${patient.first_name}&last_name=${patient.last_name}`);

      const patientExists = result.data.length > 0;

      if (!patientExists) {
        await axios.post('v1/patients', {firstName: patient.first_name, lastName: patient.last_name});
        
        result = await axios.get(`v1/patients?first_name=${patient.first_name}&last_name=${patient.last_name}`);
      }

      await axios.post('v1/appointments', {
        date: `${date} ${parseTime(appointmentTime)}`,
        patient: result.data[0].id,
        doctor: doctor.id,
        visitType: appointmentType
      });
      
      updateAppointments();
      setAppointmentType('');
    })();
  }

  const deleteAppointment = (id) => {
    (async () => {
      await axios.delete(`v1/appointments/${id}`);
      updateAppointments();
    })();
  }

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <React.Fragment>
          <div className={classes.wrapper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{row.patientName}</TableCell>
                    <TableCell>{formatAMPM(new Date(row.date))}</TableCell>
                    <TableCell>{row.visit_type}</TableCell>
                    <TableCell align="right"><Button onClick={()=>{deleteAppointment(row.id)}} style={{color:'red'}} disabled={loading}>x</Button></TableCell>
                  </TableRow>
                ))}
                <TableRow key={appointments.length}>
                  <TableCell>{appointments.length+1}</TableCell>
                  <TableCell>
                    <TextField label='First Name' onChange={setPatientFirstName} />
                    <TextField label='Last Name' onChange={setPatientLastName} /></TableCell>
                  <TableCell>
                    <TextField
                      type='time'
                      onChange={onSetAppointmentTime} 
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={appointmentType}
                      onChange={onSetAppointmentType}
                      inputProps={{
                      name: "agent",
                        id: "age-simple"
                      }}
                    >
                      {visitTypes.map((value, index) => {
                        return <MenuItem key={index} value={value}>{value}</MenuItem>;
                      })}
                    </Select>
                  </TableCell>
                  <TableCell align="right"><Button color='primary' style={{color:'gray'}} onClick={addAppointment} disabled={loading}>+</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {loading && <CircularProgress size={68} className={classes.buttonProgress} />}
          </div>
        </React.Fragment>
      </Paper>
    </Grid>
  );
});

export default AppointmentList;