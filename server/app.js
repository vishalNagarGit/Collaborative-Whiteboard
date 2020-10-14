const { log } = require('console');

const app = require('express')()
const http=require('http').createServer(app)
const io=require('socket.io')(http)



io.on('connection', socket=>{
    
    socket.join('room');

    console.log(socket.id);
   // console.log("hi");
    socket.on('draw',(element)=>{
    // console.log(element);
        
       socket.to('room').emit('draw',element);  
    
    });
     socket.on('mouse',(coordinates)=>{
        socket.to('room').emit('mouse',coordinates);
   // console.log(coordinates);
    });


    // socket.on('element',(element)=>{
    //     console.log(element);
    //     io.emit('element',element);
    // })

});


http.listen(4000,()=>{
    console.log("server is up and running");
});