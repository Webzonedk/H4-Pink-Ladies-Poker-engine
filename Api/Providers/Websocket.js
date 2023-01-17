const { Server } = require("ws");

class privateWebSocket{


     webSocketServer = new Server({port: 80});

     constructor()
     {
         //this.InitializeServer();
        }
        
        InitializeServer = () =>{
            console.log("initialize");
            
        //on client connection
        this.webSocketServer.on('connection', (ws) =>{
            console.log('we have an client');

            //on client disconnects
            ws.on('close',() => console.log('somebody disconnected'));
        })
     };

     SendMessage = (pokerTable) =>{

      //console.log("message sent ------------------------------------------------------------------")
       // console.log(pokerTable);
        this.webSocketServer.clients.forEach((client) => {
            client.send(pokerTable);
        });

     };

}

class WebSocket {


    constructor() {
      throw new Error('Use WebSocket.getInstance()');
    }
    static GetInstance() {
      if (!WebSocket.instance) {
        WebSocket.instance = new privateWebSocket();
      }
      return WebSocket.instance;
    }
  
  
  }
  
  
  module.exports = {WebSocket: WebSocket };