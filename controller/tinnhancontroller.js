const _ = require('lodash')
const uuid = require('uuid')
const CONST = require('../constant/Const')
const tinNhanModel = require('../connection/test')
exports.sendMessage = async (package, io, socket) => {
  // check dieu kien o day
  let idUserSend = package.idUserSend
  let idUserRevice = package.idUserRevice
  let clientTime = new Date().toISOString().
  replace(/\..+/, '')
  let message = package.message
  let typeMsg = package.typeMsg
  let nameUserSend = package.nameUserSend
  let nameUserRecive = package.nameUserRecive
  let status = package.status
  console.log(`=====> ${idUserSend} ======= ${idUserRevice} ==== ${clientTime} ===== ${message} ===== ${typeMsg}`)
  let timeServer = new Date().toISOString().
    replace(/\..+/, '')
  // luu tin nhan vao csdl
  const nMsg = {
    id: uuid.v4(),
    idUserSend: idUserSend,
    idUserRevice: idUserRevice,
    clientTime: clientTime,
    message: message,
    typeMsg: typeMsg,
    nameUserSend: nameUserSend,
    nameUserRecive: nameUserRecive,
    timeServer: timeServer,
    status: status
  }
  // luu thanh cong thi tra ve
  // socket.to(idUserSend).to(idUserRevice).emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
  let result = await tinNhanModel.luuTinNhan(nMsg)
  // console.log('=======>result: ', result);
  if (result) {
    socket.to(idUserSend).to(idUserRevice).emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
    socket.emit(CONST.EVT.EVT_MESS_SUCCESS, CONST.MSG.MSG_SEND_SUCCESS)
  } else {
    console.log(`========>Loi gui tin nhan: ${idUserSend} ==== ${idUserRevice} `);
    socket.emit(CONST.EVT.EVT_MESS_FAIL, CONST.MSG.MSG_SEND_FAIL)
  }
  
  // io.in(idUserSend).emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
}

exports.reciveMessage = async (package, socket, callback) => {

}