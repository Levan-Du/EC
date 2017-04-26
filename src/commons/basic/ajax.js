import Promise from 'bluebird';
import webConfig from '../../../web.config';


const API_URL = webConfig.API_URL;
console.log(API_URL);

export function fetchData(url, data) {
    url = API_URL + url;
    var gameidParm = "gameid=" + localStorage.GameID,
        newdata = data ? data + '&' + gameidParm : gameidParm;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: 'GET',
            data: newdata,
            dataType: 'jsonp',
            jsonp: 'jsonpcb',
            jsonpCallback: 'jsonp_success',
            success: (res) => {
                resolve(res);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
}

export function postData(url, data) {
    url = API_URL + url;
    var gameidParm = "gameid=" + localStorage.GameID,
        newdata = data ? data + '&' + gameidParm : gameidParm;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: 'GET',
            data: newdata,
            dataType: 'jsonp',
            jsonp: 'jsonpcb',
            jsonpCallback: 'jsonp_success',
            success: (res) => {
                resolve(res);
            },
            error: (err) => {
                reject(err);
            }
        });

    });
}

export var jsonToParams = (jsonObj) => {
    var parms = '';
    for (var i in jsonObj) {
        parms += '&' + i + '=' + jsonObj[i];
    }
    return parms.substring(1, parms.length);
}
