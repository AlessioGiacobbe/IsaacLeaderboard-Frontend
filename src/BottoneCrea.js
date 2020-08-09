
import React from 'react';
import 'materialize-css';
import './index.css';
import 'materialize-css/js/component.js';
import { Button } from 'react-materialize';
import { Row, Col, TextInput } from 'react-materialize';
import * as animazioniclass from './animazioni.js';
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


var firebase = require('firebase');
require('firebase/storage')

//init firebase
firebase.initializeApp({
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: "isaac-leaderboard.firebaseapp.com",
    databaseURL: "https://isaac-leaderboard.firebaseio.com",
    projectId: "isaac-leaderboard",
    storageBucket: "isaac-leaderboard.appspot.com",
    messagingSenderId: "455981205965",
    appId: "1:455981205965:web:084559a7ccf3edc1581c84"
});



const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));



const MorphButton = () => {
    const classes = useStyles();

    const [toggle, setToggle] = React.useState(true);   //toggle bottone aperto/chiuso
    const [progress, setProgress] = React.useState(0);  //progresso upload
    const [setOpen] = React.useState(false);

    const morph = useMorph();

    var stainviando = false
    var valoreselezionato = 0   //valore selezionato di default per vincitore

    function nuovoelemento() {

        var testo = document.getElementById("testoscritto").value

        if (!testo || valoreselezionato === 0) {    //non tutti dati forniti
            setOpen(true);
            M.toast({ html: 'riempi tutto' })

        } else if (!stainviando) {
            stainviando = true

            const now = new Date()
            var storageRef = firebase.storage().ref();

            if (file) {

                var uploadTask = storageRef.child('images/' + now.getTime() + file.name).put(file); //upload task del file

                document.getElementById("progressobarra").style.visibility = "visible"; //disabilito elementi
                document.getElementById("immagineform").style.opacity = "0.4";
                document.getElementById("testoscritto").style.opacity = "0.4";
                document.getElementById("demo-simple-select").style.opacity = "0.4";

                setProgress((oldprog) => { return 0 })  //progresso a 0

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function (snapshot) {

                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        setProgress((oldprog) => { return progress })

                    }, function (error) {
                        switch (error.code) {
                            default:
                                console.log(error.code)
                                break;
                        }
                    }, function () {

                        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                            var resizedURL = downloadURL.replace(/(.jpg|.JPG|.png)/, "_1080x1080\$1")   //url immagine ridimensionata

                            console.log(resizedURL)

                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ nome: testo, immagine: resizedURL, vincitore: valoreselezionato, stagione: "3" })
                            };

                            fetch('https://isaacserver.herokuapp.com/inserisci', requestOptions)
                                .then(response => response.json())
                                .then(data => {
                                    //console.log(data)
                                    stainviando = false
                                    try {
                                        setToggle(!toggle)
                                    } catch (err) {
                                        console.log(err)
                                    }
                                });

                        });
                    });
            } else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: testo,
                        vincitore: valoreselezionato,
                        stagione: "3",
                    })
                };

                fetch('https://isaacserver.herokuapp.com/inserisci', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        //console.log(data)
                        stainviando = false
                        try {
                            setToggle(!toggle)
                        } catch (err) {
                        }
                    });
            }

        }

    }

    const mobilecheck = () => {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    var file;

    function handleChangeFile(event) {  //cambio del file selezionato
        file = event.target.files[0];
        var url = URL.createObjectURL(event.target.files[0])
        document.getElementById("immagineform").src = url
    }

    const handleChange = (event) => {   //cambio vincitore selezionato
        valoreselezionato = event.target.value
    };


    return (
        <div>
            {toggle ? (
                <Button onClick={() => setToggle(!toggle)} className="bottoneNuovo">NUOVO</Button>  //onclick toggle dello stato
            ) : (

                    <Button {...morph} className={mobilecheck() ? 'bottoneNuovoFormMobile' : 'bottoneNuovoForm'} >

                        <motion.ul
                            variants={animazioniclass.containerform}
                            initial="hidden"
                            animate="visible">
                            <Row className="flex rownopadding">
                                <Col s={6} m={12} l={12}>
                                    <motion.li key="imgform" className="item height100" variants={animazioniclass.item}>
                                        <div class="image-upload">
                                            <label for="file-input">
                                                <img alt="immaginecartaform" id="immagineform" className="immaginecartaform" src="https://www.beautycolorcode.com/f2f2f2-2880x1800.png" >
                                                </img>
                                            </label>

                                            <input id="file-input" type="file" onChange={handleChangeFile} accept=".png,.jpg,.gif" />
                                        </div>
                                    </motion.li>
                                </Col>
                                <Col s={6} m={12} l={12}>
                                    <Row>
                                        <Col s={12} m={12} l={12}>
                                            <motion.li key="testoform" className="item" variants={animazioniclass.item}>
                                                <TextInput placeholder="Nome partita" id="testoscritto" className=" marginbottomzero width100 testofigo" />
                                            </motion.li>
                                        </Col>
                                        <Col s={12} m={12} l={12}>
                                            <motion.li key="selectform" className="item" variants={animazioniclass.item}>
                                                <FormControl className={[classes.formControl, "width1002"].join(' ')}>
                                                    <InputLabel id="demo-simple-select-label" className="testofigo">chi ha vinto?</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        className="testofigo"
                                                        onChange={handleChange}>
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
                                    <motion.li key="bottoneform" className="item" variants={animazioniclass.item}>
                                        <Button onClick={nuovoelemento} className={mobilecheck() ? "bottoneconfermamobile" : "bottoneconferma"}>invia</Button>
                                    </motion.li>
                                </Col>
                            </Row>
                            <LinearProgress className="progresso" id="progressobarra" variant="determinate" value={progress} />

                        </motion.ul>

                    </Button>
                )
            }
        </div >
    )
}


export default class BottoneCrea extends React.Component {

    render() {
        return (
            <div>
                <MorphButton />
            </div >
        );
    }
}
