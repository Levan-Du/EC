import Promise from 'bluebird';

const API_URL = 'http://localhost:55555/api/Exchange'


export function fetchData(url, data) {
    url = API_URL + url;
    var newdata = data ? data + "&from=ec" : "from=ec";
    newdata += "&gameid=" + localStorage.GameID;
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

export function postData(url, jsonObj) {
    url = API_URL + url;
    jsonObj["GameID"] = localStorage.GameID;
    var parms = jsonToParams(jsonObj);
    console.log(parms);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: 'GET',
            data: parms,
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

var jsonToParams = (jsonObj) => {
    var parms = '';
    for (var i in jsonObj) {
        parms += '&' + i + '=' + jsonObj[i];
    }
    return parms.substring(1, parms.length);
}
