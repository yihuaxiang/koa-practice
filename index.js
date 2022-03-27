const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const session = require('koa-session');

const app = new Koa();
const router = new Router();
const koaStatic = require('koa-static');

app.keys = ['7*kV.Ll^()']

router.get('/', (ctx) => {
  ctx.body = 'home page'
})

router.get('/users', (ctx) => {
  ctx.body = 'user list'
})

router.get('/users/:id', (ctx) => {
  ctx.session.lastQuery = ctx.params.id;
  ctx.body = `user ${ctx.params.id}`
})

router.get('/visitnum', (ctx) => {
  ctx.body = `visit num is ${ctx.session.visitNum} ` + ctx.session.lastQuery;
})

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`)
})

const CONFIG = {
  key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  secure: false, /** (boolean) secure cookie*/
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};
// 中间件的顺序很重要
app.use(session(CONFIG, app));

app.use(async (ctx, next) => {
  const visitNum = ctx.session.visitNum || 0;
  ctx.session.visitNum = visitNum + 1;
  console.info('increase visit num', visitNum, ctx.session.visitNum)

  await next();
})

app.use(router.routes());

app.use(koaStatic(path.join(__dirname, 'public')))

app.listen(3000);
