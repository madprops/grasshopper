let doing_init_bookmarks = false
let bookmark_items = []
let bookmark_folders = []
let bookmarks_active = false
let bookmark_debouncer

browser.runtime.onMessage.addListener((request, sender, respond) => {
  if (request.action === `init_bookmarks`) {
    print(`BG: Init bookmarks request`)

    if (bookmark_items.length || bookmark_folders.length) {
      send_bookmarks()
    }
    else if (!bookmarks_active) {
      init_bookmarks()
    }
  }
})

async function refresh_bookmarks(send = true) {
  let items = []
  let folders = []
  let nodes = await browser.bookmarks.getTree()

  function traverse(bookmarks) {
    for (let bookmark of bookmarks) {
      let type = bookmark.type
      let title = bookmark.title

      if (type === `folder`) {
        if (title) {
          folders.push(bookmark)
        }

        if (bookmark.children) {
          traverse(bookmark.children)
        }
      }
      else if (type === `bookmark`) {
        if (title) {
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

  print(`BG: Bookmarks refreshed: ${folders.length} folders and ${items.length} items`)
}

function send_bookmarks(show_mode = false) {
  browser.runtime.sendMessage({
    action: `refresh_bookmarks`,
    items: bookmark_items,
    folders: bookmark_folders,
    show_mode: show_mode,
  })
}

async function start_bookmarks(refresh = true) {
  let perm = await browser.permissions.contains({permissions: [`bookmarks`]})

  if (!perm) {
    print(`BG: No bookmarks permission`)
    return
  }

  // eslint-disable-next-line no-undef
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

  print(`BG: Init Bookmarks`)
  doing_init_bookmarks = true
  await start_bookmarks(false)

  if (bookmarks_active) {
    await refresh_bookmarks(false)
    await send_bookmarks(true)
  }

  doing_init_bookmarks = false
}

start_bookmarks()