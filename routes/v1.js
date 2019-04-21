const userController = require('../controller/usercontroller')
const tinNhanAPI = require('../api/tinnhanapi')
module.exports.setup = function (app) {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: Các api liên quan đến user
   */
  /**
    * @swagger
    * /api/loginV1:
    *   post:
    *     description: Login
    *     tags: [User]
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: body
    *         name: "body"
    *         description: login
    *         schema:
    *            type: object
    *            properties:
    *              tai_khoan:
    *                type: string
    *              mat_khau:
    *                type: string
    *     responses:
    *       200:
    *         description: post dữ liệu thành công
    *       401:
    *         description: token không hợp lệ
    *       422:
    *         description: sai loại tài khoản
    */
  /**
    * @swagger
    * /api/getThongTin:
    *   get:
    *     description: get thoong tin
    *     tags: [User]
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: userID
    *         description: user id
    *         in: query
    *         type: string
    *         required: true
    *     responses:
    *       200:
    *         description: gửi dữ liệu thành công
    *       401:
    *         description: token không hợp lệ
    *       422:
    *         description: sai loại tài khoản
    */
  /**
    * @swagger
    * /api/layDuLieuHoiThoai:
    *   get:
    *     description: lay layDuLieuHoiThoai
    *     tags: [User]
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: idNguoiGui
    *         description: id nguoi gui
    *         in: query
    *         type: string
    *         required: true
    *       - name: idNguoiNhan
    *         description: id nguoi nhan
    *         in: query
    *         type: string
    *         required: true
    *       - name: skip
    *         description: số bản ghi bỏ qua
    *         in: query
    *         type: string
    *         required: true
    *       - name: limit
    *         description: số bản ghi cần lấy
    *         in: query
    *         type: string
    *         required: true
    *     responses:
    *       200:
    *         description: gửi dữ liệu thành công
    *       401:
    *         description: token không hợp lệ
    *       422:
    *         description: sai loại tài khoản
    */
  /**
    * @swagger
    * /api/layDanhSachUser:
    *   get:
    *     description: get danh sach giao vien hoac phu huynh
    *     tags: [User]
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: userID
    *         description: user id
    *         in: query
    *         type: string
    *         required: true
    *       - name: typeUser
    *         description: loai tai khoan dc tra ve api getThongTin 1 = phu huynh  || 2 = giao vien
    *         in: query
    *         type: string
    *         required: true
    *         enum:
    *         - "1"
    *         - "2"
    *     responses:
    *       200:
    *         description: gửi dữ liệu thành công
    *       401:
    *         description: token không hợp lệ
    *       422:
    *         description: sai loại tài khoản
    */
  /**
    * @swagger
    * /api/layDanhSachHoiThoai:
    *   get:
    *     description: lay danh sach hoi thoai
    *     tags: [User]
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: userId
    *         description: id cua user dang nhap
    *         in: query
    *         type: string
    *         required: true
    *       - name: skip
    *         description: số bản ghi bỏ qua
    *         in: query
    *         type: string
    *         required: true
    *       - name: limit
    *         description: số bản ghi cần lấy
    *         in: query
    *         type: string
    *         required: true
    *     responses:
    *       200:
    *         description: gửi dữ liệu thành công
    *       401:
    *         description: token không hợp lệ
    *       422:
    *         description: sai loại tài khoản
    */
  app.post('/api/loginV1', userController.postLoginAsync)
  app.get('/api/getThongTin', userController.getThongTin)
  app.get('/api/layDuLieuHoiThoai', tinNhanAPI.layDuLieuHoiThoai)
  app.get('/api/layDanhSachUser', userController.layDanhSachUser)
  app.get('/api/layDanhSachHoiThoai', tinNhanAPI.layDanhSachHoiThoai)
}