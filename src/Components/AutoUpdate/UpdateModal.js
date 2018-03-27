import React, { Component } from 'react'

import connect from '../Helpers/connect'

import Modal from '../../Elements/Modal'

import OnlyIf from '../../Elements/OnlyIf'

import ProgressBar from '../../Elements/ProgressBar'


import * as AutoUpdate from '../../Actions/AutoUpdate'

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
          <h4>Release v{this.props.autoUpdate.versionInfo.newVersion} is now available!</h4>
          <OnlyIf test={!this.props.autoUpdate.downloadComplete && !this.props.autoUpdate.downloadInProgress}>
            <div>
              <p>{this.props.autoUpdate.versionInfo.releaseName || ''}</p>
              <div className="releaseNotes">
                { renderHtml(this.props.autoUpdate.versionInfo.releaseNotes) }
              </div>
            </div>
          </OnlyIf>
          <OnlyIf test={!this.props.autoUpdate.downloadComplete && this.props.autoUpdate.downloadInProgress}>
            <div>
              <ProgressBar progress={this.props.autoUpdate.downloadProgress.percent || 0} />
              <p>Downloaded {this.props.autoUpdate.transferred} of {this.props.autoUpdate.total} bytes.</p>
            </div>
          </OnlyIf>
          <footer>
            <button className="delayButton" onClick={() => {
              this.props.dispatch(AutoUpdate.cancelUpdate())
            }} >
              Cancel
            </button>
            <OnlyIf test={!this.props.autoUpdate.downloadComplete && !this.props.autoUpdate.downloadInProgress}>
              <button className="ctaButton" onClick={() => {
                this.props.dispatch(AutoUpdate.beginDownloading())
              }} >
              Download & Install
              </button>
            </OnlyIf>
            <OnlyIf test={this.props.autoUpdate.downloadComplete}>
              <button className="ctaButton" onClick={() => {
                this.props.dispatch(AutoUpdate.installAndRelaunch())
              }} >
              Install & Relaunch
              </button>
            </OnlyIf>
          </footer>
        </section>
      </Modal>
    )
  }
}

export default connect(UpdateModal, "autoUpdate")
