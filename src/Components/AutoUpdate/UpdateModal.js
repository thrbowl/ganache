import React, { Component } from 'react'

import connect from '../Helpers/connect'

import Modal from '../../Elements/Modal'

import OnlyIf from '../../Elements/OnlyIf'

import ProgressBar from '../../Elements/ProgressBar'

import * as AutoUpdate from '../../Actions/AutoUpdate'

import UpdateIcon from '../../Elements/icons/modal-update.svg'

import renderHtml from 'react-render-html'

import * as filesize from 'filesize'

const sizeFormatter = filesize.partial({standard: 'jedec'})

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
            <div className="updateDetails">
              <p>{this.props.autoUpdate.versionInfo.releaseName || ''}</p>
              <div className="releaseNotes">
                { renderHtml(this.props.autoUpdate.versionInfo.releaseNotes) }
              </div>
            </div>
          </OnlyIf>
          <OnlyIf test={ !this.props.autoUpdate.downloadError && (this.props.autoUpdate.downloadComplete || this.props.autoUpdate.downloadInProgress) }>
            <div className="updateDetails">
              <ProgressBar percent={ this.props.autoUpdate.downloadProgress.percent }>
              </ProgressBar>
              <OnlyIf test={ !this.props.autoUpdate.downloadComplete && this.props.autoUpdate.downloadProgress.total > 0 }>
                <p className="downloadSpeed">{ sizeFormatter(this.props.autoUpdate.downloadProgress.bytesPerSecond || 0) }/s</p>
              </OnlyIf>
              <OnlyIf test={ this.props.autoUpdate.downloadComplete }>
                <p>Download Complete - Restarting!</p>
              </OnlyIf>
            </div>
          </OnlyIf>
          <OnlyIf test={ this.props.autoUpdate.downloadError }>
            <div className="updateDetails">
              <p>An error occurred while downloading your update!</p>
              <p>{ this.props.autoUpdate.downloadError ? (this.props.autoUpdate.downloadError.message || this.props.autoUpdate.downloadError) : '' }</p>
            </div>
          </OnlyIf>
          <footer>
            <OnlyIf test={ !this.props.autoUpdate.downloadComplete }>
              <button className="delayButton" onClick={() => {
                this.props.dispatch(AutoUpdate.cancelUpdate())
              }} >
                Cancel
              </button>
            </OnlyIf>
            <OnlyIf test={ !this.props.autoUpdate.downloadComplete && !this.props.autoUpdate.downloadInProgress }>
              <button className="ctaButton" onClick={() => {
                this.props.dispatch(AutoUpdate.beginDownloading())
              }} >
              Download & Install
              </button>
            </OnlyIf>
            <OnlyIf test={ this.props.autoUpdate.downloadError }>
              <button className="ctaButton" onClick={() => {
                this.props.dispatch(AutoUpdate.beginDownloading())
              }} >
              Try Again
              </button>
            </OnlyIf>
          </footer>
        </section>
      </Modal>
    )
  }
}

export default connect(UpdateModal, "autoUpdate")
