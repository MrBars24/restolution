import React, { Component } from 'react';

class FloatingTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000 // Update time every 1 second
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  render() {
    return (
        <div className="floating-time">
        <p>Time Clocks: {this.state.time.toLocaleTimeString()}</p>
      </div>
    );
  }
}

export default FloatingTime;
