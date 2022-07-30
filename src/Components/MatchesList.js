import 'materialize-css';
import * as animations from '../Configs/animations.js';
import { Card, Row, Col } from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import { motion } from "framer-motion";
import EmojiEventsRoundedIcon from '@material-ui/icons/EmojiEventsRounded';
import React, { useEffect, useState } from 'react';
import * as _ from "lodash";
import moment from 'moment';
import Magnifier from 'react-magnifier';
import 'moment/locale/it'

moment.locale('it')
const queryParams = new URLSearchParams(window.location.search);
const selectedVersion = queryParams.get("nsfw")

function SingleMatch({ matchInfo, index, prev = null }) {

    const matchImage = selectedVersion ? matchInfo.img : matchInfo.img_sfw
    const fallbackImage = `${process.env.PUBLIC_URL}/img/i${_.random(1, 8)}.jpg`
    const finalImage = matchImage ?? fallbackImage
    const matchDate = moment.utc(matchInfo.data)
    const prevMatchDate = moment.utc(prev ? prev.data : 0)

    const differentSeason = matchInfo.stagione !== (prev ? prev.stagione : 0)
    const differentDate = !matchDate.isSame(prevMatchDate, 'day')
    const differentYear = !matchDate.isSame(prevMatchDate, 'year')

    return <>
        {
            (differentSeason || differentDate || differentYear) &&
            <motion.li variants={animations.item}>
                <div className="card-container">
                    <Row className="rownopadding">
                        {
                            (differentSeason || differentDate) &&
                            <Col s={8} m={8} l={8}>
                                <p className="subtitle-no-space">
                                    {differentDate && matchDate.format("D MMMM")}
                                    {(differentDate && differentSeason) && ' \u2022 '}
                                    {differentSeason && "Stagione " + (matchInfo.stagione + 1)}
                                </p>
                            </Col>
                        }
                        {
                            differentYear &&
                            <Col className="right-column" s={4} m={4} l={4}>
                                <p className="subtitle-no-space">{matchDate.format("YYYY")}</p>
                            </Col>
                        }
                    </Row>
                </div>
            </motion.li>
        }
        <motion.li variants={animations.item}>
            <div className=".card-container">
                <Card className="match-card">
                    <Row className="rownopadding flex">
                        <Col s={6} m={8} l={8}>
                            <p className="card-title">{selectedVersion ? matchInfo.nomepartita : matchInfo.nomepartita_sfw}</p>
                            <p className="card-subtitle">partita delle {moment.utc(matchInfo.data).format("HH:mm")}</p>
                            <Row className="rownopadding">
                                <Col s={1} m={1} l={1}>
                                    <EmojiEventsRoundedIcon className="iconagrigia" />
                                </Col>
                                <Col s={8} m={11} l={11}>
                                    <p className="winner-text"> {matchInfo.nome}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col s={6} m={4} l={4}>
                            <Magnifier height="100%" alt="image" className="card-image" src={finalImage} />
                        </Col>
                    </Row>
                </Card>
            </div>
        </motion.li>
    </>
}

export default function MatchesList() {
    const [matches, setMatches] = useState([])

    useEffect(() => {
        fetch("https://isaacserver.herokuapp.com/punteggi")
            .then(res => res.json())
            .then(
                (result) => {
                    setMatches(result)
                }
            )
    }, [])

    return <div>
        {
            matches.length > 0 &&
            <motion.ul
                variants={animations.container}
                initial="hidden"
                animate="visible">
                {
                    _.orderBy(matches, ['data'], ['desc']).map((matchInfo, index, arr) => {
                        const prevElement = index > 0 ? arr[index - 1] : null

                        return <SingleMatch
                            key={index}
                            matchInfo={matchInfo}
                            index={index}
                            prev={prevElement}
                        />
                    })
                }
            </motion.ul>
        }
    </div>
}