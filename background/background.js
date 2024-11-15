function print(msg) {
  // eslint-disable-next-line no-console
  console.info(msg)
}

function debouncer(func, delay) {
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

function open_popup() {
  browser.browserAction.openPopup()
}

function set_item(what, value) {
  localStorage.setItem(`init_${what}`, value)
}

function open_popup_mode(mode) {
  set_item(`mode`, mode)
  open_popup()
}

function browser_command(num) {
  try {
    browser.runtime.sendMessage({action: `browser_command`, number: num})
  }
  catch (err) {
    // Ignore
  }
}

function popup_command(num) {
  set_item(`popup_command`, num)
  open_popup()
}

browser.commands.onCommand.addListener((command) => {
  if (command === `popup_tabs`) {
    open_popup_mode(`tabs`)
  }
  else if (command === `popup_history`) {
    open_popup_mode(`history`)
  }
  else if (command === `popup_bookmarks`) {
    open_popup_mode(`bookmarks`)
  }
  else if (command === `popup_closed`) {
    open_popup_mode(`closed`)
  }
  else if (command.startsWith(`browser_command_`)) {
    let num = command.split(`_`).at(-1)

    if (num) {
      browser_command(num)
    }
  }
  else if (command.startsWith(`popup_command_`)) {
    let num = command.split(`_`).at(-1)

    if (num) {
      popup_command(num)
    }
  }
})

browser.contextMenus.create({
  id: `toggle_sidebar`,
  title: `Toggle Sidebar`,
  contexts: [`browser_action`],
})

browser.contextMenus.create({
  type: `separator`,
  id: `separator1`,
  contexts: [`browser_action`],
})

browser.contextMenus.create({
  id: `open_tabs`,
  title: `Open Tabs`,
  contexts: [`browser_action`],
})

browser.contextMenus.create({
  id: `open_history`,
  title: `Open History`,
  contexts: [`browser_action`],
})

browser.contextMenus.create({
  id: `open_bookmarks`,
  title: `Open Bookmarks`,
  contexts: [`browser_action`],
})

browser.contextMenus.create({
  id: `open_closed`,
  title: `Open Closed`,
  contexts: [`browser_action`],
})

browser.contextMenus.onClicked.addListener((info, tab) => {
  let id = info.menuItemId

  if (id === `toggle_sidebar`) {
    browser.sidebarAction.toggle()
  }
  else if (id === `open_tabs`) {
    open_popup_mode(`tabs`)
  }
  else if (id === `open_history`) {
    open_popup_mode(`history`)
  }
  else if (id === `open_bookmarks`) {
    open_popup_mode(`bookmarks`)
  }
  else if (id === `open_closed`) {
    open_popup_mode(`closed`)
  }
})