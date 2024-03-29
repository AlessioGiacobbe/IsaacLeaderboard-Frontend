import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/App';
import { Route, BrowserRouter as Router } from 'react-router-dom'


const routing = (
  <Router>
    <div>
      <Route path="/" component={App} />
    </div>
  </Router>
)


ReactDOM.render(routing, document.getElementById('root'))

