import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ClassName extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h2>{this.props.title}</h2>
                    </div>
                </div>
            </div>
        );
    }
} 