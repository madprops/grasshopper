// Setup the modal windows
App.setup_windows = function () {
  App.msg_settings = {
    enable_titlebar: true,
    window_x: "inner_right",
    disable_content_padding: true,
    center_titlebar: true,
    after_show: function () {
      App.modal_open = true
    },
    after_close: function () {
      App.modal_open = false
    },
  }

  App.msg_settings_window = Object.assign({}, App.msg_settings, {
    window_height: "100vh",
    window_min_height: "100vh",
    window_max_height: "100vh",
    window_width: "100vw",
    window_min_width: "100vw",
    window_max_width: "100vw",
  })
}

// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim()
}