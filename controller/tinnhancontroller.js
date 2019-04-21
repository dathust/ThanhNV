const _ = require('lodash')
const uuid = require('uuid')
const CONST = require('../constant/Const')
const tinNhanModel = require('../connection/test')
exports.sendMessage = async (package, io, socket, fn) => {
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
    IdNguoiGui: idUserSend,
    IdNguoiNhan: idUserRevice,
    ThoiGianClient: clientTime,
    NoiDung: message,
    LoaiTinNhan: typeMsg,
    nameUserSend: nameUserSend,
    nameUserRecive: nameUserRecive,
    ThoiGianServer: timeServer,
    TrangThai: status
  }
  // luu thanh cong thi tra ve
  // socket.to(idUserSend).to(idUserRevice).emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
  let result = await tinNhanModel.luuTinNhan(nMsg)
  console.log('=======>nMsg: ', nMsg);
  if (result) {
    socket.to(idUserRevice).emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
    if (_.isFunction(fn)) {
      fn(nMsg)
    }
    // socket.emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
    // socket.emit(CONST.EVT.EVT_MESS_SUCCESS, CONST.MSG.MSG_SEND_SUCCESS)    
  } else {
    console.log(`========>Loi gui tin nhan: ${idUserSend} ==== ${idUserRevice} `);
    socket.emit(CONST.EVT.EVT_MESS_FAIL, CONST.MSG.MSG_SEND_FAIL)
  }
  
  // io.in(idUserSend).emit(CONST.EVT.EVT_REPLY_MESS, nMsg)
}

exports.reciveMessage = async (package, socket, callback) => {

}

exports.seenMessage = async(package, socket) => {
  let idUser = package.idUser
  let idNguoiGui = package.idNguoiGui
  if (!idUser || idUser === undefined || idUser.length === 0) {
    socket.emit(CONST.EVT.EVT_PARAM_ERROR, CONST.MSG.MSG_PARAM_ERROR)
  }
  if (!idNguoiGui || idNguoiGui === undefined || idNguoiGui.length === 0) {
    socket.emit(CONST.EVT.EVT_PARAM_ERROR, CONST.MSG.MSG_PARAM_ERROR)
  }
  console.log(`========>socket update status mess -- idUser: ${idUser} -- idNguoiGui: ${idNguoiGui}`);
  
  let result = await tinNhanModel.updateTinNhanDaDoc(idUser, idNguoiGui)
  if (result) {
    socket.to(idNguoiGui).emit(CONST.EVT.EVT_SEEN_MESS, true)
  }
}