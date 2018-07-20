import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "../ev"
import {constants} from "../Constants"
import 'chart.js'
import "chart.piecelabel.js";

export default class ClassName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chart: null
        }
        console.log('pie', this.props.id);
        
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProv) {
        

        if (nextProv.config == null || 
            nextProv.config.data == null || 
            nextProv.config.options == null || 
            nextProv.config.type == null) {
                
        }
        // console.log('gggggg', nextProv);
        var el = document.getElementById(this.props.id);
        if (!el) return;
        // el.style = "display: block";
        var ctx = el.getContext('2d');
        if (!ctx) return;
        this.setState((prevState, props) =>{
            if (prevState.chart) prevState.chart.destroy();
            prevState.chart = new Chart(ctx, nextProv.config);
            return prevState;
        });
    }

    render() {

        return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <h5>{this.props.title}</h5>
                            <p>{this.props.description}</p>
                        </div>
                        <canvas id={this.props.id}>
                        </canvas>
                    </div>          
                </div>
            
        );
    }
} 