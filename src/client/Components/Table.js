import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { timingSafeEqual } from 'crypto';

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {mat: null};
        this.generateTableRows = this.generateTableRows.bind(this);
        // this.getPercentageLtOneSecond = this.getPercentageLtOneSecond.bind(this);
    }

    componentDidMount() {
    }

    // getPercentageLtOneSecond(timestamp) {
    //     if (!timestamp) return;
    //     fetch('/api/getPercentageLtOneSecond?timestamp=' + timestamp)
    //     .then(res => res.json())
    //     .then(mat => {
    //         this.setState({mat: mat});
    //         console.log('mmmmmmmmmm', mat);
    //     });
    // }

    generateTableRows(mat) {
        if (!mat) return;
        var tbRows = [];
        console.log('VVVVVVV', mat);
        mat.forEach((row, ind) => {
            var tds = [];
            var color='white'
            row.forEach((cell, i) => {
                tds.push(<td key={i}>{cell}</td>);
                if (i == row.length - 1 && Number.parseFloat(cell) < 99) color = '#ff907780'; 
            });
            tbRows.push(<tr key={ind} style={{backgroundColor: color}}>{tds}</tr>);
        });
        console.log('xxxxxxxx', tbRows);
        const tbBody = (<tbody>{tbRows}</tbody>);
        return tbBody;
    }

    componentWillReceiveProps(nextProps) {
        // const timestamp = nextProps.timestamp;
        // this.getPercentageLtOneSecond(timestamp);
        this.setState({mat: nextProps.mat});
    }

    render() {
        return (
            <div>
                <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Servive</th>
                                <th>Transport</th>
                                <th>Protocol</th>
                                <th>Scenario</th>
                                <th>Connection</th>
                                <th>Lt 1s</th>
                            </tr>
                        </thead>
                        {this.generateTableRows(this.state.mat)}
                </table>
            </div>
        );
    }
}