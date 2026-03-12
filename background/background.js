import {App} from "./utils.js"
import {start_bookmarks} from "./bookmarks_server.js"

start_bookmarks()

function open_popup() {
  App.browser().action.openPopup()
}

async function set_item(what, value) {
  let key = `init_${what}`
  await App.browser().storage.local.set({[key]: value})
}

function open_popup_mode(mode) {
  set_item(`mode`, mode)
  open_popup()
}

function browser_command(num) {
  try {
    App.browser().runtime.sendMessage({action: `browser_command`, number: num})
  }
  catch (err) {
    // Ignore error if receiving end does not exist
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

App.browser().runtime.onInstalled.addListener(() => {
  App.browser().contextMenus.removeAll()

  App.browser().contextMenus.create({
    id: `modes_menu`,
    title: `Open`,
    contexts: [`action`],
  })

  App.browser().contextMenus.create({
    id: `open_tabs`,
    parentId: `modes_menu`,
    title: `Open Tabs`,
    contexts: [`action`],
  })

  App.browser().contextMenus.create({
    id: `open_history`,
    parentId: `modes_menu`,
    title: `Open History`,
    contexts: [`action`],
  })

  App.browser().contextMenus.create({
    id: `open_bookmarks`,
    parentId: `modes_menu`,
    title: `Open Bookmarks`,
    contexts: [`action`],
  })

  App.browser().contextMenus.create({
    id: `open_closed`,
    parentId: `modes_menu`,
    title: `Open Closed`,
    contexts: [`action`],
  })

  App.browser().contextMenus.create({
    id: `browser_commands`,
    title: `Browser Command`,
    contexts: [`action`],
  })

  for (let n = 1; n <= 10; n++) {
    App.browser().contextMenus.create({
      id: `browser_command_${n}`,
      parentId: `browser_commands`,
      title: `Browser Command ${n}`,
      contexts: [`action`],
    })
  }

  App.browser().contextMenus.create({
    id: `popup_commands`,
    title: `Popup Command`,
    contexts: [`action`],
  })

  for (let n = 1; n <= 10; n++) {
    App.browser().contextMenus.create({
      id: `popup_command_${n}`,
      parentId: `popup_commands`,
      title: `Popup Command ${n}`,
      contexts: [`action`],
    })
  }

  App.browser().contextMenus.create({
    id: `open_sidebar`,
    title: `Open Sidebar`,
    contexts: [`action`],
  })

  App.browser().contextMenus.create({
    id: `close_sidebar`,
    title: `Close Sidebar`,
    contexts: [`action`],
  })
})

App.browser().contextMenus.onClicked.addListener((info, tab) => {
  let id = info.menuItemId

  if (id === `open_sidebar`) {
    App.open_sidebar(tab)
  }
  else if (id === `close_sidebar`) {
    App.close_sidebar(tab)
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
  else if (id.startsWith(`browser_command`)) {
    let n = parseInt(id.replace(`browser_command_`, ``))
    browser_command(n)
  }
  else if (id.startsWith(`popup_command`)) {
    let n = parseInt(id.replace(`popup_command_`, ``))
    popup_command(n)
  }
})

App.browser().runtime.onMessage.addListener((request, sender, send_response) => {
  if (request.action === `boost_tab`) {
    try {
      App.browser().scripting.executeScript({
        target: {tabId: request.tab_id},
        files: [`js/content.js`],
      })
    }
    catch (err) {
      // Ignore
    }
  }
})