const _ = require('lodash')
const tinNhanQR = require('../connection/test')
exports.layDuLieuHoiThoai =async (req, res) => {
    let idNguoiGui = req.query.idNguoiGui
    let idNguoiNhan = req.query.idNguoiNhan
    let skip = req.query.skip
    let limit = req.query.limit
     skip = parseInt(skip, 10) || 0
     limit = parseInt(limit, 10) || 10
     if (!idNguoiGui || idNguoiGui === undefined) {
         return res.status(406).send({error: 'Thieu idNguoiGui', data: null})
     }
     if (!idNguoiNhan || idNguoiNhan === undefined) {
        return res.status(406).send({error: 'Thieu idNguoiNhan', data: null})
     }
     try {
        //  let result =await layDuLieuHoiThoaiFn(idNguoiGui, idNguoiNhan, skip, limit)
         let result =await tinNhanQR.layDuLieuHoiThoaiQR(idNguoiGui, idNguoiNhan, skip, limit)
         console.log('=========>result query: ' , result);    
             return res.send({error: null, data: result})
     } catch (error) {
         console.log(error);
         return res.status(500).send({error: error, data: null})
     }
}

let layDuLieuHoiThoaiFn = async (idNguoiGui, idNguoiNhan, skip, limit) => {

    let output = {
        error: null,
        data: null
    }
    return output
}

exports.layDanhSachHoiThoai =async (req, res) => {
    let idNguoiGui = req.query.idNguoiGui
    let skip = req.query.skip
    let limit = req.query.limit
     skip = parseInt(skip, 10) || 0
     limit = parseInt(limit, 10) || 10
     if (!idNguoiGui || idNguoiGui === undefined) {
         return res.status(406).send({error: 'Thieu idNguoiGui', data: null})
     }
     try {
        //  let result =await layDuLieuHoiThoaiFn(idNguoiGui, idNguoiNhan, skip, limit)
         let result =await tinNhanQR.layDanhSachHoiThoaiQR(idNguoiGui, skip, limit)
         console.log('======>api lay danh sach hoi thoai:' , idNguoiGui);    
             return res.send({error: null, data: result})
     } catch (error) {
         console.log(error);
         return res.status(500).send({error: error, data: null})
     }
}