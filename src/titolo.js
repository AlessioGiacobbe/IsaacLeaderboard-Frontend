import React from 'react';
import 'materialize-css';
import './index.css';
import 'materialize-css/dist/css/materialize.min.css';


export default class SottoTitolo extends React.Component {
  render() {
    return (
       <p className="sottotitolo">{this.props.nome}</p>
    );
  }
}

