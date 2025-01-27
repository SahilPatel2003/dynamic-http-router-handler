const http=require('http')

const Router=require('./router')

const router=new Router();

const initiateRouter=require('./restRouter')
const restRouter=new initiateRouter(router);

const callServer=restRouter.init();
http.createServer(callServer).listen(3005, ()=>{
    console.log('server is started');
})


