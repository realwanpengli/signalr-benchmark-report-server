import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "./ev"

export default class TabItem extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const select = (time) => {
      return () => {
        this.props.updateTimestamp(time);
        var eles = document.getElementsByClassName('nav-link');
        [].forEach.call(eles, ele => {
          ele.className = 'nav-link';
          if (ele.id == `time-${time}`) ele.className += ' active ';
        });
      }
    };
    return (
      <li className="nav-item">
        <a id={`time-${this.props.time}`} className={"nav-link " + this.props.active} href='#' onClick={select(this.props.time)}>{this.props.time}</a>
      </li>
    );
  }
}
