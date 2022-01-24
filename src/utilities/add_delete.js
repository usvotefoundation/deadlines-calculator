import AddData from './add_data'
import DeleteData from './clear_data'

import {API, graphqlOperation} from 'aws-amplify';
import { listStates } from '../graphql/queries';
import Button from '@mui/material/Button';
import {useState, useEffect } from 'react';
import { deleteState } from '../graphql/mutations';

function AddDelete() {
    const [states, setStates] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);

    useEffect(() => {
        fetchStates();
      }, [])
    
      const fetchStates = async () => {
        try {
          const stateData = await API.graphql(graphqlOperation(listStates, {limit: 2000}));
          const stateList = stateData.data.listStates.items;
    
          setStates(stateList);
        } catch (error) {
          console.log('error when fetching states', error);
        }

      }


    return (
        <div className="add-delete">
        <div className="container main-content">
            {states.length > 0
                ? <DeleteData />
                : <AddData />
            }
        </div>
        </div>
    );
}

export default AddDelete;