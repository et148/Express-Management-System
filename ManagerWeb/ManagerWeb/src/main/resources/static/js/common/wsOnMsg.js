var frame=frame||{};
frame.Socket = function() {
	var Socket=function(params){
		var self=this;
		var _stompClient = null;
		this.connect=function(topics) {
			self.disconnect();
			var socket = new SockJS(ctx+"/endpoint");
			_stompClient = Stomp.over(socket);
			_stompClient.connect({}, function(frame) {
				// 监听主题示例("/topic/msg")
				for(var i in topics){
					_stompClient.subscribe(topics[i].name, function(msg){
						topics[i].callback&&topics[i].callback(JSON.parse(msg.body).responseMessage);
					});
				}
			});
		};
		this.send=function(topic,msg,atytopic) {
			// 发送主题示例("/app/msg")
			_stompClient.send(topic, {atytopic:atytopic||"default"}, JSON.stringify({ 'message': msg }));
		};
		this.disconnect=function() {
			if (_stompClient != null) {
				_stompClient.disconnect();
			}
		};
	};
	return {
		init:function(params){
			return new Socket(params);
		}
	};
}();

