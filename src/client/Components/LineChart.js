import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ClassName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: null
        }
    }

    componentDidMount() {
        // console.log('receive pie config', nextProv.config);
        // if (nextProv.config == null ||
        //     nextProv.config.data == null ||
        //     nextProv.config.options == null ||
        //     nextProv.config.type == null)
        //     return;

        // var ctx = document.getElementById(this.props.id).getContext('2d');
        // this.setState((prevState, props) => {
        //     if (prevState.chart != null) {
        //         delete prevState.chart;
        //     }
        //     prevState.chart = new Chart(ctx, nextProv.config);
        //     return prevState;
        // });
    }

    render() {
        return (<div></div>);
    }
}