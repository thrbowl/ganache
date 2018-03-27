import EventEmitter from 'events'
import { app, protocol, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
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
    this.isDownloadingRelease = false
    this.isRestartingForUpdate = false

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

    autoUpdater.on('error', (errorInfo) => {
      console.log('error event fired', errorInfo)
      self.isCheckingForUpdate = false
      if (self.isDownloadingRelease) {
        self.emit('download-error', errorInfo)
      }
      self.isDownloadingRelease = false
    })

    proxiedEvents.map(this._initProxiedEvent.bind(this))
  }

  checkForUpdates() {
    if (false /*isDevMode*/) {
      let updateInfo = {
        version: autoUpdater.currentVersion,
        releaseName: 'Development Version',
        releaseNotes: '',
        releaseDate: new Date().toISOString()
      }

      this.emit('checking-for-update')

      // emit a dummy version info object to avoid any errors downstream
      this.emit('update-not-available', updateInfo)
      return Promise.resolve(updateInfo)
    } else {
      console.log(`checkForUpdates called!`)
      return autoUpdater.checkForUpdates()
    }
  }

  downloadUpdate(cancellationToken) {
    if (!devMode) {
      autoUpdater.downloadUpdate(cancellationToken)
    }
  }

  quitAndInstall() {
    if (!devMode) {
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
