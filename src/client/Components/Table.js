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
                if (i == 0) return;
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
            // <div> {
            //     this.state.mat ? (
            //     <div className="card">
            //             <div className="card-header">
            //                     <a className="card-link" data-toggle="collapse" href={'#summary-card-' + this.state.mat[0][0]}>
            //                     {this.state.mat[0][0]}
            //                 </a>
            //         </div>

            //             <div id={'summary-card-' + this.state.mat[0][0]} className="collapse" data-parent="#accordion" aria-labelledby={'summary-card-heading-' + this.state.mat[0][0]}>
            //             <div className="card-body">
            //                 <table className="table table-bordered">
            //                     <thead>
            //                         <tr>
            //                             {/* <th>Servive</th> */}
            //                             <th>Transport</th>
            //                             <th>Protocol</th>
            //                             <th>Scenario</th>
            //                             <th>Connection</th>
            //                             <th>Lt 1s</th>
            //                         </tr>
            //                     </thead>
            //                     {this.generateTableRows(this.state.mat)}
            //                 </table>
            //             </div>
            //         </div>
            //             </div>
            //     ) : (<div></div>)
            // }
            // </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {/* <th>Servive</th> */}
                        <th>Transport</th>
                        <th>Protocol</th>
                        <th>Scenario</th>
                        <th>Connection</th>
                        <th>Lt 1s</th>
                    </tr>
                </thead>
                {this.generateTableRows(this.state.mat)}
            </table>
        );
    }
}