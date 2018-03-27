import React, { Component } from 'react'

import connect from '../Helpers/connect'

import Modal from '../../Elements/Modal'

import { hideUpdateModal, installAndRelaunch } from '../../Actions/AutoUpdate'

import UpdateIcon from '../../Elements/icons/modal-update.svg'

import renderHtml from 'react-render-html'

class UpdateModal extends Component {
  constructor () {
    super()
    this.scrollDedupeTimeout = null
  }

  render () {
    return (
      <Modal className="UpdateModal">
        <section className="Update">
          <UpdateIcon />
          <h4>Release v{this.props.newVersion} is now available!</h4>
          <p>{this.props.releaseName}</p>
          <div className="releaseNotes">
            { renderHtml(this.props.releaseNotes) }
          </div>
          <footer>
            <button className="delayButton" onClick={() => {
              this.props.dispatch(hideUpdateModal())
            }} >
              Cancel
            </button>
            <button className="ctaButton" onClick={() => {
              this.props.dispatch(installAndRelaunch())
            }} >
              Install & Relaunch
              </button>
          </footer>
        </section>
      </Modal>
    )
  }
}

export default connect(UpdateModal)
