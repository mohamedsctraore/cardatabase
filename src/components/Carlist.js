import React, { Component } from 'react';
import { SERVER_URL } from '../constant.js';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import AddCar from './AddCar.js';
import { CSVLink } from 'react-csv';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class Carlist extends Component {
    constructor(props) {
        super(props);
        this.state = {cars: []};
    }

    componentDidMount() {
        this.fetchCars();
    }

    fetchCars = () => {
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + 'api/cars', {
            headers: {'Authorization': token}
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({cars: responseData._embedded.cars,});
        })
        .catch(err => console.error(err));
    }

    // Delete car
    onDelClick = (link) => {
        fetch(link, {method: 'DELETE'})
        .then(res => {
        toast.success("Car deleted", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        this.fetchCars();
        })
        .catch(err => {
        toast.error("Error when deleting", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err)
        }) 
    }

    confirmDelete = (link) => {
        confirmAlert({
            message: 'Are you sure to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.onDelClick(link)
                },
                {
                    label: 'No'
                }
            ]
        })
    }

    // Add new car
    addCar(car) {
        fetch(SERVER_URL + 'api/cars', 
        { method: 'POST', headers: { 'Content-Type': 'application/json',}, body: JSON.stringify(car)})
        .then(res => this.fetchCars())
        .catch(err => console.error(err))
    }
    
    renderEditable = (cellInfo) => {
        return (
          <div
            style={{ backgroundColor: "#fafafa" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
              const data = [...this.state.cars];
              data[cellInfo.index][cellInfo.column.id] = 
               e.target.innerHTML;
              this.setState({ cars: data });
            }}
            dangerouslySetInnerHTML={{
              __html: this.state.cars[cellInfo.index][cellInfo.column.id]
            }} 
          />
        );
      }
      
    // Update car
    updateCar(car, link) {
        fetch(link, 
        { method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car)
        })
        .then( res =>
        toast.success("Changes saved", {
            position: toast.POSITION.BOTTOM_LEFT
        }) 
        )
        .catch( err => 
        toast.error("Error when saving", {
            position: toast.POSITION.BOTTOM_LEFT
        }) 
        )
    }

    render() {
        const tableRows = this.state.cars.map((car, index) =>
            <tr key={index}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.color}</td>
                <td>{car.year}</td>
                <td>{car.price}</td>
            </tr>
        );

        const columns = [{
            Header: 'Brand',
            accessor: 'brand',
            Cell: this.renderEditable
        }, {
            Header: 'Model',
            accessor: 'model',
            Cell: this.renderEditable
        }, {
            Header: 'Color',
            accessor: 'color',
            Cell: this.renderEditable
        }, {
            Header: 'Year',
            accessor: 'year',
            Cell: this.renderEditable
        }, {
            Header: 'Price $',
            accessor: 'price',
            Cell: this.renderEditable
        }, {
            id: 'savebutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: ({value, row}) => (<Button size="small" variant="flat" color="primary" 
    onClick={()=>{this.updateCar(row, value)}}>Save</Button>)
        },
        {
            id: 'delbutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: ({value}) => (<Button size="small" variant="flat" color="secondary" 
    onClick={()=>{this.confirmDelete(value)}}>Delete</Button>)
        }]
        return (
            <div className="App">
                <Grid container>
                    <Grid item>
                        <AddCar addCar={this.addCar} fetchCars={this.fetchCars}/>    
                    </Grid>
                    <Grid item style={{padding: 20}}>
                        <CSVLink data={this.state.cars} separator=";">Export CSV</CSVLink>
                    </Grid>
                </Grid>

                <ReactTable 
                    data={this.state.cars}
                    columns={columns}
                    filterable={true} 
                />

                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}

export default Carlist;