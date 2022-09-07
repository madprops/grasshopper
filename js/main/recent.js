// Get recent
App.get_recent = async function () {
  App.recent = await App.get_storage(App.ls_recent, [])
}

// Get recent items
App.process_recent = function () {
  App.recent_items = []
  App.process_items(App.recent_items, App.recent, "recent")
}

// Saves the recent storage object
App.save_recent = function () {
  App.save_storage(App.ls_recent, App.recent)
}

// Add a recent item
App.add_recent = function (item) {
  App.recent = App.recent.filter(x => x.url !== item.url)
  
  let o = {}
  o.url = item.url
  o.title = item.title
  
  App.recent.unshift(o)
  App.recent = App.recent.slice(0, App.config.max_recent)
    
  for (let it of App.history_items) {
    if (it.url === item.url) {
      it.element.classList.add("removed")
      break
    }
  }

  App.save_recent()
  App.update_footer()
}

// Remove a recent item
App.remove_recent = function (item) {
  App.recent_items = App.recent_items.filter(x => x.url !== item.url)
  App.recent = App.recent.filter(x => x.url !== item.url)

  for (let it of App.history_items) {
    if (it.url === item.url) {
      it.element.classList.remove("removed")
      break
    }
  }

  item.element.classList.add("removed")
  App.save_recent()
  App.update_footer()
}

// Get recent urls
App.recent_urls = function () {
  return App.recent_items.map(x => x.url)
}