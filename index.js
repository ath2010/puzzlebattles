const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1211467",
  key: "a4fa8a54ab3d60692edb",
  secret: "8d33072e73b4467253a7",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});
