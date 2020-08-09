import React from 'react';
import 'materialize-css';
import './index.css';
import * as animazioniclass from './animazioni.js';
import { Card, Row, Col } from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import { motion, AnimatePresence } from "framer-motion";
import SottoTitolo from './titolo.js';
import BottoneCrea from './BottoneCrea';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';


const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "white",
        color: "#484848",
        borderRadius: "40px",
        fontWeight: 700,
        fontSize: "1.1em",
        fontFamily: "Montserrat",
        boxShadow: "0px 0px 18px 4px rgba(0, 0, 0, 0.05)"
    },
}))(Tooltip);

function ElementoPresente(a, nome) {
    var index = a.findIndex(x => x.nome === nome)
    return !(index === -1)
}

export default class Classifica extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            stagione: 3,
            rawjson: []
        };

        this.cambiaStagione = this.cambiaStagione.bind(this); //bind cambiastagione

    }


    classificaPerStagione = (e) => {
        var classificaattuale = []

        for (var i in this.state.rawjson) {   //per ogni elemento
            if (this.state.rawjson[i].stagione === this.state.stagione) {  //se è della stagione corrente
                classificaattuale.push({    //lo metto in classifica
                    nome: this.state.rawjson[i].nome,
                    conteggio: this.state.rawjson[i].conteggio
                })
            }
        }


        //aggiungo eventuali elementi mancanti
        if (!ElementoPresente(classificaattuale, "cai")) { classificaattuale.push({ nome: "cai", conteggio: "0" }) }
        if (!ElementoPresente(classificaattuale, "giaco")) { classificaattuale.push({ nome: "giaco", conteggio: "0" }) }
        if (!ElementoPresente(classificaattuale, "cotti")) { classificaattuale.push({ nome: "cotti", conteggio: "0" }) }
        if (!ElementoPresente(classificaattuale, "civi")) { classificaattuale.push({ nome: "civi", conteggio: "0" }) }
        if (!ElementoPresente(classificaattuale, "gio")) { classificaattuale.push({ nome: "gio", conteggio: "0" }) }


        this.setState({
            isLoaded: true,
            items: classificaattuale
        });

    }


    cambiaStagione = (e) => {

        this.setState({
            stagione: (this.state.stagione + 1) % 3 + 1
        }, function () { this.classificaPerStagione() })

    }

    prendiClassificaTotale = (e) => {
        fetch("https://isaacserver.herokuapp.com/classificatotale") //prendo classifica totale
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        rawjson: result
                    }, function () { this.classificaPerStagione() })

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
        this.prendiClassificaTotale()
    }

    render() {
        const { error, isLoaded, items } = this.state; //prendo elementi dallo stato


        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div></div>;
        } else {
            const elementi = items.map(function (item, index) { //mappo elementi classifica

                return <motion.li key={item["nome"]} className="item" variants={animazioniclass.item}>
                    <Row className={"rowpocopadding " + (index === 0 ? 'primoClassifica' : '')} >
                        <Col s={10} m={10} l={10}>
                            <p className="testoclassifica">{item["nome"]}</p>
                        </Col>
                        <Col s={2} m={2} l={2} className="colonnacentro">
                            <p className="testoclassifica">{item["conteggio"]}</p>
                        </Col>
                    </Row>
                </motion.li>;
            });

            //aggiungo ad un contenitore animato
            const elementiAnimati = <motion.ul variants={animazioniclass.container} initial="hidden" animate="visible">{elementi}</motion.ul>;

            return (
                <div>
                    <motion.ul
                        variants={animazioniclass.container}
                        initial="hidden"
                        animate="visible">
                        <Row className="rownopadding"><Col s={10} m={10} l={10}><motion.li key="sottotitolo" className="item" variants={animazioniclass.item}><SottoTitolo nome="Vittorie" /></motion.li></Col><Col className="colonnadestra" s={2} m={2} l={2}>
                            <motion.li key="stagione" className="item" variants={animazioniclass.item}>
                                <LightTooltip title="Stagione" placement="left">
                                    <Avatar onClick={this.cambiaStagione} className="stagionicoso">{this.state.stagione}</Avatar>
                                </LightTooltip>
                            </motion.li>
                        </Col></Row>
                        <motion.li key="contenuto" className="item" variants={animazioniclass.item}>
                            <Card className="cartaClassifica"><AnimatePresence>{elementiAnimati}</AnimatePresence></Card>
                        </motion.li>
                        <motion.li key="Bottone" className="item" variants={animazioniclass.item}>
                            <BottoneCrea />
                        </motion.li>
                    </motion.ul>
                </div>
            );
        }
    }
}