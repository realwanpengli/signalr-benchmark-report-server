import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sticky from 'react-sticky-el';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import Table from "./Table";
import TabItem from "../TabItem"
export default class Summary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tables: {},
            select: null,
        };
        this.toTable = this.toTable.bind(this);
        this.toTabs = this.toTabs.bind(this);
        this.updateTable = this.updateTable.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log('^^&&^^&& will receive props');
        if (nextProps && nextProps.timestamp) {
            fetch('/api/getUnits?timestamp=' + nextProps.timestamp)
                .then(res => res.json())
                .then(units => {
                    var tables = {};
                    var para = "";
                    Object.keys(units).forEach(unit => para += '&units[]=' + unit);
                    fetch('/api/getPercentageLtOneSecond?timestamp=' + nextProps.timestamp + para)
                        .then(res => res.json())
                        .then(mats => {
                            Object.keys(units).forEach(unit => tables[unit] = mats[unit]);
                            // this.setState({ tables: tables, select: Object.keys(units)[0]});
                            this.setState((prevState, props) => {
                                prevState.tables = tables;
                                prevState.select = prevState.select ? prevState.select : Object.keys(units)[0];
                                return prevState;
                            });
                        });
                });
        }
    }

    toTable(tables) {
        if (tables)
            return Object.keys(tables).map(key => (<Table mat={tables[key]} key={key}/>));
    }

    updateTable(unit) {
        this.setState({select: unit}, () => {console.log('00000000----', this.state.select);});
        
    }

    toTabs(units) {
        if (units) {
            console.log('^^&&^^&& will to tabs', this.state.select);
            return units.map((key, i) => <TabItem time={key} active={key == this.state.select ? `active ${key} ${this.state.select}` : ""} key={key} updateTimestamp={this.updateTable}></TabItem>);
        }
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
                    <div className="col-1">
                        <ul className="nav flex-column nav-pills">
                            {this.toTabs(Object.keys(this.state.tables))}
                        </ul>
                    </div>
                    <div className="col-11">
                        <div id="accordion">
                            {this.toTable([this.state.tables[this.state.select]])}
                        </div>
                    </div>
                </div>
                    
            </div>
        );
    }
}
