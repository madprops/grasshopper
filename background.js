let doing_init_bookmarks = false
let bookmark_items = []
let bookmark_folders = []
let bookmarks_active = false
let bookmark_debouncer

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === `init_bookmarks`) {
    if (bookmark_items.length || bookmark_folders.length) {
      send_bookmarks(true)
    }
    else if (!bookmarks_active) {
      init_bookmarks()
    }
  }
})

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

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
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
  browser.runtime.sendMessage({action: `browser_command`, number: num})
}

async function popup_command(num) {
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

async function refresh_bookmarks(send = true) {
  let items = []
  let folders = []
  let nodes = await browser.bookmarks.getTree()

  function traverse(bookmarks) {
    for (let bookmark of bookmarks) {
      if (bookmark.children) {
        if (bookmark.title) {
          folders.push(bookmark)
        }

        traverse(bookmark.children)
      }
      else {
        if (bookmark.title) {
          items.push(bookmark)
        }
      }
    }
  }

  traverse(nodes)

  items.sort((a, b) => b.dateAdded - a.dateAdded)
  folders.sort((a, b) => b.dateGroupModified - a.dateGroupModified)

  bookmark_items = items
  bookmark_folders = folders

  if (send) {
    send_bookmarks()
  }

  console.info(`BG: Bookmarks refreshed: ${folders.length} folders and ${items.length} items.`)
}

async function start_bookmarks(refresh = true) {
  let perm = await browser.permissions.contains({permissions: [`bookmarks`]})

  if (!perm) {
    console.info(`BG: No bookmarks permission.`)
    return
  }

  bookmark_debouncer = debouncer(() => {
    refresh_bookmarks()
  }, 1000)

  browser.bookmarks.onCreated.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  browser.bookmarks.onRemoved.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  browser.bookmarks.onChanged.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  if (refresh) {
    bookmark_debouncer.call()
  }

  bookmarks_active = true
}

async function init_bookmarks() {
  if (doing_init_bookmarks || bookmarks_active) {
    return
  }

  doing_init_bookmarks = true
  await start_bookmarks(false)
  await refresh_bookmarks(false)
  await send_bookmarks(true)
  doing_init_bookmarks = false
}

function send_bookmarks(show_mode = false) {
  browser.runtime.sendMessage({
    action: "refresh_bookmarks",
    items: bookmark_items,
    folders: bookmark_folders,
    show_mode: show_mode,
  })
}

start_bookmarks()