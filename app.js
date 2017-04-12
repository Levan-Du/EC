const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();

app.use(serve('./dist'));

app.listen(80, () => {
    console.log('listening o port 80...');
});
