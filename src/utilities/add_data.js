// this file is for mass adding to the database. it will add the entire contents of the file connected to it, so make sure that the database is empty when you are pushing this information into the database
// follow the spreadsheet formatting of the Database_Friendly tab in the Google Sheet.
// to translate a csv (excel spreadsheet or google sheet) into json, go to https://csvjson.com/csv2json and convert the sheet, then place it in the election_formulas file and title it 'converted_calculator' and click the Publish button to run the creation function

// If you're running into an issue:
    // make sure that you're using a csv file: not an excel or other type of spreadsheet. excel and other applications can convert spreadsheets from their file format to csv, google it if you need to
    // if the data is a new dataset (has not been in the calculator before), there is an example format in the legacy_files/example_csv_format.
    // if it is a downloaded backup from the calculator, its example format is in legacy_files/backed_up_example.
    // Made sure that every line has the state's name included and that all of the columns have the same headings as the example spreadsheet. You can open the csv in a spreadsheet reader (like excel or googlesheets) to make this process easier, since csvs are hard to read.

// when you're adding items, open the window's console so you can see the progress of additions. If it hangs for too long, you can refresh, but there's typically a few small spots where it hangs and then it'll get going again. The console log will show progress, as will the progress bar's animation

import {API, graphqlOperation} from 'aws-amplify';
import { listStates } from './../graphql/queries';
import { updateState, createState } from './../graphql/mutations';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import fileData from './../election_formulas/current/converted_calculator.json';

import {useState, useEffect } from 'react';

import {v4 as uuid} from 'uuid';


function AddData() {
  const [states, setStates] = useState([]);
  const [showAddState, setAddNewState] = useState(false);
  let [percentLoaded, setPercentLoaded] = useState(0)
  let [itemsAdded, setItemsAdded] = useState(0)

  useEffect(() => {
    fetchStates();
  }, [])

  const fetchStates = async () => {
    try {
      const stateData = await API.graphql(graphqlOperation(listStates, {limit: 2000}));
      const stateList = stateData.data.listStates.items;

      setStates(stateList);
      console.log('finished fetching states from API');
      console.log(`there are ${stateList.length} items in the database`)
    } catch (error) {
      console.log('error when fetching states', error);
    }
  }

  const AddState = ({onUpload}) => {
    const uploadState = () => {
      let itemsAdding = 0;

      let consoleNewData = '';
      let newOrOld = 0;

      fileData.forEach(itemInFile => {
        if (itemInFile.id) {
          newOrOld++;
        }
      })

      if (newOrOld) {
        consoleNewData = 'there are items already have been in a graphQL database, removing the existing properties that would keep it from being added to this one'
      } else {
        consoleNewData = 'adding new items to database that have not been in the calculator before'
      }
      
      console.log(consoleNewData)
      
      fileData.forEach(async (item) => {
        const {name, registrationDeadlineType, dateType, edRelation, time, laws, updater} = item;

        let createStateInput = {};

        if (item.id) {
          delete item.id;
          delete item.createdAt;
          delete item.updatedAt;
          delete item.__typename;

          createStateInput = item;
        } else {
          createStateInput = {
            id: uuid(),
            name,
            registrationDeadlineType,
            dateType,
            edRelation,
            time,
            laws,
            updater
          }
        }

        try {
          setAddNewState(true)
          await API.graphql(graphqlOperation(createState, {input: createStateInput}))
          itemsAdding++;
          
          setPercentLoaded(Math.round((itemsAdding/fileData.length) * 100))
          console.log(`adding items successfully. currently on item ${itemsAdding} out of ${fileData.length}`)
          if (itemsAdding === fileData.length) {
            console.log('upload finished!');
            setAddNewState('completed');
            setItemsAdded(itemsAdding)
          }
        } catch (e) {
          console.log('error', e)
        }
      });
        
    }

    return (
      <div className="newState">
        {!showAddState && (
          <div>
            <div className="button-right-container">
              <Button variant="outlined" color="primary" onClick={uploadState}>Add State Data</Button>
            </div>
            <br></br>
            <p>There are no items in the database.</p>
          </div>
        )
        }
        <br></br>
        <br></br>
        {showAddState === true &&
            <div><LinearProgress variant="determinate" value={percentLoaded} /><br></br>Adding items now. Sit tight.</div>
        }
        {showAddState === 'completed' &&
          <p>You've added {itemsAdded} items to the database. Refresh the page to delete those items, or go into the code to turn the search form component back on.</p>
        }
      </div>
    )
  }

  return (
    <AddState />
  );
}

export default AddData;