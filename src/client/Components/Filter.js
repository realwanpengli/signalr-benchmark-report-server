import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "../ev"
import { timingSafeEqual } from 'crypto';

export default class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            serviceTypes: null, 
            transportTypes: null, 
            hubProtocols: null, 
            scenarios: null, 
            connections: null
        };
    }

    
    componentWillUnmount() {
        emitter.removeListener(this.eventEmitter);
    }

    componentDidMount() {
        var serviceTypes = {};
        var transportTypes = {};
        var hubProtocols = {};
        var scenarios = {};
        var connections = {};

        
        
        this.eventEmitter = emitter.addListener("selectNewTimestamp", (timestamp) => {
            console.log("selected timestamp", timestamp);

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
                    
                    const toRadio = (data, group) => 
                    (<div className="form-check form-check-inline" key={data}>
                        <input className="form-check-input" type="radio" name={group} id={data} value={data} />
                        <label className="form-check-label" htmlFor={data}>{data}</label>
                    </div>);
                    this.setState({
                        serviceTypes: Object.keys(serviceTypes).map(data => toRadio(data, 'serviceTypes')),
                        transportTypes: Object.keys(transportTypes).map(data => toRadio(data, 'transportTypes')),
                        hubProtocols: Object.keys(hubProtocols).map(data => toRadio(data, 'hubProtocols')),
                        scenarios: Object.keys(scenarios).map(data => toRadio(data, 'scenarios')),
                        connections: Object.keys(connections).map(data => toRadio(data, 'connections'))
                    });
                });
        });
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
                            {this.state.serviceTypes}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Transport Type
                        </div>
                        <div className='col-10'>
                            {this.state.transportTypes}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Hub Protocol Type
                        </div>
                        <div className='col-10'>
                            {this.state.hubProtocols}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Scenario
                        </div>
                        <div className='col-10'>
                            {this.state.scenarios}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Connection
                        </div>
                        <div className='col-10'>
                            {this.state.connections}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}