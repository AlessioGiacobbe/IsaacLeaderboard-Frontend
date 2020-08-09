
import React from 'react';
import 'materialize-css';
import './index.css';
import 'materialize-css/dist/css/materialize.min.css';

export default class NospazioSottotitolo extends React.Component {
    render() {
        return (
            <p className="nospaziosottotitolo">{this.props.nome}</p>
        );
    }
}