// this file is for writing data from database into a JSON file - back up database
// to turn this into an excel sheet, download the file, go to https://www.convertcsv.com/json-to-csv.htm and convert JSON to Excel. It will create a spreadsheet of this and you can keep it

// to run the backup:
// fetch the database information by clicking Fetch States
// wait for the "Download JSON Backup" button to appear
// click the button to download the backup JSON file

import {API, graphqlOperation} from 'aws-amplify';
import { listStates } from '../graphql/queries';
import {useState } from 'react';

function WriteData () {
    const [states, setStates] = useState([]);
    
    const fetchStates = async () => {
    
        try {
            const stateData = await API.graphql(graphqlOperation(listStates, {limit: 1000}));
            const stateList = stateData.data.listStates.items;
    
            setStates(stateList);
            console.log('done');
        } catch (error) {
            console.log('error when fetching states', error);
        }
    }

    return (
        <div className="App">
            <button onClick={fetchStates}>Fetch States</button>
            {states.length > 1 && (
                <div>
                    <a
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(states)
                        )}`}
                        download="calculator_database_backup.json"
                    >
                        {`Download JSON Backup`}
                    </a>
                </div>
            )}
        </div>
    )
}

export default WriteData;