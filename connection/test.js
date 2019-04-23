

const sql = require('mssql')
const _ = require('lodash')
let pool
exports.connectioSSQl = async () => {
  try {
    const dbConfig = {
      user: 'sa',
      password: 'Password789',
      server: 'ec2-54-236-239-203.compute-1.amazonaws.com',
      database: 'dbSunriseKidV3',
      port: 1433,
      options: {
        encrypt: false, // Use this if you're on Windows Azure
        trustedConnection: true,
        useUTC: true
      },
      pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 30000
      }
    }
    pool = await sql.connect(dbConfig)
    console.log('====> Connect to MSSQL: ', pool._connected);
    sql.on('error', err => {
      console.log('=========error connect DB: ', err);
    })
  } catch (err) {
    console.log(err);
  }
}

exports.userLogin = async (taiKhoan, matKhau) => {
  try {
    if (taiKhoan === 'phuhuynh01' && matKhau === 'phuhuynh01') {
      let idUser = 'c13f904b-ea24-4783-9a49-ba8f26b6f516'
      return idUser
      // let sql = `select * from PhuHuynh as ph JOIN HocSinh as hs ON ph.Id=hs.IdPhuHuynh  WHERE ph.Id = ${} `
    } else {
      if (taiKhoan === 'giaovien01' && matKhau === 'giaovien01') {
        let idUser = '2e6e1839-e73c-4943-a7a8-cf70136950f2'
        return idUser
        // let sql = `select * from PhuHuynh as ph JOIN HocSinh as hs ON ph.Id=hs.IdPhuHuynh  WHERE ph.Id = ${} `
      } else {
        return null
      }
    }

  } catch (error) {
    console.log(error);
    return 'error'
  }
}

exports.layThongTinCaNhan = async (userId) => {
  try {
    const sql = `select hs.Id,  hs.HoDem, hs.Ten, hs.BiDanh, hs.NgaySinh, ph.DiaChi,hs.GioiTinh, hs.TinhCach, hs.NangKhieu, hs.Anh, ph.TenPhuHuynh1, ph.QuanHePH1, ph.SdtPH1, ph.TenPhuHuynh2, ph.QuanHePH2, ph.SdtPH2
      from PhuHuynh as ph JOIN HocSinh as hs ON ph.Id=hs.IdPhuHuynh  WHERE ph.Id = '${userId}'`
    console.log('=======>sql: ', sql);
    
      let result = await pool.request().query(sql)   
    result = result.recordset     
    if (result.length > 0) {
      // result = result.recordset
      _.map(result, item => {
        item.userType = 1
      })
      return result
    } else {
      const sql2 = `select * from NhanVien gv WHERE gv.Id = '${userId}'`      
      let result = await pool.request().query(sql2)
      result = result.recordset
      _.map(result, item => {
        item.userType = 2
      })
      return result
    }

  } catch (error) {
    console.log(error);
    return null
  }
}

exports.getThongTinLopHoc = async (value) => {
  try {
    // const result = await sql.query`select * from LopHoc where Id = ${value}`
    // let sql = 'select * from LopHoc where Id =' + value
    // const result = await sql.query(sql)
    let result = await pool.request()
      .input('input_parameter', sql.VarChar, value).query('select * from LopHoc where Id = @input_parameter')
    console.log('======>result: ', result)
    return result.recordset
  } catch (error) {
    console.log(error);
    return null
  }
}

exports.luuTinNhan = async (msg) => {
  try {
    let idNguoiGui = msg.idNguoiGui
      , idNguoiNhan = msg.idNguoiNhan
      , clientTime = msg.ThoiGianClient
      , message = msg.NoiDung
      , typeMsg = msg.LoaiTinNhan
      , timeServer = msg.ThoiGianServer
      , trangThai = msg.TrangThai
      , id = msg.id
    const sql = `insert into TinNhan (Id , IdNguoiGui, IdNguoiNhan, NoiDung, ThoiGianClient, ThoiGianServer,TrangThai,LoaiTinNhan)
                 values ('${id}', '${idNguoiGui}', '${idNguoiNhan}', '${message}', '${clientTime}', '${timeServer}', ${trangThai},${typeMsg})`
    console.log('======>sql: ', sql);

    let result = await pool.request().query(sql)
    return result
  } catch (error) {
    console.log(error);
    return null
  }
}

exports.layDuLieuHoiThoaiQR = async (idNguoiGui, idNguoiNhan, skip, limit) => {
  try {
    //select * from [dbSunriseKidV3].[dbo].[TinNhan] ORDER BY ThoiGianClient DESC OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY 

    const sql = `Select * from TinNhan WHERE (IdNguoiGui = '${idNguoiGui}' and IdNguoiNhan = '${idNguoiNhan}') OR (IdNguoiGui = '${idNguoiNhan}' and IdNguoiNhan = '${idNguoiGui}') ORDER BY ThoiGianClient DESC OFFSET ${skip} ROWS FETCH NEXT ${limit} ROWS ONLY`    
    let result = await pool.request().query(sql)
    return result.recordset
  } catch (error) {
    console.log(error);
    return null
  }
}
