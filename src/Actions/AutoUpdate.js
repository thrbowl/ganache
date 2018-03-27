const prefix = 'UPDATE'

export const SHOW_UPDATE_MODAL = `${prefix}/SHOW_UPDATE_MODAL`
export const showUpdateModal = function() {
  return {type: SHOW_UPDATE_MODAL}
}

export const HIDE_UPDATE_MODAL = `${prefix}/HIDE_UPDATE_MODAL`
export const hideUpdateModal = function() {
  return {type: HIDE_UPDATE_MODAL}
}

export const UPDATE_AVAILABLE = `${prefix}/UPDATE_AVAILABLE`
export const setUpdateAvailable = function(newVersion, releaseName, releaseNotes) {
  if (releaseName === undefined && releaseNotes === undefined) {
    let updateInfo = newVersion
    newVersion = updateInfo.version
    releaseName = updateInfo.releaseName
    releaseNotes = updateInfo.releaseNotes
  }
  return {type: UPDATE_AVAILABLE, newVersion, releaseName, releaseNotes}
}

export const DOWNLOAD_PROGRESS = `${prefix}/DOWNLOAD_PROGRESS`
export const setDownloadProgress = function(bytesPerSecond, percent, total, transferred) {
  if (percent === undefined && total === undefined && transferred === undefined) {
    let progressInfo = bytesPerSecond
    bytesPerSecond = progressInfo.bytesPerSecond
    percent = progressInfo.percent
    total = progressInfo.total
    transferred = progressInfo.transferred
  }

  return {type: DOWNLOAD_PROGRESS, bytesPerSecond, percent, total, transferred }
}

export const UPDATE_DOWNLOADED = `${prefix}/UPDATE_DOWNLOADED`
export const setUpdateDownloaded = function(newVersion, releaseName, releaseNotes) {
  if (releaseName === undefined && releaseNotes === undefined) {
    let updateInfo = newVersion
    newVersion = updateInfo.version
    releaseName = updateInfo.releaseName
    releaseNotes = updateInfo.releaseNotes
  }
  return {type: UPDATE_DOWNLOADED, newVersion, releaseName, releaseNotes }
}

export const DOWNLOAD_ERROR = `${prefix}/DOWNLOAD_ERROR`
export const setDownloadError = function(errorInfo) {
  return {type: DOWNLOAD_ERROR, errorInfo }
}

export const INSTALL_AND_RELAUNCH = `${prefix}/INSTALL_AND_RELAUNCH`
export const installAndRelaunch = function() {
  return {type: INSTALL_AND_RELAUNCH}
}
