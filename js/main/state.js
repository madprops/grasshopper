// Get state from sync storage
App.get_state = async function () {
  let obj = await browser.storage.sync.get(App.ls_state)
  
  if (Object.keys(obj).length === 0) {
    App.state = {}
  } else {
    App.state = obj[App.ls_state]
  }

  let changed = false

  if (!App.state.text_mode) {
    App.state.text_mode = "title"
    changed = true
  }

  if (!App.state.history_results) {
    App.state.history_results = "normal"
    changed = true
  }

  if (!App.state.color) {
    App.state.color = "rgb(37, 41, 51)"
    changed = true
  } 

  if (!App.state.stars) {
    App.state.stars = []
    changed = true
  }   

  if (!App.state.window_order) {
    App.state.window_order = ["tabs", "stars", "closed", "history"]
    changed = true
  }   

  if (changed) {
    App.save_state()
  }
}

// Save state to sync storage
App.save_state = async function () {
  let o = {}
  o[App.ls_state] = App.state
  await browser.storage.sync.set(o)
}