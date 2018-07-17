import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "../ev"
import { constants } from '../Constants';

export default class Filter extends Component {
    constructor(props) {
        super(props);
        
        var timestamp = this.props.timestamp;
        console.log("selected timestamp", this.props.timestamp);

        this.state = { 
            serviceTypes: {}, 
            transportTypes: {}, 
            hubProtocols: {}, 
            scenarios: {}, 
            connections: {},
            selected: {
                serviceTypes: null,
                transportTypes: null,
                hubProtocols: null,
                scenarios: null,
                connections: null
            }
        };

        this.toRadio = this.toRadio.bind(this);

        
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.timestamp != nextProps.timestamp) {
            var serviceTypes = {};
            var transportTypes = {};
            var hubProtocols = {};
            var scenarios = {};
            var connections = {};

            var timestamp = nextProps.timestamp;

            fetch('/api/getTypes?timestamp=' + timestamp)
                .then(res => res.json())
                .then(types => {
                    console.log("typesx", types);
                    types.forEach(type => {
                        serviceTypes[type[0]] = 0;
                        transportTypes[type[1]] = 0;
                        hubProtocols[type[2]] = 0;
                        scenarios[type[3]] = 0;
                        connections[type[4]] = 0;
                    });

                    
                    this.setState((prevState, props) => {
                        prevState.serviceTypes = serviceTypes;
                        prevState.transportTypes = transportTypes;
                        prevState.hubProtocols = hubProtocols;
                        prevState.scenarios = scenarios;
                        prevState.connections = connections;
                        if (prevState.selected.serviceTypes == null ||
                            Object.keys(prevState.selected).length == 0) 
                            prevState.selected = {
                                serviceTypes: Object.keys(serviceTypes)[0],
                                transportTypes: Object.keys(transportTypes)[0],
                                hubProtocols: Object.keys(hubProtocols)[0],
                                scenarios: Object.keys(scenarios)[0],
                                connections: Object.keys(connections)[0]
                            };
                    }, () => {
                        this.props.updateChart(this.state.selected);
                    });
                    
                });
        }
    }

     toRadio(i, data, group) {
        var self = this;
        const select = (data, group) => {
            return () => {
                self.setState((prevState, props) => {
                    prevState.selected[group] = data;
                    return prevState;
                }, () => {
                    self.props.updateChart(self.state.selected);
                });

            }
        }

        var checked = false;
        if (i == 0) {
            checked = true;
        }

        var radio = (
            <div className="form-check form-check-inline" key={data} timestamp={this.props.timestamp}>
                <input defaultChecked={checked} className="form-check-input" type="radio" name={group} id={data} value={data} onClick={select(data, group)} />
                <label className="form-check-label" htmlFor={data}>{data}</label>
            </div>
        );

        return radio;

    };

    

    componentDidMount() {
        console.log('mounted filter', this.state);
        
    }

    

    render() {
        
        return (
            <div className="col-12">
                <form>
                    <div className="form-group row">
                        <div className='col-2'>
                            Service Type 
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.serviceTypes).map((data,i) => this.toRadio(i, data, 'serviceTypes',))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Transport Type
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.transportTypes).map((data,i) => this.toRadio(i, data, 'transportTypes'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Hub Protocol Type
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.hubProtocols).map((data,i) => this.toRadio(i, data, 'hubProtocols'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Scenario
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.scenarios).map((data,i) => this.toRadio(i, data, 'scenarios'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Connection
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.connections).map((data,i) => this.toRadio(i, data, 'connections'))}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}