import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import DoctorListItem from './DoctorListItem';

axios.defaults.baseURL = 'http://138.68.16.40:3000'
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default function DoctorList({getDoctor}) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    (async () => {
      const url = 'v1/doctors';
      let result = await axios(url);
      setDoctors(result.data);
    })();
  }, []);

  return (
    <List>
      <ListSubheader>Doctors</ListSubheader>
      {
        doctors.map((doctor)=> {
          return <DoctorListItem doctor={doctor} key={doctor.id} onClick={getDoctor} />
        })
      }
    </List>
  );
}
