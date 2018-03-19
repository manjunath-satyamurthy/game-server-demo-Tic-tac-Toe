from channels.routing import route
from consumers import ws_message
 
# routes defined for channel calls
# this is similar to the Django urls, but specifically for Channels
channel_routing = [
	route("websocket.receive", ws_message, path=r"^/message/$"),
]