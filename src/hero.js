import React from 'react';
import 'materialize-css';
import './index.css';
import * as animazioniclass from './animazioni.js';
import { Card } from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import { motion } from "framer-motion";


export default class Hero extends React.Component {
  render() {
    return (
      <motion.ul
        variants={animazioniclass.container}
        initial="hidden"
        animate="visible">
        <Card className="cartaHero hide-on-small-only">
          <motion.li key="primotitolo" className="item" variants={animazioniclass.item}><p className="titolo">La classifica di</p></motion.li>
          <motion.li key="secondotitolo" className="item" variants={animazioniclass.item}><p className="titolocolore">The binding of isaac</p></motion.li>
        </Card>
        <Card className="cartaHeroMobile show-on-small hide-on-med-and-up">
          <motion.li key="primotitolomobile" className="item" variants={animazioniclass.item}><p className="titolomobile">La classifica di</p></motion.li>
          <motion.li key="secondotitolo" className="item" variants={animazioniclass.item}><p className="titolocolore">The binding of isaac</p></motion.li>
        </Card>
      </motion.ul>
    );
  }
}
