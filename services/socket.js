/**
 * Module dependencies.
 */
const request = require('request')
const _ = require('lodash')
const CONST = require('../constant/Const')
const tinNhanController = require('../controller/tinnhancontroller')
const userSocket = require('./userjoinsocket')
/**
 * Connect to MongoDB using mongoose.
 */

module.exports = (io) => {
  // socket.io events
  io.use(function(socket, next) {
    var handshakeData = socket.request;
    console.log("middleware:", handshakeData._query['userId']);
    let userId = handshakeData._query['userId']    
    if (!userId || _.isUndefined(userId) || userId === null ||userId === 'null' || userId === 'undefined') {
      console.log('=======>check2');
      return next(new Error('Thieu_userId'))
    } 
      return next();
    
  });
  io.sockets.on('connection', (socket) => {
    let user
    let userId = socket.request._query['userId']
    // console.log('======>checkuser: ', userId);
    // if (!userId || _.isUndefined(userId) || userId === null ) {
    //   console.log('=======>check2');
      
    //   return console.log('Thieu userId')
    // }
    
    // socket.use((package, next) => {
    //   var handshakeData = socket.request;
    //   console.log('======>package: ', package);
      
    //   console.log('======>checkuser3333: ', socket.request._query['userId']);
    //   // console.log("middleware:", handshakeData._query['foo']);
    //   next();
    // })
    // xu ly connect
    // luu socketID vao mongo de chat 1 -1
    console.log('========>socket connect:', socket.id);
    userSocket.userJoinSocket(socket, userId)
    socket.on('disconnect', () => {

    })
    // socket.on
    socket.on(CONST.EVT.EVT_SEND_MESS, (package) => {
      tinNhanController.sendMessage(package, io, socket)
    })
  })
}
