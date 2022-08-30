// Setup item editor
App.setup_item_editor = function () {
  App.log("Setting up item editor")
  App.msg_item_editor = Msg.factory(Object.assign({}, App.msg_settings))
  App.msg_item_editor.set_title("Item Editor")
  App.msg_item_editor.set(App.template_add)

  App.ev(App.el("#add_submit"), "click", function () {
    App.submit_item_editor()
  })

  App.item_editor_ready = true
}

// Show item editor
App.show_item_editor = function (item) {
  if (!App.item_editor_ready) {
    App.setup_item_editor()
  }
  
  if (item) {
    App.el("#add_title_input").value = item.title
    App.el("#add_url_input").value = item.url
  } else {
    App.el("#add_title_input").value = ""
    App.el("#add_url_input").value = ""
  }

  App.item_editor_item = item

  App.msg_item_editor.show(function () {
    App.el("#add_title_input").focus()
  })
}

// Submit item editor action
App.submit_item_editor = function () {
  let title_el = App.el("#add_title_input")
  let url_el = App.el("#add_url_input")
  let title = title_el.value.trim()
  let url = url_el.value.trim()

  if (!title || !url) {
    return
  }

  try {
    url_obj = new URL(url)
  } catch (err) {
    alert("Invalid URL")
    return
  } 

  App.msg_item_editor.close()

  if (App.item_editor_item) {
    App.remove_favorite(App.item_editor_item)
  }

  title_el.value = ""
  url_el.value = ""  

  let item = {
    title: title,
    url: url 
  }

  App.add_favorite(item)
  App.change_to_favorites()
}