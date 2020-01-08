import React from 'react';
import './App.css';
import Dashboard from'./dashboard/Dashboard';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  
  return (
    <ThemeProvider theme={darkTheme}>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
