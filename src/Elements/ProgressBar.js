import React, { Component } from 'react'

export default class ProgressBar extends Component {
  render () {
    let innerStyle = {
      width: `${this.props.percent}%`
    }

    return (<div className="ProgressBar">
      <div className="ProgressBarOuter">
        <div className="ProgressBarInner" style={innerStyle}>
          &nbsp;
        </div>
      </div>
    </div>)
  }
}
