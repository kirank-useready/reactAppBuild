import React, { Component } from 'react'
import TestUpdateEndPoints from "./testupdateendpoints";
import {rest_server_url} from './constants'
import Extension from "./Extension";
import {fetchUserRole} from './restUtil';

const { tableau } = window;

class TableauInitApp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            'username':'',
            'role':''
        }
    }
    componentDidMount() {
        console.log("under comp did mount")
        if(this.state.username === ''){
            tableau.extensions.initializeAsync().then(() => {
                const sheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(worksheet => worksheet.name === 'Extension Input');
                console.log(sheet)
                sheet.getSummaryDataAsync().then(info => {
                const username = info.data[0][1].value;
                console.log(username)
                this.setUserRole(username,fetchUserRole(username))
                });
            });
        }
    }

    // fetchUserRole(){
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({'username' : this.state.username})
    //     };
    //     fetch(rest_server_url+'getuserrole', requestOptions)
    //     .then(response => response.json())
    //     .then(data => this.setUserRole(data));
    // }
    setUserRole(username,data){
        this.setState({'username':username,'role':data})
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log("under comp did update")
    //     tableau.extensions.initializeAsync().then(() => {
    //         const sheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(worksheet => worksheet.name === 'Extension Input');
    //         console.log(sheet)
    //         sheet.getSummaryDataAsync().then(info => {
    //         const username = info.data[0][1].value;
    //         console.log(username)
    //         this.setState({'username':username})
    //         this.fetchUserRole()
    //         });
    //     });
    // }

    render() {
        return (
            // <TestUpdateEndPoints username={this.state.username} role={this.state.role}/>
            <Extension username={this.state.username} role={this.state.role}/> 
        )
    }
}

export default TableauInitApp