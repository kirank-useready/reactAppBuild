import React, { useState, useEffect } from "react";

import Extension from "./Extension";
import TestInsertEndPoints from "./testinsertendpoints";
import TestUpdateEndPoints from "./testupdateendpoints";
import {rest_server_url} from './constants'
require("./App.css");
const {tableausheetName} = require('./SheetsModule.js'); 

//Needed
const { tableau } = window;

function App() {
  const [selectedSheet, setSelectedSheet] = useState(undefined);
  const [username, setUsername] = useState();

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
        const sheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(worksheet => worksheet.name === tableausheetName.sheet1);
        // console.log(sheet)
        sheet.getSummaryDataAsync().then(info => {
          const username = info.data[0][1].value;
          // console.log(username)
          setUsername(username);
      })
    })
    sendUsername();
  },[]);

  const sendUsername = ()=> {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'username' : username})
    };
    fetch(rest_server_url+'getuserrole', requestOptions)
      .then(response => {
          console.log(response.json());
      }); 
  }

return (
    <Extension/> 
  // <TestInsertEndPoints/><Extension username={username}/>
  // <React.Fragment>
  //   {/* <p>My Token = {window.token}</p> */}
  //   <TestUpdateEndPoints/>
  // </React.Fragment>
  );
}

export default App;