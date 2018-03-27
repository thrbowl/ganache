import EventEmitter from 'events'
import { app, protocol, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { CancellationToken } from 'builder-util-runtime'
import path from 'path'
import _ from 'lodash'

const isDevMode = process.execPath.match(/[\\/]electron/);

const proxiedEvents = [
  'checking-for-update',
  'update-available',
  'update-not-available',
  'error',
  'update-downloaded',
  'download-progress'
]

const defaultOptions = {
  allowPrerelease: false,
  fullChangelog: false,
  autoDownload: false
}

let _cancelToken = null

export default class AutoUpdateService extends EventEmitter {
  constructor(options) {
    super()
    const self = this
    options = _.merge({}, defaultOptions, options || {})

    autoUpdater.allowPrerelease = options.allowPrerelease
    autoUpdater.fullChangelog = options.fullChangelog
    autoUpdater.autoDownload = options.autoDownload
    autoUpdater.currentVersion = isDevMode ? '1.0.0' : app.getVersion()

    if (isDevMode) {
      autoUpdater.updateConfigPath = path.join(__dirname, '..', '..', 'dev-app-update.yml')
    }

    this.isCheckingForUpdate = false
    this.isUpdateAvailable = false
    this.isDownloadingUpdate = false
    this.isRestartingForUpdate = false
    this.updateDownloaded = false

    autoUpdater.on('checking-for-update', () => {
      console.log('checking-for-update event fired')
      self.isCheckingForUpdate = true
    })

    autoUpdater.on('update-not-available', () => {
      console.log('update-not-available event fired')
      self.isCheckingForUpdate = false
      self.isUpdateAvailable = false
    })

    autoUpdater.on('update-available', (updateInfo) => {
      console.log('update-available event fired')
      self.isCheckingForUpdate = false
      self.isUpdateAvailable = true
      self.updateVersion = updateInfo.version
      self.updateReleaseName = updateInfo.releaseName
      self.updateReleaseNotes = updateInfo.releaseNotes
    })

    autoUpdater.on('update-downloaded', (path) => {
      self.updateDownloaded = true
      _cancelToken = null;
    })
    autoUpdater.on('error', (errorInfo) => {
      console.log('error event fired', errorInfo)
      if (self.isDownloadingUpdate) {
        self.emit('download-error', errorInfo)
      }
      self.isCheckingForUpdate = false
      self.isDownloadingUpdate = false
    })

    proxiedEvents.map(this._initProxiedEvent.bind(this))
  }

  checkForUpdates() {
    console.log(`checkForUpdates called!`)
    return autoUpdater.checkForUpdates()
  }

  downloadUpdate() {
    this.isDownloadingUpdate = true
    if (_cancelToken) {
      _cancelToken.cancel()
    }
    _cancelToken = new CancellationToken()
    autoUpdater.downloadUpdate(_cancelToken)
  }

  cancelUpdate() {
    if (_cancelToken) {
      _cancelToken.cancel()
      _cancelToken = null
      this.isDownloadingUpdate = false
    }
  }

  installAndRelaunch() {
    if (!devMode && this.updateDownloaded) {
      this.restartingForUpdate = true
      appUpdater.quitAndInstall(false, true)
    }
  }

  _initProxiedEvent(event) {
    const self = this
    autoUpdater.on(event, (...args) => {
      self.emit(event, ...args)
    })
  }
}
