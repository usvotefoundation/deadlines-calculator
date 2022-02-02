import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Button from '@mui/material/Button';

import awsExports from './aws-exports';
import React from 'react';
import './styles/main.scss';

import AddDelete from './utilities/add_delete'
import SearchForm from './components/search_form';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <div className="container main-content">
      <header className="app-header">
        <div className="title-container">
          <h1>Voting Deadline Calculator</h1>
        </div>
        <div className="sign-out">
          Active User: <strong>{user.attributes.preferred_username}</strong>
          <Button sx={{ml: 1.5}} variant="outlined" size="small" color="inherit" onClick={signOut}>Sign out</Button>
        </div>
      </header>
      {/* Search Form, where you can see the contents of the calculator and the deadlines */}
      {/* <SearchForm /> */}

      {/* Add and delete data to the database en masse */}
      <AddDelete /> 
  </div>
  );
}

export default withAuthenticator(App);