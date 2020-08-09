import 'materialize-css';
import './index.css';
import * as animazioniclass from './animazioni.js';
import { Card, Row, Col } from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import { motion } from "framer-motion";
import EmojiEventsRoundedIcon from '@material-ui/icons/EmojiEventsRounded';
import React from 'react';
import SottoTitolo from './titolo.js';
import NospazioSottotitolo from './nospazio';
import Viewer from 'react-viewer';


function shuffle(a) {   //suffle array
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const Mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

//immagini disponibili
var immagini = ["i1.png", "i2.jpg", "i3.jpg", "i4.jpg", "i5.jpg", "i6.png", "i7.png", "i8.png"]


export default class Partite extends React.Component {


    constructor(props) {

        super(props);
        shuffle(immagini)   //randomizzo ordine immagini

        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            mostraviewer : false,
            immaginiviewer : [],
            indeximg : 0
        };

        this.apriViewer = this.apriViewer.bind(this);   //bind funzione per aprire il viewer

    }

    apriViewer = param => e => {
       this.setState({
           mostraviewer: true, 
           indeximg: param
       })
    }

    componentDidMount() {

        //prendo cronologia partite
        fetch("https://isaacserver.herokuapp.com/punteggi")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    inputRefs = []; //riferimenti ad elementi, per effettuare spostamento
  
    setRef = (ref) => {
      this.inputRefs.push(ref);
    };



    render() {
        const { error, isLoaded, items } = this.state;


        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div></div>;
        } else {

            this.state.immaginiviewer = []

            var vecchiadata, annovecchio = new Date().getFullYear();
            var vecchiastagione = items[0].stagione;

            //mappo elementi json in elementi html
            const elementi = items.map((elemento, index) => {

                //robe per date e orari
                var dataconvertita = new Date(elemento["data"]);
                var anno = dataconvertita.getFullYear();
                var dataintera = dataconvertita.getUTCDate() + " " + Mesi[dataconvertita.getMonth()]
                var toReturn;
                var stagioneattuale = elemento.stagione;

               

                if (vecchiadata !== dataintera) {   //controllo se cambiata data (stampo nuova data in caso)
                    vecchiadata = dataintera;

                    if (annovecchio !== anno) { //controllo se cambiato anno
                        annovecchio = anno;

                        if (stagioneattuale !== vecchiastagione) {  //controllo se cambiata stagione
                            vecchiastagione = stagioneattuale;

                            dataintera += " (Stagione " + stagioneattuale + ")";
                        }
                        toReturn = <Row className="rownopadding"><Col s={8} m={8} l={8}><NospazioSottotitolo nome={dataintera} /></Col><Col className="colonnadestra" s={4} m={4} l={4}><NospazioSottotitolo nome={anno} /></Col></Row>
                    } else {
                        if (stagioneattuale !== vecchiastagione) {
                            vecchiastagione = stagioneattuale;

                            dataintera += " (Stagione " + stagioneattuale + ")";
                        }
                        toReturn = <SottoTitolo nome={dataintera} />;
                    }
                }

                var imgurl

                if (elemento["img"] !== null) {
                    imgurl = elemento["img"]
                }else{
                    imgurl = process.env.PUBLIC_URL + '/img/' + immagini[index%immagini.length] //se immagine non presente, la prendo da immagini di default
                }

                this.state.immaginiviewer.push({src: imgurl, alt: elemento["nomepartita"]});    //aggiungo immagine al viewer

                var cartapartita = <Card className="cartaElementi">
                    <Row className="rownopadding flex">
                        <Col s={6} m={8} l={8}>
                            <p className="titolocarta">{elemento["nomepartita"]}</p>
                            <p className="sottotitolocarta">partita delle {dataconvertita.getUTCHours()}:{String(dataconvertita.getMinutes()).padStart(2, "0")}</p>
                            <Row className="rownopadding">
                                <Col s={1} m={1} l={1}>
                                    <EmojiEventsRoundedIcon className="iconagrigia" />
                                </Col>
                                <Col s={8} m={11} l={11}>
                                    <p className="vincitorecarta"> {elemento["nome"]}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col s={6} m={4} l={4}>
                            <img ref={this.setRef}  alt="immagincarta" key={index} onClick={this.apriViewer(index)} className="immaginecarta" src={imgurl} />
                        </Col>
                    </Row>
                </Card>

                var ritornare;

                //rendo elementi animati
                if (toReturn != null) {
                    ritornare = <><motion.li key={dataintera} className="item" variants={animazioniclass.item}><div className="divcarte">{toReturn}</div></motion.li><motion.li key={elemento["nome"]} className="item" variants={animazioniclass.item}><div className="divcarte">{cartapartita}</div></motion.li></>
                } else {
                    ritornare = <motion.li key={elemento["nome"]} className="item" variants={animazioniclass.item}><div className="divcarte">{cartapartita}</div></motion.li>
                }

                return ritornare;
            });




            return (
                <div>
                    <Viewer
                        visible={this.state.mostraviewer}
                        onClose={() => { this.setState({
                            mostraviewer: false
                        }) } }
                        onChange={(active, index) => { 
                            //scrolling quando cambio immagine visualizzata
                            this.inputRefs[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        activeIndex={this.state.indeximg}
                        images={this.state.immaginiviewer}
                        rotatable = {false}
                        scalable = {false}
                        zoomable = {true}
                    />
                    <motion.ul
                        variants={animazioniclass.container}
                        initial="hidden"
                        animate="visible">
                        {elementi}
                    </motion.ul>
                </div>
            );
        }
    }
}