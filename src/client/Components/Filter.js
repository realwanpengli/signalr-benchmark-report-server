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

                    
                    this.setState({
                        serviceTypes: serviceTypes,
                        transportTypes: transportTypes, 
                        hubProtocols: hubProtocols, 
                        scenarios: scenarios, 
                        connections: connections
                    });
                });
        }
    }

     toRadio(data, group) {
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

        return (
            <div className="form-check form-check-inline" key={data} timestamp={this.props.timestamp}>
                <input className="form-check-input" type="radio" name={group} id={data} value={data} onClick={select(data, group)} />
                <label className="form-check-label" htmlFor={data}>{data}</label>
            </div>
        );
    };

    render() {
        
        return (
            <div className="col-12">
                <form>
                    <div className="form-group row">
                        <div className='col-2'>
                            Service Type 
                        </div>
                        <div>
                            {this.props.timestamp}
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.serviceTypes).map(data => this.toRadio(data, 'serviceTypes'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Transport Type
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.transportTypes).map(data => this.toRadio(data, 'transportTypes'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Hub Protocol Type
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.hubProtocols).map(data => this.toRadio(data, 'hubProtocols'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Scenario
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.scenarios).map(data => this.toRadio(data, 'scenarios'))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Connection
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.connections).map(data => this.toRadio(data, 'connections'))}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}