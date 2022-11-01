// Setup stars
App.setup_stars = function () {
  App.create_window("stars", function () {  
    App.filter_stars = App.create_debouncer(function () {
      App.do_item_filter("stars")
    }, App.filter_delay)
    
    App.ev(App.el("#stars_filter"), "input", function () {
      App.filter_stars()
    })  
  
    App.ev(App.el("#stars_filter_mode"), "change", function () {
      App.do_item_filter("stars")
    })

    App.ev(App.el("#stars_next"), "click", function () {
      App.cycle_windows()
    }) 
    
    App.ev(App.el("#stars_prev"), "click", function () {
      App.cycle_windows(true)
    })
  })

  App.ev(App.el("#stars_button"), "click", function () {  
    App.show_window("stars")
  })  

  App.stars_items = App.get_stars()
}

// Selected stars item action
App.stars_action = function () {
  App.open_stars_item(App.selected_stars_item)
}

// Open stars item
App.open_stars_item = function (item, close = true) {
  App.star_item(item)
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Get stars
App.get_stars = function () {
  return App.state.stars
}

// Add an item to stars
App.star_item = function (item) {
  for (let [i, it] of App.stars_items.entries()) {
    if (it.url === item.url) {
      App.stars_items.splice(i, 1)
      break
    }
  }

  App.stars_items.unshift({
    id: `${Date.now()}_${item.url.substring(0, 100)}`,
    url: item.url,
    title: item.title
  })

  App.state.stars = App.stars_items.slice(0, App.max_stars)
  App.save_state()
}

// Remove an item from stars
App.unstar_item = function (item) {
  let star = App.get_item_by_url("stars", item.url)
  App.remove_item("stars", star)
  App.state.stars = App.stars_items.slice(0, App.max_stars)
  App.save_state()
}