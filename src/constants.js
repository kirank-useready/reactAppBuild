// import apiConfig from './apiConfig.ini';
// const api_str='/tableauextensions/writeback/api/'

// const construct_url = () =>{
//     //format: "http://localhost:5000/tableauextensions/writeback/api/"
//     var configIni = require('config.ini');
//     var conf=configIni.load('./apiConfig.ini')
//     console.log(conf.RESTAPISERVER.host);
//     console.log(conf.RESTAPISERVER.port);
//     console.log(conf.RESTAPISERVER.SSLEnabled);
//     let http_proto= conf.RESTAPISERVER.SSLEnabled? 'https://':'http://'
//     var url=http_proto+conf.RESTAPISERVER.host+conf.RESTAPISERVER.port+api_str
//     console.log(url);
//     return url
// }

export const rest_server_url = 'https://uracme.useready.com:9443/tableauextensions/writeback/api/'