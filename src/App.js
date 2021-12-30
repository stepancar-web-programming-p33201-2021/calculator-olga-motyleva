import './App.css';
import React from 'react';
import buttonStorage from './buttonStorage';
import TapeEngine from './businesslogic/TapeEngine';
import classNames from 'classnames';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      out: '',
      tapeEngine: new TapeEngine()
    }

    this.refOutput = React.createRef();
    this.refButtons = React.createRef();
  }

  componentDidMount() {
    const buttons = Array.from(this.refButtons.current.querySelectorAll('button'));
    buttons.forEach(e => e.style.height = e.offsetWidth + 'px');
  }

  componentDidUpdate() {
    const buttons = Array.from(this.refButtons.current.querySelectorAll('button'));
    buttons.forEach(e => e.style.height = e.offsetWidth + 'px');
  }

  onKeyPress(event) {
    const item = { value: '=', type: 'operation', color: 'default' };

    if (event.key === 'Enter') {
      this.onButtonClick(item);
    }
  }

  onButtonClick(item) {
    let output = this.refOutput.current;
    this.state.tapeEngine.setProps(item, output.value, output.className);
    this.state.tapeEngine.tape();
    output = this.state.tapeEngine.handleOutput(output);
  }

  render() {
    return (
      <div className="calculator">
        <div className="calculator-result">
          <input ref={this.refOutput} onKeyPress={(e) => { this.onKeyPress(e) }} className="calculator-result-expression"
            defaultValue={this.state.out} id="input" placeholder='0'
          ></input>
        </div>

        <div ref={this.refButtons} className="calculator-buttons">
          {buttonStorage.buttons.map((item) => <button
            key={item.value} className={classNames(item.type, item.color)} onClick={() => { this.onButtonClick(item) }}
          >{item.value}</button>)}
        </div>
      </div>
    );
  }
}

export default App;