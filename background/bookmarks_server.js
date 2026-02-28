// Here bookmarks are cached for fast retrieval on the sidebar or popup
// On bookmark modifications the cache is updated to refresh the data
// On refresh the bookmarks are sent to the applications
// Updates work with a 1 second bouncer to avoid many updates in a short time
// The applications store this data in their own cache arrays that they get from here
// This is a persistent background script and should be always accesible
// The idea of this is to make bookmark retrieval much faster when many bookmarks exist
// Since the native getTree function is currently slow

import {App} from "./utils.js"

let bookmarks_active = false
let bookmark_items = []
let bookmark_folders = []
let bookmark_debouncer

App.browser().runtime.onMessage.addListener((request, sender, respond) => {
  if (request.action === `send_bookmarks`) {
    if (bookmarks_active) {
      send_bookmarks()
    }
  }
})

App.browser().permissions.onAdded.addListener(async (obj) => {
  if (obj.permissions.includes(`bookmarks`)) {
    App.print(`BG: Bookmarks permission granted`)

    if (!bookmarks_active) {
      await start_bookmarks(false)
      await refresh_bookmarks(false)
      send_bookmarks(true)
    }
  }
})

async function refresh_bookmarks(send = true) {
  let items = []
  let folders = []

  if (!await App.browser().permissions.contains({permissions: [`bookmarks`]})) {
    return
  }

  let nodes = await App.browser().bookmarks.getTree()

  function traverse(bookmarks) {
    for (let bookmark of bookmarks) {
      let title = bookmark.title

      // In Chrome, root nodes often have empty titles,
      // but we still need to traverse their children.
      if (title) {
        items.push(bookmark)
      }

      // Check for children instead of type === `folder`
      if (bookmark.children) {
        if (title) {
          folders.push(bookmark)
        }

        traverse(bookmark.children)
      }
    }
  }

  traverse(nodes)

  // Use || 0 to prevent sort errors if these properties are missing on some nodes
  items.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
  folders.sort((a, b) => (b.dateGroupModified || 0) - (a.dateGroupModified || 0))

  bookmark_items = items
  bookmark_folders = folders

  if (send) {
    send_bookmarks()
  }

  App.print(`BG: Bookmarks refreshed: ${folders.length} folders and ${items.length} items`)
}

function send_bookmarks(show_mode = false) {
  try {
    App.browser().runtime.sendMessage({
      action: `refresh_bookmarks`,
      items: bookmark_items,
      folders: bookmark_folders,
      show_mode,
    })
  }
  catch (err) {
    // Ignore
  }
}

export async function start_bookmarks(refresh = true) {
  let perm = await App.browser().permissions.contains({permissions: [`bookmarks`]})

  if (!perm) {
    App.print(`BG: No bookmarks permission`)
    return
  }

  bookmark_debouncer = App.debouncer(() => {
    refresh_bookmarks()
  }, 1000)

  App.browser().bookmarks.onCreated.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  App.browser().bookmarks.onRemoved.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  App.browser().bookmarks.onChanged.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  App.browser().bookmarks.onMoved.addListener((id, info) => {
    bookmark_debouncer.call()
  })

  if (refresh) {
    bookmark_debouncer.call()
  }

  bookmarks_active = true
}