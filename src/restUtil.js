import React from 'react'
import {rest_server_url} from './constants'

export function fetchUserRole(username='appadmin') {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'username' : username})
    };
    return fetch(rest_server_url+'getuserrole', requestOptions)
            .then(response => {
               return response.json()
            });
            // .then(data => this.setRole(data));
}


