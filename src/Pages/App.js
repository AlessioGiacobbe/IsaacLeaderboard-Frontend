import React from 'react';
import '../Styles/index.css';
import Hero from '../Components/hero';
import MatchesList from '../Components/MatchesList';
import Leaderboard from '../Components/Leaderboard';
import { Col, Row } from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import Container from 'react-materialize/lib/Container';
import { isMobile } from 'react-device-detect';

function App() {
  return <Container>
    <Row className="row-low-margin">
      <Hero />
    </Row>
    <Row>
      {
        isMobile && <Col s={12} m={4} l={4}>
          <Leaderboard />
        </Col>
      }
      <Col className={(isMobile ? '' : 'card-column')} s={12} m={8} l={8}>
        <MatchesList />
      </Col>
      {
        !isMobile && <Col className="hide-on-small-only" s={12} m={4} l={4}>
          <Leaderboard />
        </Col>
      }
    </Row>
  </Container>;
}

export default App;
