#!/usr/bin/env node
const Koa = require('koa');
const app = new Koa();
const port = process.env['PORT'] || 3000;
const bodyParser = require('koa-body');
const proxy = require('koa-proxy');
const send = require('koa-send');
const serve = require('koa-static');

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// response time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
    console.log(ctx.path);

    if (ctx.path.match(/^\/api\//) !== null) {
        await next();
        console.log("PROXY TO API");
        if (ctx.path.match(/\/quest/) !== null) {
            // Set type to 'text/html' for QuestLog
            ctx.response.set('Content-Type', 'text/html');
        }
    } else {
        await next();
    }
});

// app.use(proxy({
//     host: 'http://localhost:7071/'
// }));

app.use(proxy({
    host:  'http://localhost:7071/',
    match: /^\/api\//
}));

// static response
app.use(serve('public', { extensions: true }));

// parser
app.use(bodyParser());

// reactive response
app.use(async (ctx) => {
    console.log('Request: ', ctx.request);

    switch (ctx.path) {

        case ('/log.json'):
            await send(ctx, '/static/log.json');
            break;

        case ('/position_events.json'):
            await send(ctx, '/static/position_events.json');
            break;

        default:
            return ctx.body = 'Not Found';
    }
});

app.listen(port);

console.log('Listening @ http://localhost:' + port + '/');
