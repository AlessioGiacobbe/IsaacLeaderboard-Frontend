
import React, { useState } from 'react';
import 'materialize-css';
import { Button } from 'react-materialize';
import { Row, Col, TextInput } from 'react-materialize';
import * as animazioniclass from '../Configs/animations.js';
import { motion } from "framer-motion";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import '@material-ui/core/styles';
import '@material-ui/styles';
import '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import 'materialize-css/dist/css/materialize.min.css';
import { useMorph } from 'react-morph';
import M from 'materialize-css'
import { isMobile } from 'react-device-detect';

const firebase = require('firebase');
require('firebase/storage')

firebase.initializeApp({
    apiKey: "AIzaSyDKB__4VYw0t-FhVw9aoDE-eTXimAerRkE",
    authDomain: "isaac-leaderboard.firebaseapp.com",
    databaseURL: "https://isaac-leaderboard.firebaseio.com",
    projectId: "isaac-leaderboard",
    storageBucket: "isaac-leaderboard.appspot.com",
    messagingSenderId: "455981205965",
    appId: "1:455981205965:web:084559a7ccf3edc1581c84"
});

const storageRef = firebase.storage().ref();

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function MorphButton() {
    const classes = useStyles();
    const morph = useMorph();

    const [toggle, setToggle] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState(0)
    const [matchTitle, setMatchTitle] = useState('')
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null)

    function uploadFileThenPostResult(selectedFile) {
        var uploadTask = storageRef.child('images/' + new Date().getTime() + selectedFile.name).put(selectedFile);
        setProgress(0)

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress)
            }, function (error) {
                M.toast({ html: 'errore caricamento' })
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    postResult(downloadURL)
                });
            });
    }

    function postResult(url = null) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: matchTitle,
                immagine: url,
                vincitore: selectedWinner,
                stagione: "2"
            })
        };

        fetch('https://isaacserver.herokuapp.com/inserisci', requestOptions)
            .then(response => response.json())
            .then(data => {
                setIsSending(false)
                setToggle(!toggle)
            });
    }

    function startUpload() {
        if (matchTitle === '' || selectedWinner === 0) {
            M.toast({ html: 'riempi tutto' })
        } else if (!isSending) {
            setIsSending(true)
            if (selectedFile) {
                uploadFileThenPostResult(selectedFile)
            } else {
                postResult()
            }
        }
    }

    function handleChangeFile(event) {
        const file = event.target.files[0];
        setSelectedFile(file)
    }

    return (
        <div>
            {toggle ? (
                <Button onClick={() => setToggle(!toggle)} className="new-button">NUOVO</Button>
            ) : (
                <Button {...morph} className={isMobile ? 'new-button-form-mobile' : 'new-button-form'} >
                    <motion.ul
                        variants={animazioniclass.containerform}
                        initial="hidden"
                        animate="visible">
                        <Row className="flex rownopadding new-button-form-container">
                            <Col s={6} m={12} l={12}>
                                <motion.li key="imgform" className="height100" variants={animazioniclass.item}>
                                    <div className="image-upload">
                                        <label for="file-input" className='image-container'>
                                            <img alt="Seleziona un'immagine" id="immagineform" className={`image ${isSending && "low-opacity"}`} src={selectedFile ? URL.createObjectURL(selectedFile) : "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"} />
                                            {
                                                !selectedFile && <div className="image-text">Seleziona un'immagine</div>
                                            }
                                        </label>
                                        <input id="file-input" type="file" onChange={handleChangeFile} accept=".png,.jpg,.gif" />
                                    </div>
                                </motion.li>
                            </Col>
                            <Col s={6} m={12} l={12}>
                                <Row>
                                    <Col s={12} m={12} l={12}>
                                        <motion.li key="form-text" variants={animazioniclass.item}>
                                            <TextInput onChange={(e) => setMatchTitle(e.target.value)} value={matchTitle} placeholder="Nome partita" className={`marginbottomzero width100 boldish-text ${isSending && "low-opacity"}`} />
                                        </motion.li>
                                    </Col>
                                    <Col s={12} m={12} l={12}>
                                        <motion.li key="selectform" variants={animazioniclass.item}>
                                            <FormControl className={[classes.formControl, "width1002"].join(' ')}>
                                                <InputLabel className="boldish-text">chi ha vinto?</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    className={`boldish-text ${isSending && "low-opacity"}`}
                                                    value={selectedWinner}
                                                    onChange={(e) => { setSelectedWinner(e.target.value) }}>
                                                    <MenuItem value={0}>Seleziona uno</MenuItem>
                                                    <MenuItem value={1}>Giaco</MenuItem>
                                                    <MenuItem value={2}>Civi</MenuItem>
                                                    <MenuItem value={3}>Cai</MenuItem>
                                                    <MenuItem value={4}>Gio</MenuItem>
                                                    <MenuItem value={5}>Cotti</MenuItem>
                                                </Select>
                                            </FormControl>

                                        </motion.li>
                                    </Col>

                                </Row>
                            </Col>
                            <Col className="margintop" s={12} m={12} l={12}>
                                <motion.li key="form-button" variants={animazioniclass.item}>
                                    <Button onClick={() => startUpload()} className={isMobile ? "button-confirm-mobile" : "button-confirm"}>invia</Button>
                                </motion.li>
                            </Col>
                        </Row>
                        <LinearProgress className={isSending ? "progress visible" : "progress"} variant="determinate" value={progress} />
                    </motion.ul>
                </Button>
            )}
        </div >
    )
}