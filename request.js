const axios = require('axios');
const qs = require('querystring');

module.exports = (cookie, toReq) =>
    new Promise((resolve, reject) => {
        const data = qs.stringify(toReq);

        var config = {
            method: 'POST',
            url: 'https://vimetop.ru/ajax/guilds.php',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };
    
        return axios(config).then(resolve).catch(reject);
    });