from channels import Group
import redis, json, uuid
import ast


r = redis.StrictRedis(host='localhost', port=6379, db=0)
r.set("waiting_list", {})
r.set("playing", {})


def is_there_a_winner(board):
    winning_lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for a , b, c in winning_lines:
        if board[a] and board[a] == board[b] and board[a] == board[c]:
            return board[a];
    return None


def ws_message(message):
    msg = json.loads(message.content["text"])

    if msg['command'] == "connect":
        waiting_list = json.loads(r.get("waiting_list"))
        if waiting_list:
            game_id = waiting_list.keys()[0]
            Group(game_id).add(message.reply_channel)

            Group(game_id).send({"text": json.dumps({
                "gameId": game_id,
                "waitingForPlayer": 0,
                "createdBy": waiting_list[game_id]["created_by"]
            })})

        else:
            game_id = str(uuid.uuid1())
            waiting_list[game_id] = {
                "created_by": msg['username']
            }
            r.set("waiting_list", json.dumps(waiting_list))

            Group(game_id).add(message.reply_channel)
            Group(game_id).send({"text": json.dumps({
                "gameId": game_id,
                "waitingForPlayer": 1
                })})
    elif msg['command'] == "game_info":
        Group(msg['game_id']).send({
            "text": json.dumps({
                "type": "game_info",
                "board": msg['board'],
                "last_played_by": msg['username'],
                "winner": is_there_a_winner(msg['board'])
            })
        })

