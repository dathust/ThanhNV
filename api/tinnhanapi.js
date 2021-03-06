const _ = require('lodash')
const tinNhanQR = require('../connection/test')
exports.layDuLieuHoiThoai = async (req, res) => {
    let idUser = req.query.idUser
    let idNguoiGui = req.query.idNguoiGui
    let idNguoiNhan = req.query.idNguoiNhan
    let skip = req.query.skip
    let limit = req.query.limit
    skip = parseInt(skip, 10) || 0
    limit = parseInt(limit, 10) || 10
    if (!idNguoiGui || idNguoiGui === undefined) {
        return res.status(406).send({ error: 'Thieu idNguoiGui', data: null })
    }
    if (!idNguoiNhan || idNguoiNhan === undefined) {
        return res.status(406).send({ error: 'Thieu idNguoiNhan', data: null })
    }
    try {
        console.log(`==========>api layDuLieuHoiThoai idNguoiGui: ${idNguoiGui} ----- idNguoiNhan: ${idNguoiNhan}`);

        //  let result =await layDuLieuHoiThoaiFn(idNguoiGui, idNguoiNhan, skip, limit)
        let result = await tinNhanQR.layDuLieuHoiThoaiQR(idNguoiGui, idNguoiNhan, skip, limit)
        //  console.log('=========>result query: ' , result);    
        return res.send({ error: null, data: result })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error, data: null })
    }
}

let layDuLieuHoiThoaiFn = async (idNguoiGui, idNguoiNhan, skip, limit) => {

    let output = {
        error: null,
        data: null
    }
    return output
}

exports.layDanhSachHoiThoai = async (req, res) => {
    let idNguoiGui = req.query.userId
    let skip = req.query.skip
    let limit = req.query.limit
    skip = parseInt(skip, 10) || 0
    limit = parseInt(limit, 10) || 10
    if (!idNguoiGui || idNguoiGui === undefined) {
        return res.status(406).send({ error: 'Thieu idNguoiGui', data: null })
    }
    try {
        //  let result =await layDuLieuHoiThoaiFn(idNguoiGui, idNguoiNhan, skip, limit)
        let result = await tinNhanQR.layDanhSachHoiThoaiQR(idNguoiGui, skip, limit)
        console.log('======>api lay danh sach hoi thoai:', idNguoiGui);
        let arrTinNhanRemove = []
        _.forEach(result, item => {
            _.forEach(result, item2 => {
                let idNguoiGui1 = _.get(item, 'IdNguoiGui')
                let idNguoiGui2 = _.get(item2, 'IdNguoiGui')
                let idNguoiNhan1 = _.get(item, 'IdNguoiNhan')
                let idNguoiNhan2 = _.get(item2, 'IdNguoiNhan')
                if (idNguoiGui1 === idNguoiNhan2 && idNguoiGui2 === idNguoiNhan1) {
                    let thoiGian1 = _.get(item, 'ThoiGianServer')
                    let thoiGian2 = _.get(item2, 'ThoiGianServer')
                    if (thoiGian1 > thoiGian2) {
                        arrTinNhanRemove.push(_.get(item2, 'Id'))
                    } else {
                        arrTinNhanRemove.push(_.get(item, 'Id'))
                    }
                }
            })
        })
        _.map(arrTinNhanRemove, idRemove => {
            _.remove(result, {
                Id: idRemove
            })
        })
        return res.send({ error: null, data: result })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error, data: null })
    }
}

exports.updateTrangThaiDocTinNhan = async (req, res) => {
    let idNguoiGui = req.query.idNguoiGui
    let idNguoiNhan = req.query.idNguoiNhan
    let idUser = req.query.idUser
    if (!idNguoiGui || idNguoiGui === undefined || idNguoiGui.length === 0) {
        res.status(406).send({error: 'Thieu id nguoi gui', data: null})
    }
    if (!idNguoiNhan || idNguoiNhan === undefined || idNguoiNhan.length === 0) {
        res.status(406).send({error: 'Thieu id nguoi nhan', data: null})
    }
    if (!idUser || idUser === undefined || idUser.length === 0) {
        res.status(406).send({error: 'Thieu id user', data: null})
    }
    try {
        if (idUser === idNguoiNhan) {
            console.log(`======>API update status mess -- idUser: ${idUser} -- idNguoiNhan: ${idNguoiNhan}`);
            let result = tinNhanQR.updateTinNhanDaDoc(idUser, idNguoiGui, idNguoiNhan)
            if(result) {
                return res.send({error: null, data: 'update success'})
            } else {
                return res.send({error: 'Update fail', data: null})
            }
        } else {
            return res.send({error: null, data: 'not update'})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error, data: null})
    }
  
}