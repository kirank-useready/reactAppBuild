import React, {useState, useEffect} from "react";
import { AutoSizer, MultiGrid } from 'react-virtualized';
import './DataTable.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {rest_server_url} from './constants'
//Needed
const { tableau } = window;

const useStyles = makeStyles({
    container: {
        paddingTop: "6%",
        borderTopStyle: "dotted",
        marginTop: "3%",
    },
    userInfo: {
        padding: "5%",
        marginTop: "3%",
        backgroundColor: "white",
    },
    row: {
        padding: "4% 4% 4%",
        display: "grid",
        gridTemplateColumns: "52% 42%",
        gridGap: "6%",
    },
    label: {
        fontWeight: 900,
        // marginRight: 50,
        fontSize: 11,
        fontFamily: "Trebuchet MS",
        // fontWeight: "bold",
    },
    buttons: {
        float: "right",
        marginTop: "2%",
    },
    button: {
        marginRight: "10%",
        fontSize: 11,
        fontFamily: "Trebuchet MS",
        fontWeight: 600,
        paddingLeft:"4%",
        marginTop: "6%",
        // marginLeft: "3%",
    },
    value: {
        // position: "absolute",
        // left: "60%",
        fontSize: 11,
        fontFamily: "Trebuchet MS",
        fontWeight: 600,
    },
    input: {
        // position: "absolute",
        // left: "60%",
        fontSize: 11,
        fontFamily: "Trebuchet MS",
        fontWeight: 600,
        width: "110px",
    }

  });
  const ColorButton = withStyles((theme) => ({
    root: {
      color: 'fff',
      backgroundColor: '#29ba74',
      "&:hover": {
        backgroundColor: '#239a4a'
      }
    }
  }))(Button);


function DataTable(props) {
    const [editAdjustedForecast, setAdjustedForecast] = React.useState({});
    // const [date, setDate] = React.useState({});
    // const [category, setCategory] = React.useState({});
    const [field, setField] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [userRole, setRole] = React.useState('');
    const db_keys = ['MY(Contract Date)','Sales', 'Revenue Budget', 'Category','Row_ID'];
    const keys = ['MY(Contract Date)','Sales', 'Revenue Budget', 'Category'];
    // const keys = ['MY(Contract Date)','Sales', 'Revenue Budget', 'Category','username','Row_ID'];
    //const keys = ['ContractDate','username','Sales', 'Revenue Budget', 'Category'];
    const [message, setMessage] = React.useState('');
    let writebackData = {};
    // const worksheet = props.selectedSheet;
    // setSelectedSheet(worksheet);
    const [username, setUsername] = React.useState();
    // console.log(props)
    // useEffect(() => {
    //   tableau.extensions.initializeAsync().then(() => {
    //       const sheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(worksheet => worksheet.name === 'Extension Input');
    //       // setSelectedSheet(sheet);
    //       sheet.getSummaryDataAsync().then(info => {
    //         const user = info.data[0][1].value;
    //         setUsername(user);
    //     })
    //   })
    //   setUserrole();
    // },[]);

    // const setUserrole = ()=> {
      
    //   const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({'username' : username})
    //   };
    //   fetch(rest_server_url+'getuserrole', requestOptions)
    //   .then(response => response.json())
    //   .then(data => setRole(data));
    // }

    useEffect(() => {
      console.log('under DT, endpoint getuserrole')
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'username' : props.username})
      };
        fetch(rest_server_url+'getuserrole',requestOptions)
            .then(response => response.json())
            .then(data => setRole(data));
    }, []);
    

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    const handleSaveOld = () => {
        setOpen(true);
        try{    
             
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(writebackData)
          };
          fetch(rest_server_url+'updatedata', requestOptions)
              .then(response => {
                  console.log(response.json());                
                  refreshWorksheetData();
              });
        }
        catch{
          throw new Error("Couldnt save data to table")
        }
    }

    function CheckError(response) {
      if (response.status >= 200 && response.status <= 299) {
        refreshWorksheetData();
        return response.json();
      } else {
        console.log(response.statusText);
      }
    }
    const handleSave = () => {
      console.log("writebck",JSON.stringify(writebackData)); 
      setOpen(true);
      try{        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(writebackData)
        };
        fetch(rest_server_url+'updatedata', requestOptions)
        .then(CheckError)
        .then((jsonResponse) => {
          console.log("then", jsonResponse)
        }).catch((error) => {
          console.log("error", error)
        });
      }
      catch{
        console.log("Couldnt save data to table..")
      }
  }
  function refreshWorksheetData(){
          const worksheet = props.selectedSheet;
          worksheet.getDataSourcesAsync().then(sources => {
            for (var src in sources){
              sources[src].refreshAsync().then(function () {
                console.log(sources[src].name + ': Refreshed Successfully');
                // const message = sources[src].name + ': Refreshed Successfully';
                // setMessage(message);
              });
            }
        })
    }

    const getTableContent = headers => {
        let content = [];
        let column_name = '';
        console.log(headers)
        console.log(userRole)
        for (let i = 0; i < headers.length; i++) {
          if(db_keys.includes(headers[i])) {
            writebackData[headers[i]] = props.rows[0][i];
          }
          if(keys.includes(headers[i])) {
            let label = headers[i];
            let values = props.rows[0][i];
          if(headers[i] == 'MY(Contract Date)') {
            // if(headers[i] == 'ContractDate') {

                label = 'Contract Date';
                let monthNum  = values%100;
                const months = [ "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December" ];
                 values = months[monthNum-1] + ' ' + values.toString().substring(0,4);
          }
          content.push(<div className={classes.row} id="form">
            <label className={classes.label} >{label}</label>
            <span className={classes.value}>{values}</span>
            </div>);
        } else if(headers[i] == 'Measure Values'){
            const measureKey = props.rows[0][i-1];
            const keys = measureKey.split('].[').join(',').split(':');
                if(keys[1] == 'Calculation_1454662740677197828') {
                    column_name = 'Adjusted Forecast';
                } else if (keys[1] == 'Calculation_1454662740669812737'){
                    column_name = 'Revenue Budget';
                } else {
                    column_name = keys[1];
                }
            if(['Viewer','viewer'].includes(userRole.role) || column_name != 'Adjusted Forecast'){   // 
                content.push(<div className={classes.row} id="form">
                <label className={classes.label} >{column_name}</label>
                <span className={classes.value}>{props.rows[0][i].toFixed(2)}</span>
                </div>);
 
            } else {
                content.push(<div><div className={classes.row} id="form">
                <label className={classes.label} >{column_name}</label>
                <input type="number" className={classes.input} placeholder={props.rows[0][i].toFixed(2)} name={column_name} id={column_name} onChange={handleInputChange}></input>
                </div>
                <ColorButton className={classes.button} variant="contained" color="primary" onClick={handleSave}>Save</ColorButton></div>

                );
            }
        }
        }
        return content;
      };

    const handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const keyName = target.name;
        writebackData[keyName] = value;
    }

    const classes = useStyles();
    return (
        <div className={classes.container}>
        <div>
            {getTableContent(props.headers)}
        </div>
        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        // onClose={handleClose}
        message="Saved Successfully !!"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
        </div>
                    )
}

export default DataTable;
