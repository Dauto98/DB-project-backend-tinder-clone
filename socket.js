module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-room", (data) => {
      socket.join(data.userId);
    });
  });

  return {
    sendMatchedNoti: (targetId, matchedId, header, content) => {
      io.to(targetId).emit("like-matched", { matchedId, header, content });
    }
  };
};
