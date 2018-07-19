import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sticky from 'react-sticky-el';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import Table from "./Table";

export default class Summary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tables: {}
        };
        this.toTable = this.toTable.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.timestamp) {
            fetch('/api/getUnits?timestamp=' + nextProps.timestamp)
                .then(res => res.json())
                .then(units => this.setState((prevState, props) => {
                    var tables = {};
                    var para = "";
                    console.log('^^^^^^^', units);
                    Object.keys(units).forEach(unit => para += '&units[]=' + unit);
                    fetch('/api/getPercentageLtOneSecond?timestamp=' + nextProps.timestamp + para)
                        .then(res => res.json())
                        .then(mats => {
                            Object.keys(units).forEach(unit => tables[unit] = mats[unit]);
                            this.setState({ tables: tables });
                        });
                }));
        }
    }

    toTable(mats) {
        if (mats)
            return Object.keys(mats).map(key => (<Table mat={mats[key]} key={key}/>));
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h3>Summary</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {this.toTable(this.state.tables)}
                    </div>
                </div>
            </div>
        );
    }
}
