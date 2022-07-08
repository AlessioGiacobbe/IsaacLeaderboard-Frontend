import React, { useEffect, useState } from 'react';
import 'materialize-css';
import * as animations from '../Configs/animations.js';
import { Card, Row, Col } from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import { motion, AnimatePresence } from "framer-motion";
import Bottonebello from './MorphButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import * as _ from "lodash";

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


const ONGOING_SEASON = 3

const LeaderboardRow = ({ name, score, index }) => {
    return <motion.li key={name} variants={animations.item}>
        <Row className={`row-low-margin ${index === 0 && 'leaderboard-first'}`} >
            <Col s={10} m={10} l={10}>
                <p className="leaderboard-text">{name}</p>
            </Col>
            <Col s={2} m={2} l={2} className="centered-text">
                <p className="leaderboard-text">{score}</p>
            </Col>
        </Row>
    </motion.li>
}

export default function Leaderboard() {
    const [loading, setLoading] = useState(true)
    const [currentSeason, setCurrentSeason] = useState(2)
    const [allScores, setAllScores] = useState([])

    const currentSeasonItems = allScores.length && currentSeason != null ? allScores.reduce(function (currentItems, score) {
        if (score.stagione === currentSeason && score.conteggio > 0) {
            currentItems.push({name : score.nome, score: score.conteggio})
        }
        return currentItems;
    }, []) : null

    useEffect(() => {
        fetch("https://isaacserver.herokuapp.com/classificatotale")
            .then(res => res.json())
            .then(
                (result) => {
                    setLoading(false)
                    setAllScores(result)
                },
                (error) => {
                    setLoading(false)
                }
            )
    }, [])

    return <>{
        !loading && <motion.ul
            variants={animations.container}
            initial="hidden"
            animate="visible">
            <Row className="rownopadding">
                <Col s={10} m={10} l={10}>
                    <motion.li key="subtitle" variants={animations.item}>
                        <p className="subtitle">Vittorie</p>
                    </motion.li>
                </Col>
                <Col className="right-column" s={2} m={2} l={2}>
                    <motion.li key="Season" variants={animations.item}>
                        <LightTooltip title="Stagione" placement="left">
                            <Avatar onClick={(e) => setCurrentSeason((currentSeason+1) % ONGOING_SEASON)}>{currentSeason + 1}</Avatar>
                        </LightTooltip>
                    </motion.li>
                </Col>
            </Row>
            <motion.li key="LeaderBoard" variants={animations.item}>
                <Card className="leaderboardCard">
                    <AnimatePresence>
                        <motion.ul variants={animations.container} initial="hidden" animate="visible">
                            {
                                _.orderBy(currentSeasonItems, ['score'], ['desc']).map((scoreRow, index) => <LeaderboardRow name={scoreRow.name} score={scoreRow.score} index={index} key={index} />)
                            }
                        </motion.ul>
                    </AnimatePresence>
                </Card>
            </motion.li>
            <motion.li key="morphButton" variants={animations.item}>
                <Bottonebello />
            </motion.li>
        </motion.ul>
    }</>
}