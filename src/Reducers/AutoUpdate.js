import * as AutoUpdate from '../Actions/AutoUpdate'

const initialState = {
  downloadInProgress: false,
  isRestartingForUpdate: false,
  isNewVersionAvailable: false,
  versionInfo: {
    newVersion: '',
    releaseName: '',
    releaseNotes: ''
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case AutoUpdate.UPDATE_AVAILABLE:
      return Object.assign({}, initialState, state, {
        isNewVersionAvailable: true,
        versionInfo: {
          newVersion: action.newVersion,
          releaseName: action.releaseName,
          releaseNotes: action.releaseNotes
        }
      })
    case AutoUpdate.DOWNLOAD_PROGRESS:
      return Object.assign({}, initialState, state, {
        downloadInProgress: true,
        downloadProgress: {
          bytesPerSecond: action.bytesPerSecond,
          percent: action.percent,
          total: action.total,
          transferred: action.transferred
        }
      })
    case AutoUpdate.DOWNLOAD_ERROR:
      return Object.assign({}, initialState, state, {
        downloadInProgress: false,
        downloadError: action.errorInfo
        // don't clear progress so that progress bar can show where it failed
      })
    case AutoUpdate.INSTALL_AND_RELAUNCH:
      return Object.assign({}, initialState, state, {
        isRestartingForUpdate: true
      })
    case AutoUpdate.SHOW_UPDATE_MODAL:
      return Object.assign({}, initialState, state, {
        showModal: true
      })
    case AutoUpdate.HIDE_UPDATE_MODAL:
      return Object.assign({}, initialState, state, {
        showModal: false
      })
    default:
      if (!state || state.downloadProgress === undefined) {
        return Object.assign({}, initialState, state || {})
      } else {
        return state
      }
  }
}
