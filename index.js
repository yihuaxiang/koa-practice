const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');

const app = new Koa();
const router = new Router();
const koaStatic = require('koa-static');

router.get('/', (ctx) => {
  ctx.body = 'home page'
})

router.get('/users', (ctx) => {
  ctx.body = 'user list'
})

router.get('/users/:id', (ctx) => {
  ctx.body = `user ${ctx.params.id}`
})

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(router.routes());

app.use(koaStatic(path.join(__dirname, 'public')))

app.listen(3000);
