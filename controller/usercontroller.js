const MSSQL = require('../connection/test')
const _ = require('lodash')

exports.postLoginAsync = async (req, res) => {
  let taiKhoan = req.body.tai_khoan
  let matKhau = req.body.mat_khau
  // console.log('=====>tk:', taiKhoan);
  // console.log('=====>mk:', matKhau);
  if (!taiKhoan || taiKhoan === null || taiKhoan === '') {
    return res.status(406).send({ error: 'Thieu tai khoan', data: null })
  }
  if (!matKhau || matKhau === null || matKhau === '') {
    return res.status(406).send({ error: 'Thieu nat khau', data: null })
  }
  let userLogin = await MSSQL.userLogin(taiKhoan, matKhau)
  if (!userLogin || userLogin === null) {
    return res.status(404).send({ error: 'Sai tai khoan hoac mat khau', data: null })
  } else {
    if (userLogin === 'error') {
      return res.status(500).send({ error: 'Loi server', data: null })
    } else {
      console.log('========>User login: ', userLogin);

      return res.send({ error: null, data: userLogin })
    }
  }
}
exports.getThongTin = async (req, res) => {
  let key = req.query.userID
  let getDB = await MSSQL.layThongTinCaNhan(key)
  if (getDB === null) {
    return res.status(406).send({ error: 'Sai ID hoac khong co du lieu', data: null })
  }
  getDB[0].Id = _.get(getDB[0], 'Id')
  console.log('======>', getDB);

  return res.send({ error: null, data: getDB[0] })
}

exports.layDanhSachUser = async (req, res) => {
  let userID  = req.query.userID
  let userType = req.query.typeUser
  if (!userID || userID === undefined || userID === '') {
    return res.status(402).send({error: 'Thieu user id', data: null})
  }
  if (!userType || userType === undefined || userType === '') {
    return res.status(402).send({error: 'Thieu user type', data: null})
  }
  userType = parseInt(userType, 10)

  if (userType !== 1 && userType !== 2) {
    return res.status(406).send({ error: 'Sai type user', data: null })
  }
  try {
    console.log(`=======>layDanhSachUser: ${userID} ----- ${userType}`);
    
    //check gv
    if (userType === 2) {
      // tim cac lop ma gv nay chu nhiem
      // tim hoc sinh thuoc lop day
      // lay ra thong tin phu huynh cua lop do
      let output = await MSSQL.layDanhSachPhuHuynh(userID)
      if (output === null) {
        return res.status(406).send({ error: 'Sai ID hoac khong co du lieu', data: null })
      }
      // let result =  _.groupBy(output, 'TenLopHoc')
      let result = xuLyDanhSachPhuHuynhTheoLopHoc(output)
      return res.send({ error: null, data: result })
    }
    if (userType === 1) {
      // tim ra giao vien chu nhiem dua vao hoc sinh
      let output = await MSSQL.layDanhSachGiaoVienTheoIdPhuHuynh(userID)
      if (output === null) {
        return res.status(406).send({ error: 'Sai ID hoac khong co du lieu', data: null })
      }
      // console.log('======>output: ', output);
      
      // let result =  _.groupBy(output, 'TenLopHoc')
      let result = xuLyDanhSachGiaoVienTheoIdPhuHuynh(output)
      return res.send({ error: null, data: result })
    }
    return res.send({error: null, data: []})
  } catch (error) {
    console.log(error);
    return res.status(500).send({error: error, data: null})
  }
}

let xuLyDanhSachPhuHuynhTheoLopHoc =  (danhSachPhuHuynh) => {
  // let result = _.groupBy(danhSachPhuHuynh, 'Id')
  let result = []
  for (let i = 0; i < (danhSachPhuHuynh.length - 1); i++) {
    let item = danhSachPhuHuynh[i];
    let idLop1 = _.get(item, 'Id')
    let phuHuynh = {
      id_phu_huynh : _.get(item, 'IdPhuHuynh'),
      ten_phu_huynh_1: _.get(item, 'TenPhuHuynh1'),
      ten_phu_huynh_2: _.get(item, 'TenPhuHuynh2'),
      ten_hoc_sinh: _.get(item, 'HoDem') + ' ' + _.get(item, 'Ten'),
      bi_danh: _.get(item, 'BiDanh')
    }
    let obj = {
      id_lop: idLop1,
      ten_lop: _.get(item, 'TenLopHoc'),
      danh_sach: [phuHuynh]
    }
    let arrRemove = []
    for (let j = ++i; j < danhSachPhuHuynh.length; j++) {
      let item2 = danhSachPhuHuynh[j];
      let idLop2 = _.get(item, 'Id')
      if (idLop2 === idLop1) {
        let phuHuynh2 = {
          id_phu_huynh : _.get(item2, 'IdPhuHuynh'),
          ten_phu_huynh_1: _.get(item2, 'TenPhuHuynh1'),
          ten_phu_huynh_2: _.get(item2, 'TenPhuHuynh2'),
          ten_hoc_sinh: _.get(item2, 'HoDem') + ' ' + _.get(item2, 'Ten'),
          bi_danh: _.get(item2, 'BiDanh')
        }
        obj.danh_sach.push(phuHuynh2)
        arrRemove.push(idLop2)
      }
    }
    _.map(arrRemove, item3 => {
      _.remove(danhSachPhuHuynh, {
        Id: item3
      })
    })
    result.push(obj)
  }
  return result
}

let xuLyDanhSachGiaoVienTheoIdPhuHuynh = (danhSachGiaoVien) => {
  let result = _.map(danhSachGiaoVien, item => {
      return {
        id_giao_vien: _.get(item, 'IdChuNhiem'),
        ten_giao_vien: _.get(item, 'HoTen'),
        ten_lop: _.get(item, 'TenLopHoc')
      }
  })
  return result
}