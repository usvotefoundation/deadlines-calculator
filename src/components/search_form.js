import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import StatesResults from './states_results';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import {useState, useEffect } from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import { listStates } from './../graphql/queries';
import CircularProgress from '@mui/material/CircularProgress';

function SearchForm () {
    let stateNames = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Puerto Rico', 'Guam', 'Virgin Islands', 'CommonWealth Of Northern Mariana Islands', 'American Samoa'
    ];

    let [chosenState, setChosenState] = React.useState('');
    const [selectedState, setSelectedState] = React.useState('');
    let [electionDate, setElectionDate] = React.useState('');
    let [selectedElectionDate, setSelectedElectionDate] = React.useState('');

    let [updateMode, setUpdateMode] = React.useState(false);

    function electionSubmit (state, date) {
        setUpdateMode(false)

        if (state.length > 0 && date.length > 0) {
            setChosenState(state);
            setElectionDate(date);
            fetchStates()
        } else {
            alert('Please select both a state and election date');
        }
    }

    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);
    let [loadedStatus, setLoadedStatus] = useState(false)
    
    const fetchStates = async () => {
        setLoading(true);
        setLoadedStatus(false)

        try {
            const stateData = await API.graphql(graphqlOperation(listStates, {limit: 2000}));
            const stateList = stateData.data.listStates.items;
            console.log('raw stateList', stateList)

            let results = stateList.filter((item) => item.name === selectedState);

            setStates(results);

            console.log('finished fetching states from API');
            console.log('state results for '+ selectedState)
            console.log('date results for '+ selectedElectionDate)

            setLoading(false);
            setLoadedStatus(true);
        } catch (error) {
            console.log('error when fetching states', error);
        }

    }

    // const fetchStates = async () => {
    //     setLoading(true);
    //     setLoadedStatus(false)

    //     try {
    //         const stateData = await API.graphql(graphqlOperation(listStates, {limit: 1000}));
    //         const stateList = stateData.data.listStates.items;
    //         let results = stateList.filter((item) => item.name === selectedState);

    //         setStates(results);
    //         console.log('finished fetching states from API');
    //         setLoading(false);
    //         setLoadedStatus(true);
    //     } catch (error) {
    //         console.log('error when fetching states', error);
    //     }
    // }
    

    return (
        <div className="search-form">
            <form>
                <Grid container spacing={1}>
                    <Grid item xs={7}>
                        <FormControl fullWidth>
                        <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined" style={{backgroundColor: "white", paddingLeft: "5px", paddingRight: "5px"}}>Select a State</label>
                            <Select
                                labelId="state-select-label"
                                id="state-select"
                                value={selectedState}
                                variant="outlined"
                                onChange={(event) => {
                                    setSelectedState(event.target.value)
                                }}
                                fullWidth
                            >
                                {stateNames.map((item, index) => (
                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="election-date"
                            label="Election Date"
                            type="date"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={selectedElectionDate}
                            onChange={(event) => {
                                setSelectedElectionDate(event.target.value);
                            }}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <div className="button-container">
                    <Button variant="contained" size="medium" color="primary" onClick={() => electionSubmit(selectedState, selectedElectionDate)} id="search-stateNames">Search</Button>
                </div>
            </form>
            {loading &&
                <div className="loading-container" size={400}><CircularProgress /></div>
            }
            {loadedStatus && (states.length > 0) &&
                (chosenState.length > 0 && electionDate.length > 0 && (
                    <div className="secondary-container">
                        <StatesResults state={`${chosenState}`} updateMode={updateMode} electionDate={electionDate} loading={loading} results={states} fetchStates={fetchStates}/>
                        <div className="button-right-container">
                            {!updateMode ? (
                                <Button variant="contained" color="primary" onClick={() => setUpdateMode(true)}>Edit Calculator</Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={() => setUpdateMode(false)}>Done Editing Calculator</Button> 
                            )}
                        </div>
                    </div>
                ))
            }
            {loadedStatus && (states.length === 0) &&
                <p>Your search returned zero items.</p>
            }
        </div>
    )
}

export default SearchForm;