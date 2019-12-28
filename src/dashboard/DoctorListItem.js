import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';

export default function DoctorListItem({doctor, onClick}) {
  return (
    <ListItem button onClick={()=>{onClick(doctor);}}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary={`${doctor.last_name}, ${doctor.first_name}`} />
    </ListItem>
  );
}
