const App = {}

App.browser = () => {
  let api_type = typeof browser

  if (api_type !== `undefined`) {
    return browser
  }

  api_type = typeof chrome

  if (api_type !== `undefined`) {
    return chrome
  }
}

App.print = (msg) => {
  // eslint-disable-next-line no-console
  console.info(msg)
}

App.debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    App.error(`Invalid debouncer function`)
    return
  }

  if (!delay) {
    App.error(`Invalid debouncer delay`)
    return
  }

  let timer
  let obj = {}

  function clear() {
    clearTimeout(timer)
  }

  function run(...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

App.open_sidebar = (tab) => {
  let window_id = tab.windowId
  let ext_api = App.browser()

  if (ext_api.sidebarAction) {
    ext_api.sidebarAction.open()
  }
  else if (ext_api.sidePanel) {
    ext_api.sidePanel.open({windowId: window_id})
  }
}

App.close_sidebar = (tab) => {
  let window_id = tab.windowId
  let ext_api = App.browser()

  if (ext_api.sidebarAction) {
    ext_api.sidebarAction.close()
  }
  else if (ext_api.sidePanel) {
    ext_api.sidePanel.close({windowId: window_id})
  }
}

export {App}