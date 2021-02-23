import React, {useState, useEffect} from "react";
import { AutoSizer, MultiGrid } from 'react-virtualized';
import './DataTable.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {rest_server_url} from './constants'
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
const {datatableColumn} = require('./TableColumnModule.js'); 

//Needed
const { tableau } = window;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles({
    container: {
        paddingTop: "6%",
        borderTopStyle: "solid",
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
    savebtndiv: {
      width: "65px"
    },
    pl10: {
      paddingLeft:"10px"
    },
    input: {
        // position: "absolute",
        // left: "60%",
        fontSize: 11,
        fontFamily: "Trebuchet MS",
        fontWeight: 600,
        width: "110px",
    },
    

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
    const [dialogOpen, setDialogOpen] = React.useState(false);
    // const [date, setDate] = React.useState({});
    // const [category, setCategory] = React.useState({});
    const [field, setField] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [erropen, setErrorOpen] = React.useState(false)
    const [userRole, setRole] = React.useState('');
    const db_keys = ['MY(Contract Date)','Sales', 'Revenue Budget', 'Category','Row ID'];
    const keys = ['MY(Contract Date)','Sales', 'Revenue Budget', 'Category'];
    // const keys = ['MY(Contract Date)','Sales', 'Revenue Budget', 'Category','username','Row_ID'];
    //const keys = ['ContractDate','username','Sales', 'Revenue Budget', 'Category'];
    const [message, setMessage] = React.useState('');
    let writebackData = {};
    let writebackDataCopy = [];
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
      console.log('under DT, endpoint getuserrole');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'username' : props.username})
      };
        fetch(rest_server_url+'getuserrole',requestOptions)
            .then(response => response.json()
            )
            .then(data => setRole(data)
            ).catch((error) => {
              console.log('error', error)
            });
    }, []);
    

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        setErrorOpen(false);
      };
      const handleDialogOpen = (event) => {
        setDialogOpen(true);
      };
      const handleDialogClose = () => {
        setDialogOpen(false);
      };

    function CheckError(response) {
      if (response.status >= 200 && response.status <= 299) {
        refreshWorksheetData();
        return response.json();
      } else {
        console.log(response.statusText);
      }
    }
    const handleSave = () => {
      console.log("writebckcopy",JSON.stringify(writebackDataCopy)); 
      setOpen(true);
      //setOpen(false);
    // let writebackData = [{"Row_ID":6541,"Forecast_Amount":100},
     //{"Row_ID":6542,"Forecast_Amount":100}];
      try{        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(writebackData)
        };
        fetch(rest_server_url+'updatedata', requestOptions)
        .then(CheckError)
        .then((jsonResponse) => {
          handleDialogClose();
        }).catch((error) => {
          
          console.log("error", error);
        });
      }
      catch{
        setErrorOpen(true);
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
      console.log("rows",props.rows)
        let content = [];
        let column_name = '';
        const [col1,col2,col3,col4,col5,col6] = datatableColumn;
        console.log("headers",headers)
        for(let j =0;j< props.rows.length;j++){
            for (let i = 0; i < headers.length; i++) {
              if(db_keys.includes(headers[i])) {
                if(headers[i] == "Row ID"){
                  writebackData['Row_ID'] = props.rows[j][i];
                }
                else {
                  writebackData[headers[i]] = props.rows[j][i];
                }
               
              }
              if(keys.includes(headers[i])) {
                let label = headers[i];
                let values = props.rows[j][i];
              if(headers[i] == col1) {
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
              
                const measureKey = props.rows[j][i-1];
                console.log("measure",measureKey);
                const keys = measureKey.split('].[').join(',').split(':');
                    if(keys[1] == 'Calculation_1454662740677197828') {
                        column_name = col4;
                    } else if (keys[1] == 'Calculation_1454662740669812737'){
                        column_name = col3;
                    } else {
                        column_name = keys[1];
                    }
                if(['Viewer','viewer'].includes(userRole.role) || column_name != col4){   // 
                    content.push(
                    <React.Fragment>
                    <div className={classes.row} id="form">
                    <label className={classes.label} >{column_name}</label>
                    <span className={classes.value}>{props.rows[j][i].toFixed(2)}</span>
                    </div>
                    </React.Fragment>
                    );
                    if(props.rows.length - j == 1){
                     content.push(<div className={classes.row + ' ' + classes.savebtndiv}>
                     <ColorButton className={classes.button+ ' '+ classes.pl10} disabled variant="contained" color="secondary">Save</ColorButton>
                     </div>)
                    }
    
                } else {
                    content.push(
                      <React.Fragment>
                      <div className={classes.row} id="form">
                      <label className={classes.label} >{column_name}</label>
                      <input type="number" className={classes.input} placeholder={props.rows[j][i].toFixed(2)} name={column_name} id={column_name} onChange={handleInputChange}></input>
                      </div>
                    
                    </React.Fragment>
                    );
                    if(props.rows.length - j == 1){
                      content.push(<div className={classes.row + ' ' + classes.savebtndiv}>
                      <ColorButton className={classes.button+ ' '+ classes.pl10} variant="contained" color="primary" onClick={handleSave}>Save</ColorButton></div>)
                    }
                }
            }
            }
            writebackDataCopy = [...writebackDataCopy,writebackData];
        }
        return content;
      };

    const handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const keyName = target.name;
        writebackData[keyName] = value;
        console.log('writback handlechnage',JSON.stringify(writebackData));
    }
    function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    const classes = useStyles();
    return (
        <div className={classes.container}>
        <div>
            {getTableContent(props.headers)}
        </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} >
        <Alert onClose={handleClose} >
        Saved Successfully !!
        </Alert>
      </Snackbar>
       <Snackbar open={erropen} autoHideDuration={6000} onClose={handleClose} >
        <Alert onClose={handleClose} severity="error">
        Couldnt save data to table..
        </Alert>
      </Snackbar> 
      
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Confirm  </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
           Do you want to save the records? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Ok
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
        )
}

export default DataTable;
