import React from 'react';
import 'materialize-css';
import * as animations from '../Configs/animations.js';
import { Card } from 'react-materialize';
import { motion } from "framer-motion";


export default class Hero extends React.Component {
  render() {
    return (
      <motion.ul
        variants={animations.container}
        initial="hidden"
        animate="visible">
        <Card className="hero-card hide-on-small-only">
          <motion.li key="Title" variants={animations.item}><p className="title">La classifica di</p></motion.li>
          <motion.li key="Subtitle" variants={animations.item}><p className="accented-title">The Binding of Isaac</p></motion.li>
        </Card>
        <Card className="hero-card-mobile show-on-small hide-on-med-and-up">
          <motion.li key="Title" variants={animations.item}><p className="mobile-title">La classifica di</p></motion.li>
          <motion.li key="Subtitle" variants={animations.item}><p className="accented-title">The Binding of Isaac</p></motion.li>
        </Card>
      </motion.ul>
    );
  }
}
