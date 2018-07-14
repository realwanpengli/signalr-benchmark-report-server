import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


import Filter from './Components/Filter';
import Table from './Components/Table';
import PieChart from './Components/PieChart';
import LineChart from './Components/LineChart';
import emitter from "./ev"

export default class Content extends Component {
    constructor(props) {
        super(props);
    }

    
    render() {
        return (
            <div>
                <div className="row">
                    <Filter />
                </div>
                <div className="row">
                    <Table />  
                </div>
                <div className="row">
                    <PieChart title="Latency Distribution In Total"/>  
                </div>
                <div className="row">
                    <LineChart title="Latency Distribution In Time"/>
                </div>
            </div>
        );
    }
}
