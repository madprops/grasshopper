// Here bookmarks are cached for fast retrieval on the sidebar or popup
// On bookmark modifications the cache is updated to refresh the data
// On refresh the bookmarks are sent to the applications
// Updates work with a 1 second bouncer to avoid many updates in a short time
// The applications store this data in their own cache arrays that they get from here
// This is a persistent background script and should be always accesible
// The idea of this is to make bookmark retrieval much faster when many bookmarks exist
// Since the native getTree function is currently slow

let bookmarks_active = false
let bookmark_items = []
let bookmark_folders = []
let bookmark_debouncer

browser.permissions.onAdded.addListener(async (obj) => {
  if (obj.permissions.includes(`bookmarks`)) {
    await refresh_bookmarks(false)
    send_bookmarks(true)
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

  browser.bookmarks.onMoved.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  if (refresh) {
    bookmark_debouncer.call()
  }

  bookmarks_active = true
}

start_bookmarks()