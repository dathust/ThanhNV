var mssql = require('mssql')
const dotenv = require('dotenv').config()

var conn
// exports.connect = () => {
//   let dbConfig = {
//     server: process.env.SERVER_MSSQL,
//     database: process.env.DATABASE,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     prot: process.env.PORT
//   }
//   conn = mssql.connect(dbConfig)
// }
exports.testDB = () => {
  let dbConfig = {
    server: process.env.SERVER_MSSQL,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    prot: process.env.PORT
  }
  mssql.connect(dbConfig, err => {
    if (err) {
      console.log(err);
    }
    let req = new mssql.Request()
    req.query('Select * from LopHoc', (err, result) => {
      if (err) {
        console.log(err);
        return
      } else {
        console.log(result);
      }
      // conn.close()
    })
  })
  // let req = new mssql.Request(conn)
  // conn.connect((err) => {
  //   if (err) {
  //     console.log(err);
  //     return
  //   }
  //   req.query('Select * from LopHoc', (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       return
  //     } else {
  //       console.log(result);
  //     }
  //     conn.close()
  //   })
  // })
}