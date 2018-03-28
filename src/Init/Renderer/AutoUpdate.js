import {
  UPDATE_AVAILABLE,
  DOWNLOAD_PROGRESS,
  UPDATE_DOWNLOADED,
  DOWNLOAD_ERROR,
  setUpdateAvailable,
  setDownloadProgress,
  setUpdateDownloaded,
  setDownloadError
} from '../../Actions/AutoUpdate'

export function initAutoUpdates(ipcRenderer, dispatch) {
  ipcRenderer.on(UPDATE_AVAILABLE, (event, updateInfo) => {
    console.log(`update-available(renderer): v${updateInfo.version} available!`)
    dispatch(setUpdateAvailable(updateInfo))
  })
  ipcRenderer.on(DOWNLOAD_PROGRESS, (event, progressInfo) => {
    console.log(`download-progress (renderer): ${progressInfo.percent} @ ${progressInfo.bytesPerSecond}/s`)
    dispatch(setDownloadProgress(progressInfo))
  })
  ipcRenderer.on(UPDATE_DOWNLOADED, (event, path) => {
    console.log(`update-downloaded (main): ${path}`)
    dispatch(setUpdateDownloaded())
  })
  ipcRenderer.on(DOWNLOAD_ERROR, (event, errorInfo) => {
    console.log(`download-error (main): ${errorInfo}`)
    dispatch(setDownloadError(errorInfo))
  })
}
