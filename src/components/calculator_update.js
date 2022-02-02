import React from 'react';
import CalculatorEditLine from "./calculator_edit_line";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function CalculatorUpdate (props) {
    let [propsResults, setPropsResults] = React.useState(props.results);

    function addNew () {
        propsResults = props.results;

        let emptyItem = {
            'stateName': props.stateName,
            'registrationDeadlineType': '',
            'dateType': '',
            'time': '',
            'edRelation': '',
            'laws': '',
            'deadlineDate': ''
        }

        if (Array.isArray(propsResults)) {
            setPropsResults(propsResults.push(emptyItem));
            console.log('success!', propsResults);
        } else {
            console.log('failure', propsResults);
        }
    }

    return (
        <div className="calculator-editing">
            <form id="calculator-form">
                <ul>
                    {props.results.map((item, index) => (
                        <li key={`${item.registrationDeadlineType}-${index}`} >
                            <CalculatorEditLine item={item} index={index} fetchStates={props.fetchStates} stateName={props.state}/>
                        </li>
                    ))}
                </ul>
                <Button 
                    variant="outlined"
                    className="add-new-listing"
                    endIcon={<AddIcon />}
                    onClick={() => addNew()}>
                        Add New Listing
                </Button>
            </form>
        </div>
    )
}

export default CalculatorUpdate;