import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CalculatorUpdate from './calculator_update';

const moment = require('moment');
const dateFormat = require('dateformat').default;

function StatesResults (props) {

    function electionDateParser (item, relationToEd) {
        let electionCounter = relationToEd.split(" ");
        let secondString = electionCounter[2];
        let badString;
        let lastChar,
            thirdLastChar;

        if (electionCounter[2]) {
            lastChar = secondString[secondString.length - 1];
            thirdLastChar = secondString[secondString.length - 2];

            if (electionCounter[2] === 'before' || electionCounter[2] === 'after' || lastChar === '/' || lastChar === '?' || thirdLastChar === '/') {
                badString = true;
            }
        }

        // subtracting by 1 for some reason when it's the right date
        switch (relationToEd.substring(0,4)) {
            case 'ED':
                electionCounter = 1;
                break;
            case 'ED -':
                electionCounter = parseInt(electionCounter[2]) * -1 + 1;
                break;
            case 'ED +':
                electionCounter = parseInt(electionCounter[2]) + 1;
                break;
            default:
                electionCounter = '';
                break;
        }

        var date = new Date(props.electionDate);
        var momentDate = moment(date);
        let calculatedDate = momentDate.add(electionCounter, 'days');
        let formatted = dateFormat(calculatedDate._d, "mm/d/yyyy");

        // does electionCounter[2] contain a slash?

        if (electionCounter === '' || badString) {
            item.deadlineDate = 'Compute by individual';
        } else {
            item.deadlineDate = formatted;
        }    
    }

    function updatedFormat (originalTime) {
        let formattedUpdate = dateFormat(originalTime.updatedAt, "mmmm dS, yyyy");
        return formattedUpdate;
    }

    if (props.results) {
        props.results.forEach(function (item, index) {
            if (item.edRelation) {
                electionDateParser(item, item.edRelation);
                updatedFormat(item);
            }
        });
    }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
      
        return (
          <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell component="th" scope="row">
                {row.registrationDeadlineType}
              </TableCell>
              <TableCell>{row.dateType}</TableCell>
              <TableCell>{row.deadlineDate}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.edRelation}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div className="accordion-content">
                        {row.laws.length > 0
                            ? <div className="laws">
                                <p>{row.laws}</p>
                                { row.updatedLegal &&
                                    <p>Updated Legal Content: {row.updatedLegal}</p>
                                }
                                { row.updatedNotes &&
                                    <p>Updated Legal Notes: {row.updateNotes}</p>
                                }
                            </div> 
                            : ''
                        }
                        <div className="updated-date"><p>Updated At: {`${updatedFormat(row)}`}</p></div>
                        { row.updater && 
                        <div className="updater-name"><p>Updated By: {row.updater}</p></div>
                        }
                    </div>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      }
      
    const rows = props.results;
      
    return (
        <div className="states-results-container">
            {!props.updateMode ? (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="collapsible table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Registration Deadline Type</TableCell>
                                <TableCell>Date Type</TableCell>
                                <TableCell>Deadline Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Deadline Formula</TableCell>
                                <TableCell />
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row, index) => (
                                <Row key={index} row={row} />
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper> )
                : <CalculatorUpdate state={props.state} results={props.results} fetchStates={props.fetchStates}/>
            }
        </div>
    );

}

export default StatesResults;