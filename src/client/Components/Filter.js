import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import emitter from "../ev"
import { constants } from '../Constants';

export default class Filter extends Component {
    constructor(props) {
        super(props);
        // this.refs = React.createRef();
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

        this.toCheckbox = this.toCheckbox.bind(this);
        
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.timestamp != nextProps.timestamp) {
            var serviceTypes = {};
            var transportTypes = {};
            var hubProtocols = {};
            var scenarios = {};
            var connections = {};

            var timestamp = nextProps.timestamp;

            // get avalible options
            var options = "";
            
            fetch('/api/getAvailableOptions?timestamp=' + timestamp + options)
                .then(res => res.json())
                .then(types => {
                    if (types != null && types != undefined && types.length > 0) {
                        types.forEach(type => {
                            if (type == null || type == undefined || type.length == 0) return;
                            serviceTypes[type[0]] = 0;
                            transportTypes[type[1]] = 0;
                            hubProtocols[type[2]] = 0;
                            scenarios[type[3]] = 0;
                            connections[type[4]] = 0;
                        });
                        

                    }
                    this.setState((prevState, props) => {
                        prevState.serviceTypes = serviceTypes;
                        prevState.transportTypes = transportTypes;
                        prevState.hubProtocols = hubProtocols;
                        prevState.scenarios = scenarios;
                        prevState.connections = connections;

                        Object.keys(prevState.selected).forEach(group => prevState.selected[group] = null);

                        console.log('prev state', prevState);
                        return prevState;
                    }, () => {
                        Object.keys(this.state).forEach(group =>{
                            if (group != 'selected') {
                                Object.keys(this.state[group]).forEach(data => {
                                    var htmlEle = document.getElementById(`checkbox-${timestamp}-${group}-${data}`);
                                    if (htmlEle != null) {
                                        htmlEle.checked = false;
                                    }
                                });
                                
                            }
                        });
                    });
                    
                });
        }
    }

    toCheckbox(i, data, group, timestamp) {
        var self = this;
        const select = (data, group, timestamp) => {
            return () => {
                self.setState((prevState, props) => {
                    // update state
                    var htmlEle = document.getElementById(`checkbox-${timestamp}-${group}-${data}`);
                    if (htmlEle != null && htmlEle.checked == true) {
                        prevState.selected[group] = data;
                    } else if (htmlEle != null && htmlEle.checked == false) {
                        prevState.selected[group] = null;
                    }
                    return prevState;
                }, () => {
                    // get available options
                    var options = "";
                    Object.keys(this.state.selected).forEach(key => {
                        if (this.state.selected[key]) options += `&options[]=${this.state.selected[key]}`;
                    });
                    fetch(`/api/getAvailableOptions?timestamp=${timestamp}${options}`)
                    .then(res => res.json())
                    .then(filteredOptions => {
                        this.setState((prevState, props) => {
                            Object.keys(prevState).forEach(group => {
                                if (group != 'selected') {
                                    Object.keys(prevState[group]).forEach(key => {
                                        prevState[group][key] = -1;
                                    });
                                }
                            });
                            filteredOptions.forEach(opts => {
                                if (opts && opts.length > 0) {
                                    Object.keys(prevState).forEach((group, i) => {
                                        if (group != 'selected') {
                                            prevState[group][opts[i]] = 0;
                                        }
                                    });
                                }
                            });
                            return prevState;
                        });
                        
                    });

                    // update filter options
                    Object.keys(this.state[group]).forEach(ele => {
                        if (ele != data) {
                            var htmlEle = document.getElementById(`checkbox-${timestamp}-${group}-${ele}`);
                            if (htmlEle != null) htmlEle.checked = false;
                        }
                    });
                    self.props.updateChart(self.state.selected);
                });

            }
        }

        var radio = (
            <div className="form-check form-check-inline" key={data} timestamp={this.props.timestamp}>
                <input disabled={this.state[group][data] == -1 ? true : false} id={`checkbox-${timestamp}-${group}-${data}`} className="form-check-input" type="radio" name={`checkbox-${timestamp}-${group}-${data}`} value={data+timestamp} onClick={select(data, group, timestamp)}/>
                <label className="form-check-label" htmlFor={`checkbox-${timestamp}-${group}-${data}`}>{data}</label>
            </div>
        );
        return radio;

    };

    componentDidMount() {
        
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
                            {Object.keys(this.state.serviceTypes).map((data,i) => this.toCheckbox(i, data, 'serviceTypes', this.props.timestamp))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Transport Type
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.transportTypes).map((data, i) => this.toCheckbox(i, data, 'transportTypes', this.props.timestamp))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Hub Protocol Type
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.hubProtocols).map((data, i) => this.toCheckbox(i, data, 'hubProtocols', this.props.timestamp))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Scenario
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.scenarios).map((data, i) => this.toCheckbox(i, data, 'scenarios', this.props.timestamp))}
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className='col-2'>
                            Connection
                        </div>
                        <div className='col-10'>
                            {Object.keys(this.state.connections).map((data, i) => this.toCheckbox(i, data, 'connections', this.props.timestamp))}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}