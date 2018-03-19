import React, { Component } from 'react';
import './App.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick} disabled={!props.turn || props.won}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        turn={this.props.turn}
        won={this.props.won}
      />
    );
  }

  render() {
    return (
      <table align="center">
        <tbody>
          <tr>
            <td>{this.renderSquare(0)}</td>
            <td>{this.renderSquare(1)}</td>
            <td>{this.renderSquare(2)}</td>
          </tr> 
          <tr>
            <td>{this.renderSquare(3)}</td>
            <td>{this.renderSquare(4)}</td>
            <td>{this.renderSquare(5)}</td>
          </tr>
          <tr>
            <td>{this.renderSquare(6)}</td>
            <td>{this.renderSquare(7)}</td>
            <td>{this.renderSquare(8)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}


const Inputs = props => {
  return (
    <div className="input-form">
      <p>
        {props.label}
      </p>
      <input
        type={props.inputType}
        name={props.inputName}
        defaultValue={props.inputValue}
        onChange={props.onValueChange}
      />
    </div>
  );
};



class App extends Component {
  constructor(props) {
    super(props);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
      gameId: null,
      waitingForPlayer: true, 
      isYourTurn: false,
      youAre: "X",
      currentTurn: 'X',
      winner: false,
      board: ['', '', '', '', '', '', '', '', ''],
      play: null,

    };

  }


  handleClick(i) {
    let squares = this.state.board
    squares[i] = this.state.youAre
    this.setState({
      board: squares
    })
    this.state.play.send(
      JSON.stringify(
        {
          username: this.state.username,
          board: this.state.board,
          game_id: this.state.gameId,
          command: 'game_info'
        }
      )
    )
  }

  updateCurrentTurn (username){
    if (username == self.state.username){
      if (this.state.youAre == "X"){
        self.setState({
          currentTurn: "O"
        })  
      } else {
        self.setState({
          currentTurn: "X"
        })
      }
    } else {
      self.setState({
        currentTurn: self.state.youAre
      })
    }

  }


  onClickLogin(e) {
    let data = new FormData();
    data.append(
      "data",
      JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    );

    fetch("http://localhost:8000/login/", {
      method: "post",
      credentials: "include",
      body: data,
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then(json => {
        if (json.status == 'OK'){
          this.setState({ isLoggedIn: true });
        }

        var connection = new window.WebSocket('ws://127.0.0.1:8000/message/');
        self = this;
        connection.onopen = function () {
          connection.send(JSON.stringify({"username": self.state.username, "command": "connect"}))
          self.setState({
            play: connection,
          })
        };
        connection.onmessage = function (message) {

          var data = JSON.parse(message.data)

          if (!data.waitingForPlayer && data.type != "game_info") {
            let youAre = self.state.youAre
            if (data.createdBy != self.state.username){
              youAre = "O"
            }
            self.setState({
              waitingForPlayer: data.waitingForPlayer,
              youAre: youAre,
              gameId: data.gameId
            })

          } else if (data.type == "game_info") {
              self.setState({
                board: data.board
              })
              if (data.winner){
                self.setState({
                  winner: data.winner
                })
              }
              self.updateCurrentTurn(data.last_played_by)
          }
        };

      })
      .catch(err => {
        console.log(err);
      });
  }

  onValueChange(e) {
    let inputName = e.currentTarget.name;
    let inputValue = e.currentTarget.value;
    this.setState({
      [inputName]: inputValue
    });
  }

  render() {
    let isLoggedIn = this.state.isLoggedIn;
    if (!isLoggedIn) {
      return (
        <div id="login-form">
          <Inputs
            label="Username : "
            inputType="text"
            inputName="username"
            inputValue={this.state.username}
            onValueChange={this.onValueChange}
          />
          <Inputs
            label="Password : "
            inputType="password"
            inputName="password"
            inputValue={this.state.password}
            onValueChange={this.onValueChange}
          />
          <div className="form-submit-btn">
          <input
            className="themed-btn"
            type="button"
            onClick={this.onClickLogin}
            name="login"
            value="Login"
          />
          </div>
        </div>
      );
    } else {

        if (this.state.waitingForPlayer){
          return (
            <div>Waiting for a player to join !</div>
          )
        } else {
            return (
              <div>
              <div className="heading">tictactoe</div>
                <div className="game-board">
                  <Board
                    squares={this.state.board}
                    turn={ this.state.youAre == this.state.currentTurn ? true : false }
                    won={this.state.winner}
                    onClick={i => this.handleClick(i)}
                  />
                </div>
                <div className="game-info">
                  <div className="info">User: <b>{this.state.username}</b></div>
                  <div className="info">Your Code: <b>{this.state.youAre}</b></div>
                  <div className="info">Player Turn : <b>{ this.state.currentTurn }</b></div>
                  <div className="info">Winner: <b>{ this.state.winner ? this.state.winner : "__" }</b></div>
                </div>
              </div>
            );  
        }
    }
  }
}

export default App;