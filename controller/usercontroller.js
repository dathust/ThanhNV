const MSSQL = require('../connection/test')
exports.postLoginAsync = async (req, res) => {
  let taiKhoan = req.body.tai_khoan
  let matKhau = req.body.mat_khau
  // console.log('=====>tk:', taiKhoan);
  // console.log('=====>mk:', matKhau);
  if (!taiKhoan || taiKhoan === null || taiKhoan === '') {
return res.status(406).send({error: 'Thieu tai khoan', data: null})
  }
  if (!matKhau || matKhau === null || matKhau === '') {
  return  res.status(406).send({error: 'Thieu nat khau', data: null})
  }
  let userLogin = await MSSQL.userLogin(taiKhoan, matKhau)
  if (!userLogin || userLogin === null) {
    return res.status(404).send({error:'Sai tai khoan hoac mat khau', data: null})
  } else {
    if (userLogin === 'error') {
      return res.status(500).send({error:'Loi server', data: null})
    } else {
      return res.send({error: null, data: userLogin})
    }
  }
}
exports.getThongTin = async (req, res) => {
  let key = req.query.userID
  let getDB = await MSSQL.layThongTinCaNhan(key)
  if (getDB === null) {
    return res.status(406).send({ error: 'Sai ID hoac khong co du lieu', data: null })
  }
  console.log('======>', getDB);

  return res.send({error: null, data: getDB})
}