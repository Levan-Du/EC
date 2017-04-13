import Promise from 'bluebird';

const API_URL = 'http://localhost:55555/api/Exchange'


export function fetchData(url) {
    url = API_URL + url;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: 'GET',
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
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: 'GET',
            data: data,
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
