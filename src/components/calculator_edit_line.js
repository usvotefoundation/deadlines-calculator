import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import {API, graphqlOperation} from 'aws-amplify';
import { updateState, createState, deleteState } from './../graphql/mutations';
import {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CalculatorEditLine (props) {

    if (!props.item.updater) {
        props.item.updater = '';
    }

    let [temporaryDeadlineType, setTemporaryDeadlineType] = React.useState(props.item.registrationDeadlineType);
    let [temporaryDateType, setTemporaryDateType] = React.useState(props.item.dateType);
    let [temporaryTime, setTemporaryTime] = React.useState(props.item.time);
    let [temporaryEdRelation, setTemporaryEdRelation] = React.useState(props.item.edRelation);
    let [temporaryLaws, setTemporaryLaws] = React.useState(props.item.laws);
    let [submitLoading, setSubmitLoading] = useState(false);
    let [resetLoading, setResetLoading] = useState(false);

    const updateListing = async(value, idx) => {
        props.item.registrationDeadlineType = temporaryDeadlineType;
        props.item.dateType = temporaryDateType;
        props.item.time = temporaryTime;
        props.item.edRelation = temporaryEdRelation;
        props.item.laws = temporaryLaws;

        delete props.item.createdAt;
        delete props.item.updatedAt;
        delete props.item.deadlineDate;

        setSubmitLoading (true);
        
        if (!props.item.id) {
            console.log('adding new listing')
            const {id, stateName, registrationDeadlineType, dateType, edRelation, time, laws, updater} = props.item;

            let createStateInput = {
                id: props.id,
                stateName: props.stateName,
                registrationDeadlineType,
                dateType,
                edRelation,
                time,
                laws,
                updater
              }

              console.log(createStateInput)
              const stateData = await API.graphql(graphqlOperation(createState, {input: createStateInput}))

              let result = stateData.data.createState;
              console.log(result)
              console.log('successfully added')
        } else {
            try {
                const stateData = await API.graphql(graphqlOperation(updateState, {input: props.item}));
                console.log('Update sucessful')
            
                let result = stateData.data.updateState;
            } catch (error) {
                console.log('error when updating state information', error);
            }
        }
        setSubmitLoading (false);
    }

    function resetListing () {
        setResetLoading(true)

        setTemporaryDeadlineType(props.item.registrationDeadlineType);
        setTemporaryDateType(props.item.dateType);
        setTemporaryTime(props.item.time);
        setTemporaryEdRelation(props.item.edRelation);
        setTemporaryLaws(props.item.laws);

        setResetLoading(false)
    }

    const deleteListing = async(value, idx) => {
        delete props.item.registrationDeadlineType;
        delete props.item.dateType;
        delete props.item.time;
        delete props.item.edRelation;
        delete props.item.laws;
        delete props.item.updater;
        delete props.item.createdAt;
        delete props.item.stateName;
        delete props.item.updatedAt;
        delete props.item.updateDate;
        delete props.item.updatedLegal;
        delete props.item.updatedNotes;
        delete props.item.deadlineDate;

        if (props.item.id) {
            try {        
                const stateData = await API.graphql(graphqlOperation(deleteState, {input: props.item}));
            
                let result = stateData.data.deleteState;
                props.fetchStates();
            } catch (error) {
                console.log('error when deleting state information', error);
            }
        } else {
            props.fetchStates();
        }
    }

    function rand() {
        return Math.round(Math.random() * 20) - 10;
    }
    
    function getModalStyle() {
        const top = 50 + rand();
        const left = 50 + rand();
        
        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    
    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    return (
        <div className="editLine">                    
            <div className="row">
                <div className="col-md-4">
                    <TextField
                        id={`registrationType-${props.index}`} 
                        label="Registration Deadline Type" 
                        key={`registrationType-${props.index}`} 
                        value={temporaryDeadlineType} 
                        fullWidth
                        variant="outlined" 
                        onChange={(event) => {
                            setTemporaryDeadlineType(event.target.value);
                        }}
                    />
                </div>
                <div className="col-md-3">
                    <TextField 
                        id={`dateType-${props.index}`}
                        label="Date Type"
                        key={`dateType-${props.index}`}
                        value={temporaryDateType}
                        fullWidth
                        variant="outlined"
                        onChange={(event) => {
                            setTemporaryDateType(event.target.value)
                        }}
                    />
                </div>
                <div className="col-md-2">
                    <TextField 
                        id={`time-${props.index}`} 
                        label="Time" 
                        key={`time-${props.index}`} 
                        value={temporaryTime} 
                        fullWidth 
                        variant="outlined"
                        onChange={(event) => {
                            setTemporaryTime(event.target.value)
                        }}
                    />
                </div>
                <div className="col-md-3">
                    <TextField
                        id={`edRelation-${props.index}`}
                        label="Relation to ED"
                        key={`edRelation-${props.index}`}
                        value={temporaryEdRelation}
                        fullWidth
                        variant="outlined"
                        onChange={(event) => {
                            setTemporaryEdRelation(event.target.value)
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <TextField
                        id="filled-multiline-flexible"
                        label="Laws"
                        multiline
                        value={temporaryLaws}
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                            setTemporaryLaws(event.target.value)
                        }}
                    />
                </div>
            </div>
            <div className="update-button-container">
                <LoadingButton
                    onClick={handleOpen} 
                    variant="outlined" 
                    color="error" 
                    endIcon={<DeleteIcon />}
                    >
                        Delete Listing
                </LoadingButton>
                <LoadingButton
                    loading={resetLoading}
                    onClick={() => resetListing()}
                    variant="outlined"
                    color="secondary"
                    endIcon={<RotateLeftIcon />}
                    sx={{ml: 1, mr:1}}>
                        Reset
                </LoadingButton>
                <LoadingButton
                    onClick={() => updateListing()}
                    loading={submitLoading}
                    endIcon={<SendIcon />}
                    variant="contained"
                    >
                    Submit
                </LoadingButton>
            </div>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className="delete-modal"
                >
                    <div className="modal-content">
                        <div className="modal-header">Are you sure you want to delete this listing?</div>
                        <div className="delete-button-container">
                            <Button
                             onClick={handleClose}
                             variant="outlined"
                             startIcon={<ArrowBackIcon />}
                             sx={{m: 1}}
                             >
                                 Nevermind
                            </Button>
                            <Button
                                onClick={() => deleteListing()}
                                variant="outlined"
                                color="error"
                                endIcon={<DeleteIcon />}
                                sx={{m: 1}}>
                                    Delete
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default CalculatorEditLine;