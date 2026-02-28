import {App} from "./utils.js"
import {start_bookmarks} from "./bookmarks_server.js"

start_bookmarks()

function open_popup() {
  App.browser().browserAction.openPopup()
}

async function set_item(what, value) {
  let key = `init_${what}`
  App.browser().storage.local.set({[key]: value})
}

async function open_popup_mode(mode) {
  await set_item(`mode`, mode)
  open_popup()
}

function browser_command(num) {
  try {
    App.browser().runtime.sendMessage({action: `browser_command`, number: num})
  }
  catch (err) {
    // Ignore
  }
}

function popup_command(num) {
  set_item(`popup_command`, num)
  open_popup()
}

App.browser().commands.onCommand.addListener((command) => {
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

App.browser().contextMenus.create({
  id: `toggle_sidebar`,
  title: `Toggle Sidebar`,
  contexts: [`action`],
})

App.browser().contextMenus.create({
  type: `separator`,
  id: `separator1`,
  contexts: [`action`],
})

App.browser().contextMenus.create({
  id: `open_tabs`,
  title: `Open Tabs`,
  contexts: [`action`],
})

App.browser().contextMenus.create({
  id: `open_history`,
  title: `Open History`,
  contexts: [`action`],
})

App.browser().contextMenus.create({
  id: `open_bookmarks`,
  title: `Open Bookmarks`,
  contexts: [`action`],
})

App.browser().contextMenus.create({
  id: `open_closed`,
  title: `Open Closed`,
  contexts: [`action`],
})

App.browser().contextMenus.onClicked.addListener((info, tab) => {
  let id = info.menuItemId

  if (id === `toggle_sidebar`) {
    App.browser().sidebarAction.toggle()
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

App.browser().runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === `boost_tab`) {
    try {
      App.browser().scripting.executeScript({
        target: {tabId: request.tab_id},
        files: [`js/content.js`],
      })
    }
    catch (err) {
      //
    }
  }
})