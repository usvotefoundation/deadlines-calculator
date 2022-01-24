// this file is for clearing mass amounts of data from the database. it deletes in sets of 3000 results. The database typically has 800-1000 results, so you should be good with running it a single time

// MAKE SURE YOU HAVE AN UP-TO DATE BACKUP
  // To download backup of database, you go to the dynamoDB database table: State-drgonlcbjvagvfkmwiccph5xqu-dev
  // 1. use sidebar to go to ‘Explore Items’
  // 2. press the pagination tabs until there are no more results to load (it means that you can't press the next button anymore, and there should be 800+ results)
  // 3. go to actions and press “download results to csv”
  // 4. then open the csv in excel or google sheets to check and make sure it has content

  // I would recommend backing the database up every month or so, just to make sure things are kept up to date.

// when you're deleting items, open the window's console so you can see the progress of deletions. If it hangs for too long, you can refresh, but there's typically a few small spots where it hangs and then it'll get going again. The console log will show progress, as will the progress bar's animation

import {API, graphqlOperation} from 'aws-amplify';
import { listStates } from './../graphql/queries';
import Button from '@mui/material/Button';
import {useState, useEffect } from 'react';
import { deleteState } from './../graphql/mutations';
import LinearProgress from '@mui/material/LinearProgress';


function ClearData() {
  const [states, setStates] = useState([]);
  const [statesCount, setStatesCount] = useState([]);
  const [deletingStates, setDeletingStates] = useState(false);
  const [percentDeleted, setPercentDeleted] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);

  useEffect(() => {
    fetchStates();
  }, [])

  const fetchStates = async () => {
    try {
      const stateData = await API.graphql(graphqlOperation(listStates, {limit: 3000}));
      const stateList = stateData.data.listStates.items;

      setStates(stateList);
    } catch (error) {
      console.log('error when fetching states', error);
    }
  }

  const deleteListing = () => {
      console.log('deleting')
      let deletedItems = 0;      

      setDeletingStates(true)
      states.forEach(async (item) => {
        delete item.registrationDeadlineType;
        delete item.dateType;
        delete item.time;
        delete item.edRelation;
        delete item.laws;
        delete item.updater;
        delete item.createdAt;
        delete item.name;
        delete item.updatedAt;
        delete item.deadlineDate;

        try {        
            const stateData = await API.graphql(graphqlOperation(deleteState, {input: item}));
            deletedItems++;

            console.log(`deleting items successfully. currently on item ${deletedItems} out of ${states.length}`)
            const stateList = [...states];
            
            setPercentDeleted(Math.round((deletedItems/states.length) * 100));

            if (deletedItems === states.length) {
              setDeletedCount(deletedItems)
              setDeletingStates('completed')
              console.log('finished deleting items!')
            }

            setStates(stateList);
            fetchStates();
        } catch (error) {
            console.log('error when deleting database information', error);
        }
      })
      // fetchStates()
  }

  return (
    <div className="App">
      {!deletingStates &&
        <div><div className="deletion-warning">There are items in the database ready to delete.<br></br><br></br><p>Make sure that you have backed up the database or have a spreadsheet with the most up to date information in it.</p></div><div className="button-right-container">
        <Button variant="contained" color="error" variant="outlined" onClick={() => deleteListing()}>Delete Listings</Button>
      </div></div>
      }
      
      <br></br>
      <br></br>
      {deletingStates === true &&
        <div><LinearProgress variant="determinate" value={percentDeleted} /><br></br>Deleting items now. Sit tight.</div>
      }
      {deletingStates === 'completed' &&
        <p>You've deleted {deletedCount} items from the database. Refresh the page to add more items, or go into the code to turn the search form component back on.</p>
      }

    </div>
  );
}

export default ClearData;