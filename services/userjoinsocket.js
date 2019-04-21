
exports.userJoinSocket = async (socket, userKeyIndex) => {
  console.log('======>user join: ', userKeyIndex);
  socket.join(userKeyIndex)
  // console.log('======>socket1: ', socket);
  
}

exports.userLeaveSocket = async (socket, userKeyIndex) => {
  socket.leave(userKeyIndex)
  // console.log('======>socket2: ', socket);

}