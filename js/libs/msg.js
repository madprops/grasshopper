/* Msg v11.7.5 https://github.com/Merkoba/Msg */

const Msg = {}

Msg.num_created = 0

Msg.factory = function (options = {}) {
  const instance = {}

  instance.close_enabled = true
  instance.click_enabled = true
  instance.keys_enabled = true
  instance.closing = false
  instance.stack_pos_top = undefined
  instance.stack_pos_bottom = undefined
  instance.stack_pos_left = undefined
  instance.stack_pos_right = undefined
  instance.stack_width = undefined
  instance.stack_height = undefined
  instance.slide_in_ongoing = false
  instance.content_for_close_on_show = undefined
  instance.callback_for_close_on_show = undefined

  instance.options = options

  instance.check_options = function () {
    if (instance.options.preset !== undefined) {
      if (instance.options.preset === "popup") {
        if (instance.options.class === undefined)
          instance.options.class = "green"
        if (instance.options.enable_overlay === undefined)
          instance.options.enable_overlay = false
        if (instance.options.position === undefined)
          instance.options.position = "bottomright"
        if (instance.options.remove_after_close === undefined)
          instance.options.remove_after_close = true
        if (instance.options.zStack_level === undefined)
          instance.options.zStack_level = 1
        if (instance.options.window_width === undefined)
          instance.options.window_width = "460px"
        if (instance.options.lock === undefined) instance.options.lock = false
        if (instance.options.show_effect === undefined)
          instance.options.show_effect = "fade"
        if (instance.options.show_effect_duration === undefined)
          instance.options.show_effect_duration = 350
        if (instance.options.close_effect === undefined)
          instance.options.close_effect = "fade"
        if (instance.options.close_effect_duration === undefined)
          instance.options.close_effect_duration = 350
      } else if (instance.options.preset === "popup_autoclose") {
        if (instance.options.class === undefined)
          instance.options.class = "green"
        if (instance.options.enable_overlay === undefined)
          instance.options.enable_overlay = false
        if (instance.options.position === undefined)
          instance.options.position = "bottomright"
        if (instance.options.autoclose === undefined)
          instance.options.autoclose = true
        if (instance.options.enable_progressbar === undefined)
          instance.options.enable_progressbar = true
        if (instance.options.remove_after_close === undefined)
          instance.options.remove_after_close = true
        if (instance.options.zStack_level === undefined)
          instance.options.zStack_level = 1
        if (instance.options.window_width === undefined)
          instance.options.window_width = "460px"
        if (instance.options.lock === undefined) instance.options.lock = false
        if (instance.options.show_effect === undefined)
          instance.options.show_effect = "fade"
        if (instance.options.show_effect_duration === undefined)
          instance.options.show_effect_duration = 350
        if (instance.options.close_effect === undefined)
          instance.options.close_effect = "fade"
        if (instance.options.close_effect_duration === undefined)
          instance.options.close_effect_duration = 350
      } else if (instance.options.preset === "snackbar") {
        if (instance.options.class === undefined)
          instance.options.class = "black"
        if (instance.options.content_class === undefined)
          instance.options.content_class = "snackbar"
        if (instance.options.position === undefined)
          instance.options.position = "bottom"
        if (instance.options.edge_padding_y === undefined)
          instance.options.edge_padding_y = 0
        if (instance.options.window_min_width === undefined)
          instance.options.window_min_width = "600px"
        if (instance.options.window_x === undefined)
          instance.options.window_x = "none"
        if (instance.options.enable_overlay === undefined)
          instance.options.enable_overlay = false
        if (instance.options.autoclose === undefined)
          instance.options.autoclose = true
        if (instance.options.autoclose_delay === undefined)
          instance.options.autoclose_delay = 10000
        if (instance.options.close_on_show === undefined)
          instance.options.close_on_show = true
        if (instance.options.show_effect === undefined)
          instance.options.show_effect = "slide_up"
        if (instance.options.show_effect_duration === undefined)
          instance.options.show_effect_duration = 350
        if (instance.options.close_effect === undefined)
          instance.options.close_effect = "slide_down"
        if (instance.options.close_effect_duration === undefined)
          instance.options.close_effect_duration = 350
        if (instance.options.sideStack === undefined)
          instance.options.sideStack = "none"
        if (instance.options.zStack_level === undefined)
          instance.options.zStack_level = 1
        if (instance.options.lock === undefined) instance.options.lock = false
      } else if (instance.options.preset === "window") {
        if (instance.options.window_height === undefined)
          instance.options.window_height = "100vh"
        if (instance.options.window_min_height === undefined)
          instance.options.window_min_height = "100vh"
        if (instance.options.window_max_height === undefined)
          instance.options.window_max_height = "100vh"
        if (instance.options.window_width === undefined)
          instance.options.window_width = "100vw"
        if (instance.options.window_min_width === undefined)
          instance.options.window_min_width = "100vw"
        if (instance.options.window_max_width === undefined)
          instance.options.window_max_width = "100vw"
        if (instance.options.disable_transformations === undefined)
          instance.options.disable_transformations = true
        if (instance.options.disable_content_padding === undefined)
          instance.options.disable_content_padding = true
        if (instance.options.full_content === undefined)
          instance.options.full_content = true
        if (instance.options.window_x === undefined)
          instance.options.window_x = "none"
      }
    }

    if (instance.options.id === undefined) {
      instance.options.id = Msg.num_created + 1
    }

    if (instance.options.class === undefined) {
      instance.options.class = "default"
    }

    if (instance.options.lock === undefined) {
      instance.options.lock = true
    }

    if (instance.options.closeable === undefined) {
      instance.options.closeable = true
    }

    if (instance.options.enable_overlay === undefined) {
      instance.options.enable_overlay = true
    }

    if (instance.options.close_on_overlay_click === undefined) {
      instance.options.close_on_overlay_click = true
    }

    if (instance.options.enable_titlebar === undefined) {
      instance.options.enable_titlebar = false
    }

    if (instance.options.center_titlebar === undefined) {
      instance.options.center_titlebar = false
    }

    if (instance.options.window_x === undefined) {
      if (instance.options.enable_titlebar) {
        instance.options.window_x = "inner_right"
      } else {
        instance.options.window_x = "floating_right"
      }
    }

    if (instance.options.overlay_x === undefined) {
      instance.options.overlay_x = "none"
    }

    if (instance.options.close_on_escape === undefined) {
      instance.options.close_on_escape = true
    }

    if (instance.options.clear_editables === undefined) {
      instance.options.clear_editables = false
    }

    if (instance.options.before_show === undefined) {
      instance.options.before_show = function () {}
    }

    if (instance.options.after_show === undefined) {
      instance.options.after_show = function () {}
    }

    if (instance.options.before_set === undefined) {
      instance.options.before_set = function () {}
    }

    if (instance.options.after_set === undefined) {
      instance.options.after_set = function () {}
    }

    if (instance.options.before_set_title === undefined) {
      instance.options.before_set_title = function () {}
    }

    if (instance.options.after_set_title === undefined) {
      instance.options.after_set_title = function () {}
    }

    if (instance.options.before_set_progress === undefined) {
      instance.options.before_set_progress = function () {}
    }

    if (instance.options.after_set_progress === undefined) {
      instance.options.after_set_progress = function () {}
    }

    if (instance.options.before_close === undefined) {
      instance.options.before_close = function () {}
    }

    if (instance.options.after_close === undefined) {
      instance.options.after_close = function () {}
    }

    if (instance.options.after_last_closed === undefined) {
      instance.options.after_last_closed = function () {}
    }

    if (instance.options.before_toggle === undefined) {
      instance.options.before_toggle = function () {}
    }

    if (instance.options.after_toggle === undefined) {
      instance.options.after_toggle = function () {}
    }

    if (instance.options.before_create === undefined) {
      instance.options.before_create = function () {}
    }

    if (instance.options.after_create === undefined) {
      instance.options.after_create = function () {}
    }

    if (instance.options.before_destroy === undefined) {
      instance.options.before_destroy = function () {}
    }

    if (instance.options.after_destroy === undefined) {
      instance.options.after_destroy = function () {}
    }

    if (instance.options.while_open === undefined) {
      instance.options.while_open = function () {}
    }

    if (instance.options.on_click === undefined) {
      instance.options.on_click = function () {}
    }

    if (instance.options.on_middle_click === undefined) {
      instance.options.on_middle_click = function () {}
    }

    if (instance.options.on_wheel_down === undefined) {
      instance.options.on_wheel_down = function () {}
    }

    if (instance.options.on_wheel_up === undefined) {
      instance.options.on_wheel_up = function () {}
    }

    if (instance.options.on_overlay_click === undefined) {
      instance.options.on_overlay_click = function () {}
    }

    if (instance.options.on_titlebar_click === undefined) {
      instance.options.on_titlebar_click = function () {}
    }

    if (instance.options.on_x_button_click === undefined) {
      instance.options.on_x_button_click = function () {}
    }

    if (instance.options.while_open_interval === undefined) {
      instance.options.while_open_interval = 1000
    } else {
      instance.options.while_open_interval = parseInt(
        instance.options.while_open_interval
      )
    }

    if (instance.options.temp_disable_close === undefined) {
      instance.options.temp_disable_close = false
    }

    if (instance.options.temp_disable_close_delay === undefined) {
      instance.options.temp_disable_close_delay = 1000
    } else {
      instance.options.temp_disable_close_delay = parseInt(
        instance.options.temp_disable_close_delay
      )
    }

    if (instance.options.autoclose === undefined) {
      instance.options.autoclose = false
    }

    if (instance.options.autoclose_delay === undefined) {
      instance.options.autoclose_delay = 5000
    } else {
      instance.options.autoclose_delay = parseInt(
        instance.options.autoclose_delay
      )
    }

    if (instance.options.temp_disable_click === undefined) {
      instance.options.temp_disable_click = false
    }

    if (instance.options.temp_disable_click_delay === undefined) {
      instance.options.temp_disable_click_delay = 1000
    } else {
      instance.options.temp_disable_click_delay = parseInt(
        instance.options.temp_disable_click_delay
      )
    }

    if (instance.options.temp_disable_keys === undefined) {
      instance.options.temp_disable_keys = false
    }

    if (instance.options.temp_disable_keys_delay === undefined) {
      instance.options.temp_disable_keys_delay = 1000
    } else {
      instance.options.temp_disable_keys_delay = parseInt(
        instance.options.temp_disable_keys_delay
      )
    }

    if (instance.options.persistent === undefined) {
      instance.options.persistent = true
    }

    if (instance.options.remove_after_close === undefined) {
      instance.options.remove_after_close = false
    }

    if (instance.options.show_effect === undefined) {
      instance.options.show_effect = "fade"
    }

    if (instance.options.show_effect_duration === undefined) {
      instance.options.show_effect_duration = [200, 200]
    }

    if (instance.options.close_effect === undefined) {
      instance.options.close_effect = "fade"
    }

    if (instance.options.close_effect_duration === undefined) {
      instance.options.close_effect_duration = [200, 200]
    }

    if (instance.options.position === undefined) {
      instance.options.position = "center"
    }

    if (instance.options.enable_progressbar === undefined) {
      instance.options.enable_progressbar = false
    }

    if (instance.options.bind_progressbar_to_autoclose === undefined) {
      instance.options.bind_progressbar_to_autoclose = true
    }

    if (instance.options.reverse_autoclose_progressbar === undefined) {
      instance.options.reverse_autoclose_progressbar = false
    }

    if (instance.options.edge_padding_x === undefined) {
      instance.options.edge_padding_x = 20
    } else {
      instance.options.edge_padding_x = parseInt(
        instance.options.edge_padding_x
      )
    }

    if (instance.options.edge_padding_y === undefined) {
      instance.options.edge_padding_y = 20
    } else {
      instance.options.edge_padding_y = parseInt(
        instance.options.edge_padding_y
      )
    }

    if (instance.options.sideStack_padding === undefined) {
      instance.options.sideStack_padding = 20
    }

    if (instance.options.sideStack_padding === undefined) {
      instance.options.sideStack_padding = 20
    } else {
      instance.options.sideStack_padding = parseInt(
        instance.options.sideStack_padding
      )
    }

    if (instance.options.sideStack === undefined) {
      instance.options.sideStack = "vertical"
    }

    if (instance.options.sideStack_collapse === undefined) {
      instance.options.sideStack_collapse = true
    }

    if (instance.options.zStack_level === undefined) {
      instance.options.zStack_level = 2
    } else {
      instance.options.zStack_level = parseInt(instance.options.zStack_level)
    }

    if (instance.options.show_delay === undefined) {
      instance.options.show_delay = 0
    } else {
      instance.options.show_delay = parseInt(instance.options.show_delay)
    }

    if (instance.options.close_delay === undefined) {
      instance.options.close_delay = 0
    } else {
      instance.options.close_delay = parseInt(instance.options.close_delay)
    }

    if (instance.options.window_width === undefined) {
      instance.options.window_width = "auto"
    }

    if (instance.options.window_height === undefined) {
      instance.options.window_height = "auto"
    }

    if (instance.options.window_min_width === undefined) {
      instance.options.window_min_width = "auto"
    }

    if (instance.options.window_min_height === undefined) {
      instance.options.window_min_height = "auto"
    }

    if (instance.options.window_max_width === undefined) {
      instance.options.window_max_width = "80vw"
    }

    if (instance.options.window_max_height === undefined) {
      instance.options.window_max_height = "80vh"
    }

    if (instance.options.window_cursor === undefined) {
      instance.options.window_cursor = "default"
    }

    if (instance.options.titlebar_cursor === undefined) {
      instance.options.titlebar_cursor = "default"
    }

    if (instance.options.window_unselectable === undefined) {
      instance.options.window_unselectable = false
    }

    if (instance.options.subsequent_show_effects === undefined) {
      instance.options.subsequent_show_effects = false
    }

    if (instance.options.replace_linebreaks === undefined) {
      instance.options.replace_linebreaks = false
    }

    if (instance.options.close_others_on_show === undefined) {
      instance.options.close_others_on_show = false
    }

    if (instance.options.scroll_on_show === undefined) {
      instance.options.scroll_on_show = true
    }

    if (instance.options.locked_element === undefined) {
      instance.options.locked_element = "body"
    }

    if (instance.options.disable_transformations === undefined) {
      instance.options.disable_transformations = false
    }

    if (instance.options.disable_content_padding === undefined) {
      instance.options.disable_content_padding = false
    }

    if (instance.options.full_content === undefined) {
      instance.options.full_content = false
    }
  }

  instance.check_options()

  instance.created = function () {
    if (instance.container === undefined) {
      return false
    }

    return true
  }

  instance.close = function (callback = false) {
    clearTimeout(instance.close_delay_timeout)

    if (instance.options.close_delay > 0) {
      instance.close_delay_timeout = setTimeout(function () {
        instance.do_close(callback)
      }, instance.options.close_delay)

      return
    }

    instance.do_close(callback)
  }

  instance.do_close = function (callback = false) {
    if (instance.closing) {
      return
    }

    if (!instance.is_open()) {
      return
    }

    if (!instance.close_enabled) {
      return
    }

    if (!instance.options.closeable) {
      return
    }

    if (instance.options.before_close(instance) === false) {
      return
    }

    instance.closing = true

    instance.clear_while_open_interval()

    instance.clear_effect_intervals()

    if (instance.options.close_effect === "fade") {
      if (typeof instance.options.close_effect_duration === "object") {
        instance.fade_out(function () {
          instance.overlay_fade_out(function () {
            instance.close_window(callback)
          })
        })
      } else {
        if (instance.overlay !== undefined) {
          instance.fade_out()

          instance.overlay_fade_out(function () {
            instance.close_window(callback)
          })
        } else {
          instance.overlay_fade_out()

          instance.fade_out(function () {
            instance.close_window(callback)
          })
        }
      }
    } else if (instance.options.close_effect === "scale") {
      if (typeof instance.options.close_effect_duration === "object") {
        instance.scale_out(function () {
          instance.overlay_fade_out(function () {
            instance.close_window(callback)
          })
        })
      } else {
        if (instance.overlay !== undefined) {
          instance.scale_out()

          instance.overlay_fade_out(function () {
            instance.close_window(callback)
          })
        } else {
          instance.overlay_fade_out()

          instance.scale_out(function () {
            instance.close_window(callback)
          })
        }
      }
    } else if (instance.options.close_effect.includes("slide")) {
      if (typeof instance.options.close_effect_duration === "object") {
        instance.slide_out(function () {
          instance.overlay_fade_out(function () {
            instance.close_window(callback)
          })
        })
      } else {
        if (instance.overlay !== undefined) {
          instance.slide_out()

          instance.overlay_fade_out(function () {
            instance.close_window(callback)
          })
        } else {
          instance.overlay_fade_out()

          instance.slide_out(function () {
            instance.close_window(callback)
          })
        }
      }
    } else {
      instance.close_window(callback)
    }
  }

  instance.close_window = function (callback) {
    instance.container.style.display = "none"

    if (instance.overlay !== undefined) {
      instance.overlay.style.zIndex = -1000
    }

    instance.collapse_vStack()
    instance.collapse_hStack()

    instance.window.style.zIndex = -1000

    instance.clear_autoclose_progressbar_interval()

    instance.clear_effect_intervals()

    instance.check_remove_overflow_hidden()

    if (!instance.options.persistent) {
      instance.destroy()
    }

    instance.options.after_close(instance)

    instance.closing = false

    if (instance.num_open() === 0) {
      instance.options.after_last_closed(instance)
    }

    if (instance.options.remove_after_close) {
      instance.remove()
    }

    if (callback) {
      return callback(instance)
    }
  }

  instance.set = function (html) {
    if (html === undefined) {
      return
    }

    instance.create()

    if (instance.options.before_set(instance) === false) {
      return
    }

    if (typeof html === "object") {
      if (html instanceof Element) {
        instance.content.innerHTML = ""
        instance.content.appendChild(html)
      }
    } else {
      html = html.toString()

      if (instance.options.replace_linebreaks) {
        html = html.replace(/(\n)/g, "<br>")
      }

      instance.content.innerHTML = html
    }

    instance.fix_stacks()

    instance.options.after_set(instance)
  }

  instance.set_title = function (html) {
    if (html === undefined) {
      return
    }

    instance.create()

    if (instance.titlebar === undefined) {
      return
    }

    if (instance.options.before_set_title(instance) === false) {
      return
    }

    if (typeof html === "object") {
      if (html instanceof Element) {
        instance.titlebar.innerHTML = ""
        instance.titlebar.appendChild(html)
      }
    } else {
      html = html.toString()

      if (instance.options.replace_linebreaks) {
        html = html.replace(/(\n)/g, "<br>")
      }

      instance.titlebar.innerHTML = html
    }

    instance.fix_stacks()

    instance.options.after_set_title(instance)
  }

  instance.hide_titlebar = function () {
    if (!instance.topbar) {
      return
    }

    instance.topbar.style.display = "none"
  }

  instance.show_titlebar = function () {
    if (!instance.topbar) {
      return
    }

    instance.topbar.style.display = "flex"
  }

  instance.set_or_show = function (html, callback = false) {
    if (instance.is_highest()) {
      instance.set(html)

      if (callback) {
        return callback()
      }
    } else {
      instance.show(html, callback)
    }
  }

  instance.show = function (content, callback = false) {
    clearTimeout(instance.show_delay_timeout)

    if (instance.options.show_delay > 0) {
      instance.show_delay_timeout = setTimeout(function () {
        instance.do_show(content, callback)
      }, instance.options.show_delay)

      return
    }

    instance.do_show(content, callback)
  }

  instance.do_show = function (content, callback = false) {
    if (instance.options.close_on_show && instance.is_open()) {
      instance.content_for_close_on_show = content
      instance.callback_for_close_on_show = callback

      if (!instance.closing) {
        instance.close(function () {
          instance.show(
            instance.content_for_close_on_show,
            instance.callback_for_close_on_show
          )
        })
      }

      return
    }

    instance.content_for_close_on_show = undefined
    instance.callback_for_close_on_show = undefined

    let title
    let html

    if (typeof content === "function") {
      callback = content
    } else if (typeof content === "object" && !(content instanceof Element)) {
      title = content[0]
      html = content[1]
    } else {
      html = content
    }

    instance.create()

    if (instance.options.before_show(instance) === false) {
      return
    }

    if (html !== undefined) {
      instance.set(html)
    }

    if (title !== undefined) {
      instance.set_title(title)
    }

    instance.reset_timers()

    instance.closing = false

    let return_callback = true
    let first_show = false

    if (!instance.is_open()) {
      first_show = true

      if (instance.options.close_others_on_show) {
        instance.close_all()
      }

      instance.container.style.display = "block"

      instance.check_add_overflow_hidden()

      instance.set_default_positions()

      instance.reset_props()

      if (instance.options.sideStack === "vertical") {
        instance.check_vStack()
      } else if (instance.options.sideStack === "horizontal") {
        instance.check_hStack()
      }

      if (instance.options.while_open !== undefined) {
        instance.start_while_open_interval()
      }
    }

    if (first_show || instance.options.subsequent_show_effects) {
      instance.clear_effect_intervals()

      if (instance.options.show_effect === "fade") {
        return_callback = false

        if (typeof instance.options.show_effect_duration === "object") {
          instance.overlay_fade_in(function () {
            instance.fade_in(function () {
              if (callback) {
                return callback(instance)
              }
            })
          })
        } else {
          instance.overlay_fade_in()

          instance.fade_in(function () {
            if (callback) {
              return callback(instance)
            }
          })
        }
      } else if (instance.options.show_effect === "scale") {
        return_callback = false

        if (typeof instance.options.show_effect_duration === "object") {
          instance.overlay_fade_in(function () {
            instance.scale_in(function () {
              if (callback) {
                return callback(instance)
              }
            })
          })
        } else {
          instance.overlay_fade_in()

          instance.scale_in(function () {
            if (callback) {
              return callback(instance)
            }
          })
        }
      } else if (instance.options.show_effect.includes("slide")) {
        return_callback = false

        if (typeof instance.options.show_effect_duration === "object") {
          instance.overlay_fade_in(function () {
            instance.slide_in(function () {
              if (callback) {
                return callback(instance)
              }
            })
          })
        } else {
          instance.overlay_fade_in()

          instance.slide_in(function () {
            if (callback) {
              return callback(instance)
            }
          })
        }
      }
    }

    instance.to_top()

    if (instance.options.scroll_on_show) {
      instance.content_container.scrollTop = 0
    }

    if (instance.options.temp_disable_close) {
      instance.close_enabled = false
      instance.temp_disable_close_timer()
    }

    if (instance.options.temp_disable_click) {
      instance.click_enabled = false
      instance.temp_disable_click_timer()
    }

    if (instance.options.temp_disable_keys) {
      instance.keys_enabled = false
      instance.temp_disable_keys_timer()
    }

    if (instance.options.autoclose) {
      instance.autoclose_timer()

      if (
        instance.options.enable_progressbar &&
        instance.options.bind_progressbar_to_autoclose
      ) {
        instance.animate_autoclose_progressbar()
      }
    }

    instance.options.after_show(instance)

    if (callback && return_callback) {
      return callback(instance)
    }
  }

  instance.toggle = function () {
    instance.create()

    if (instance.options.before_toggle(instance) === false) {
      return
    }

    instance.is_open() ? instance.close() : instance.show()

    instance.options.after_toggle(instance)
  }

  instance.create = function () {
    if (instance.created()) {
      return
    }

    if (
      document.getElementById(`Msg-container-${instance.options.id}`) !== null
    ) {
      throw "Msg Error:The html elements for this id have already been created. Use a different id."
    }

    if (instance.options.before_create(instance) === false) {
      return
    }

    let styles = {}

    styles.container = `
		display:none;
		`

    styles.overlay = `
		position:fixed;
		opacity:1;
		top:0;
		left:0;
		height:100%;
		width:100%;
		z-index:-1000;
    user-select: none;
		`

    styles.overlay_x = `
		cursor:pointer;
		float:${instance.options.overlay_x};
		font-size:28px;
		font-family:sans-serif;
		-webkit-touch-callout:none;
		-webkit-user-select:none;
		-khtml-user-select:none;
		-moz-user-select:none;
		-ms-user-select:none;
		user-select:none;
		padding-left:0.6em;
		padding-right:0.6em;
		padding-top:0.035em;
		padding-bottom:0.2em;
		`

    let p = instance.options.position
    let edge_x = instance.options.edge_padding_x
    let edge_y = instance.options.edge_padding_y
    let win_x, win_y, win_trans

    if (instance.options.disable_transformations) {
      win_x = "left:0;"
      win_y = "top:0;"
      win_trans = "transform:initial;"

      instance.vStackable = false
      instance.hStackable = false
    } else if (p === "top") {
      win_x = "left:50%;"
      win_y = `top:${edge_y}px;`
      win_trans = "transform:translateX(-50%);"

      instance.vStackable = true
      instance.hStackable = false
    } else if (p === "bottom") {
      win_x = "left:50%;"
      win_y = `bottom:${edge_y}px;`
      win_trans = "transform:translateX(-50%);"

      instance.vStackable = true
      instance.hStackable = false
    } else if (p === "left") {
      win_x = `left:${edge_x}px;`
      win_y = "top:50%;"
      win_trans = "transform:translateY(-50%);"

      instance.vStackable = false
      instance.hStackable = true
    } else if (p === "right") {
      win_x = `right:${edge_x}px;`
      win_y = "top:50%;"
      win_trans = "transform:translateY(-50%);"

      instance.vStackable = false
      instance.hStackable = true
    } else if (p === "topleft") {
      win_x = `left:${edge_x}px;`
      win_y = `top:${edge_y}px;`
      win_trans = ""

      instance.vStackable = true
      instance.hStackable = true
    } else if (p === "topright") {
      win_x = `right:${edge_x}px;`
      win_y = `top:${edge_y}px;`
      win_trans = ""

      instance.vStackable = true
      instance.hStackable = true
    } else if (p === "bottomleft") {
      win_x = `left:${edge_x}px;`
      win_y = `bottom:${edge_y}px;`
      win_trans = ""

      instance.vStackable = true
      instance.hStackable = true
    } else if (p === "bottomright") {
      win_x = `right:${edge_x}px;`
      win_y = `bottom:${edge_y}px;`
      win_trans = ""

      instance.vStackable = true
      instance.hStackable = true
    } else {
      win_x = "left:50%;"
      win_y = "top:50%;"
      win_trans = "transform:translate(-50%, -50%);"

      instance.vStackable = false
      instance.hStackable = false
    }

    let wun

    if (instance.options.window_unselectable) {
      wun =
        "-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;"
    } else {
      wun = ""
    }

    styles.window = `
		display:flex;
		flex-direction:column;
		opacity:1;
		${win_x}
		${win_y}
		position:fixed;
		width:${instance.options.window_width};
		height:${instance.options.window_height};
		min-width:${instance.options.window_min_width};
		min-height:${instance.options.window_min_height};
		max-width:${instance.options.window_max_width};
		max-height:${instance.options.window_max_height};
		${win_trans}
		outline:0;
		${wun}
		cursor:${instance.options.window_cursor};
		z-index:-1000;
		`

    styles.topbar = `
		overflow:hidden;
		flex-shrink:0;
		display:flex;
		flex-direction:row;
		`
    let padl = "padding-left:0.4em;"
    let padr = "padding-right:0.4em;"
    let justcnt = ""

    if (instance.options.center_titlebar) {
      justcnt = "justify-content:center"
    }

    if (
      instance.options.center_titlebar &&
      instance.options.window_x === "inner_right"
    ) {
      padl = "padding-left:50.78px;"
      padr = "padding-right:10.78px;"
    }

    if (
      instance.options.center_titlebar &&
      instance.options.window_x === "inner_left"
    ) {
      padl = "padding-left:10.78px;"
      padr = "padding-right:50.78px;"
    }

    styles.titlebar = `
    display: flex;
    align-items: center;
    ${justcnt};
		overflow:hidden;
		order:2;
		flex-grow:1;
		${padl}
		${padr}
		min-height:27px;
		font-size:16px;
		font-family:sans-serif;
    font-weight:bold;
    white-space: nowrap;
    cursor:${instance.options.titlebar_cursor};
		`

    let ix_order, ix_margin

    if (instance.options.window_x.includes("left")) {
      ix_order = "1"
      ix_margin = ""
    } else {
      ix_order = "3"
      ix_margin = "auto"
    }

    styles.window_inner_x = `
		cursor:pointer;
		margin-left:${ix_margin};
		font-size:24px;
		font-family:sans-serif;
		-webkit-touch-callout:none;
		-webkit-user-select:none;
		-khtml-user-select:none;
		-moz-user-select:none;
		-ms-user-select:none;
		user-select:none;
		overflow:hidden;
		order:${ix_order};
		padding-left:0.6em;
		padding-right:0.6em;
		padding-top:0.035em;
		padding-bottom:0.2em;
		`

    let fs, fms

    if (instance.options.window_x.includes("left")) {
      fs = "left:0px;"
      fms = "margin-left:-10px;"
    } else {
      fs = "right:0px;"
      fms = "margin-right:-10px;"
    }

    styles.window_floating_x = `
		cursor:pointer;
		position:absolute;
		top:0px;
		${fs}
		margin-top:-10px;
		${fms}
		font-size:16px;
		font-family:sans-serif;
		height:22px;
		width:22px;
		-webkit-touch-callout:none;
		-webkit-user-select:none;
		-khtml-user-select:none;
		-moz-user-select:none;
		-ms-user-select:none;
		user-select:none;
		overflow:hidden;
		z-index:9999999999999999;
    display:block;
    box-sizing:border-box;
    border-width:3px;
    border-style:solid;
    border-color:#2B2D30;
    border-radius:100%;
    background:linear-gradient(-45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%), linear-gradient(45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%);
    background-color:#2B2D30;
    box-shadow:0px 0px 5px 2px rgba(0,0,0,0.5);
    transition:all 0.3s ease;
		`

    let overflow_y = "auto"

    if (instance.options.preset === "window") {
      overflow_y = "hidden"
    }

    styles.content_container = `
		overflow-y:${overflow_y};
		overflow-x:hidden;
		border:none;
		outline:0;
		margin:0;
		flex-grow:1;
		`

    let pad

    if (instance.options.disable_content_padding) {
      pad = "padding:0;"
    } else {
      pad = "padding:1.2rem;"
    }

    let cwid, chgt

    if (instance.options.full_content) {
      cwid = "width:100%;"
      chgt = "height:100%;"
    } else {
      cwid = ""
      chgt = ""
    }

    styles.content = `
		font-size:16px;
		text-align:center;
		overflow-wrap:break-word;
    ${pad}
		${cwid}
		${chgt}
		`

    styles.progressbar_container = `
		height:11px;
		width:100%;
		`

    styles.progressbar = `
		height:100%;
		width:0%;
		`

    let container_class =
      instance.options.container_class !== undefined
        ? instance.options.container_class
        : instance.options.class
    let overlay_class =
      instance.options.overlay_class !== undefined
        ? instance.options.overlay_class
        : instance.options.class
    let overlay_x_class =
      instance.options.overlay_x_class !== undefined
        ? instance.options.overlay_x_class
        : instance.options.class
    let window_class =
      instance.options.window_class !== undefined
        ? instance.options.window_class
        : instance.options.class
    let topbar_class =
      instance.options.topbar_class !== undefined
        ? instance.options.topbar_class
        : instance.options.class
    let titlebar_class =
      instance.options.titlebar_class !== undefined
        ? instance.options.titlebar_class
        : instance.options.class
    let window_inner_x_class =
      instance.options.window_inner_x_class !== undefined
        ? instance.options.window_inner_x_class
        : instance.options.class
    let window_floating_x_class =
      instance.options.window_floating_x_class !== undefined
        ? instance.options.window_floating_x_class
        : instance.options.class
    let content_container_class =
      instance.options.content_container_class !== undefined
        ? instance.options.content_container_class
        : instance.options.class
    let content_class =
      instance.options.content_class !== undefined
        ? instance.options.content_class
        : instance.options.class
    let progressbar_container_class =
      instance.options.progressbar_container_class !== undefined
        ? instance.options.progressbar_container_class
        : instance.options.class
    let progressbar_class =
      instance.options.progressbar_class !== undefined
        ? instance.options.progressbar_class
        : instance.options.class

    container_class = container_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-container-${w}`))
      .join(" ")
    overlay_class = overlay_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-overlay-${w}`))
      .join(" ")
    overlay_x_class = overlay_x_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-overlay-x-${w}`))
      .join(" ")
    window_class = window_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-window-${w}`))
      .join(" ")
    topbar_class = topbar_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-topbar-${w}`))
      .join(" ")
    titlebar_class = titlebar_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-titlebar-${w}`))
      .join(" ")
    window_inner_x_class = window_inner_x_class
      .split(/\s+/)
      .map((w) =>
        w.startsWith("!") ? w.substring(1) : `Msg-window-inner-x-${w}`
      )
      .join(" ")
    window_floating_x_class = window_floating_x_class
      .split(/\s+/)
      .map((w) =>
        w.startsWith("!") ? w.substring(1) : `Msg-window-floating-x-${w}`
      )
      .join(" ")
    content_container_class = content_container_class
      .split(/\s+/)
      .map((w) =>
        w.startsWith("!") ? w.substring(1) : `Msg-content-container-${w}`
      )
      .join(" ")
    content_class = content_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-content-${w}`))
      .join(" ")
    progressbar_container_class = progressbar_container_class
      .split(/\s+/)
      .map((w) =>
        w.startsWith("!") ? w.substring(1) : `Msg-progressbar-container-${w}`
      )
      .join(" ")
    progressbar_class = progressbar_class
      .split(/\s+/)
      .map((w) => (w.startsWith("!") ? w.substring(1) : `Msg-progressbar-${w}`))
      .join(" ")

    let container_html = `<div class="Msg-container ${container_class}" style="${styles.container}" id="Msg-container-${instance.options.id}"></div>`
    let overlay_html = `<div class="Msg-overlay ${overlay_class}" style="${styles.overlay}" id="Msg-overlay-${instance.options.id}"></div>`
    let overlay_x_html = `<div class="Msg-overlay-x ${overlay_x_class}" style="${styles.overlay_x}" id="Msg-overlay-x-${instance.options.id}">x</div>`
    let window_html = `<div class="Msg-window ${window_class}" style="${styles.window}" id="Msg-window-${instance.options.id}"></div>`
    let topbar_html = `<div class="Msg-topbar ${topbar_class}" style="${styles.topbar}" id="Msg-topbar-${instance.options.id}"></div>`
    let titlebar_html = `<div class="Msg-titlebar ${titlebar_class}" style="${styles.titlebar}" id="Msg-titlebar-${instance.options.id}"></div>`
    let window_inner_x_html = `<div class="Msg-window-inner-x ${window_inner_x_class}" style="${styles.window_inner_x}" id="Msg-window-inner-x-${instance.options.id}">x</div>`
    let window_floating_x_html = `<div class="Msg-window-floating-x ${window_floating_x_class}" style="${styles.window_floating_x}" id="Msg-window-floating-x-${instance.options.id}"></div>`
    let content_container_html = `<div class="Msg-content-container ${content_container_class}" style="${styles.content_container}" id="Msg-content-container-${instance.options.id}"></div>`
    let content_html = `<div class="Msg-content ${content_class}" style="${styles.content}" id="Msg-content-${instance.options.id}"></div>`
    let progressbar_container_html = `<div class="Msg-progressbar-container ${progressbar_container_class}" style="${styles.progressbar_container}" id="Msg-progressbar-container-${instance.options.id}"></div>`
    let progressbar_html = `<div class="Msg-progressbar ${progressbar_class}" style="${styles.progressbar}" id="Msg-progressbar-${instance.options.id}"></div>`

    document.body.insertAdjacentHTML("beforeend", container_html)

    instance.container = document.getElementById(
      `Msg-container-${instance.options.id}`
    )

    if (instance.options.enable_overlay) {
      instance.container.insertAdjacentHTML("beforeend", overlay_html)
      instance.overlay = document.getElementById(
        `Msg-overlay-${instance.options.id}`
      )

      if (instance.options.overlay_x !== "none") {
        instance.overlay.insertAdjacentHTML("beforeend", overlay_x_html)
        instance.overlay_x = document.getElementById(
          `Msg-overlay-x-${instance.options.id}`
        )
      }
    }

    instance.container.insertAdjacentHTML("beforeend", window_html)
    instance.window = document.getElementById(
      `Msg-window-${instance.options.id}`
    )

    if (
      instance.options.enable_titlebar ||
      instance.options.window_x.includes("inner")
    ) {
      instance.window.insertAdjacentHTML("beforeend", topbar_html)
      instance.topbar = document.getElementById(
        `Msg-topbar-${instance.options.id}`
      )

      if (instance.options.enable_titlebar) {
        instance.topbar.insertAdjacentHTML("beforeend", titlebar_html)
        instance.titlebar = document.getElementById(
          `Msg-titlebar-${instance.options.id}`
        )
      }

      if (instance.options.window_x.includes("inner")) {
        instance.topbar.insertAdjacentHTML("beforeend", window_inner_x_html)
        instance.window_inner_x = document.getElementById(
          `Msg-window-inner-x-${instance.options.id}`
        )
      }
    }

    if (instance.options.window_x.includes("floating")) {
      instance.window.insertAdjacentHTML("afterbegin", window_floating_x_html)
      instance.window_floating_x = document.getElementById(
        `Msg-window-floating-x-${instance.options.id}`
      )
    }

    instance.window.insertAdjacentHTML("beforeend", content_container_html)
    instance.content_container = document.getElementById(
      `Msg-content-container-${instance.options.id}`
    )

    instance.content_container.insertAdjacentHTML("beforeend", content_html)
    instance.content = document.getElementById(
      `Msg-content-${instance.options.id}`
    )

    if (instance.options.enable_progressbar) {
      instance.window.insertAdjacentHTML(
        "beforeend",
        progressbar_container_html
      )
      instance.progressbar_container = document.getElementById(
        `Msg-progressbar-container-${instance.options.id}`
      )

      instance.progressbar_container.insertAdjacentHTML(
        "beforeend",
        progressbar_html
      )
      instance.progressbar = document.getElementById(
        `Msg-progressbar-${instance.options.id}`
      )
    }

    if (instance.overlay !== undefined) {
      instance.overlay.addEventListener("click", function () {
        if (instance.options.close_on_overlay_click) {
          instance.options.on_overlay_click(instance)
          instance.close()
        }
      })
    }

    if (instance.titlebar !== undefined) {
      instance.titlebar.addEventListener("click", function () {
        if (instance.options.close_on_titlebar_click) {
          instance.options.on_titlebar_click(instance)
          instance.close()
        }
      })
    }

    instance.window.addEventListener("click", function (e) {
      instance.options.on_click(instance)
    })

    instance.window.addEventListener("wheel", function (e) {
      let direction = e.deltaY > 0 ? "down" : "up"

      if (direction === "down") {
        instance.options.on_wheel_down(instance)
      } else if (direction === "up") {
        instance.options.on_wheel_up(instance)
      }
    })

    instance.window.addEventListener("auxclick", function (e) {
      if (e.which === 2) {
        instance.options.on_middle_click(instance)
      }
    })

    instance.content.addEventListener("mousedown", function (e) {
      if (!instance.click_enabled) {
        let captureClick = function (e) {
          e.stopPropagation()
          this.removeEventListener("click", captureClick, true)
        }

        instance.window.addEventListener("click", captureClick, true)
      }
    })

    if (instance.window_inner_x !== undefined) {
      instance.window_inner_x.addEventListener("click", function (e) {
        instance.options.on_x_button_click(instance)
        instance.close()
        e.stopPropagation()
      })

    }

    if (instance.window_floating_x !== undefined) {
      instance.window_floating_x.addEventListener("click", function (e) {
        instance.options.on_x_button_click(instance)
        instance.close()
        e.stopPropagation()
      })

    }

    if (instance.overlay_x !== undefined) {
      instance.overlay_x.addEventListener("click", function (e) {
        instance.options.on_x_button_click(instance)
        instance.close()
        e.stopPropagation()
      })

    }

    instance.options.after_create(instance)
  }

  instance.recreate = function () {
    instance.destroy()
    instance.create()
  }

  instance.destroy = function () {
    if (instance.created()) {
      if (instance.options.before_destroy(instance) === false) {
        return
      }

      instance.check_remove_overflow_hidden()
      instance.container.parentNode.removeChild(instance.container)

      instance.container = undefined
      instance.overlay = undefined
      instance.overlay_x = undefined
      instance.window = undefined
      instance.topbar = undefined
      instance.titlebar = undefined
      instance.window_inner_x = undefined
      instance.window_floating_x = undefined
      instance.content_container = undefined
      instance.content = undefined
      instance.progressbar_container = undefined
      instance.progressbar = undefined

      instance.options.after_destroy(instance)
    }
  }

  instance.is_open = function () {
    if (!instance.created() || instance.container.style.display === "none") {
      return false
    } else {
      return true
    }
  }

  instance.any_open = function () {
    for (let inst of Msg.instances) {
      if (inst.is_open()) {
        return true
      }
    }

    return false
  }

  instance.any_higher_open = function () {
    for (let inst of Msg.instances) {
      if (inst.options.zStack_level === 2) {
        if (inst.is_open()) {
          return true
        }
      }
    }

    return false
  }

  instance.any_lower_open = function () {
    for (let inst of Msg.instances) {
      if (inst.options.zStack_level === 1) {
        if (inst.is_open()) {
          return true
        }
      }
    }

    return false
  }

  instance.num_open = function () {
    let num_open = 0

    for (let inst of Msg.instances) {
      if (inst.is_open()) {
        num_open += 1
      }
    }

    return num_open
  }

  instance.num_open_higher = function () {
    let num_open = 0

    for (let inst of Msg.instances) {
      if (inst.is_open()) {
        if (inst.options.zStack_level === 2) {
          num_open += 1
        }
      }
    }

    return num_open
  }

  instance.num_open_lower = function () {
    let num_open = 0

    for (let inst of Msg.instances) {
      if (inst.is_open()) {
        if (inst.options.zStack_level === 1) {
          num_open += 1
        }
      }
    }

    return num_open
  }

  instance.show_all = function () {
    for (let i = 0; i < Msg.instances.length; i++) {
      Msg.instances[i].show()
    }
  }

  instance.close_all = function (callback = false) {
    if (!instance.any_open()) {
      if (callback) {
        return callback()
      } else {
        return false
      }
    }

    for (let i = 0; i < Msg.instances.length; i++) {
      if (callback) {
        Msg.instances[i].close(function () {
          if (!instance.any_open()) {
            return callback()
          }
        })
      } else {
        Msg.instances[i].close()
      }
    }
  }

  instance.close_all_higher = function (callback = false) {
    if (!instance.any_higher_open()) {
      if (callback) {
        return callback()
      } else {
        return false
      }
    }

    for (let higher of instance.higher_instances()) {
      if (callback) {
        higher.close(function () {
          if (!instance.any_higher_open()) {
            return callback()
          }
        })
      } else {
        higher.close()
      }
    }
  }

  instance.close_all_lower = function (callback = false) {
    if (!instance.any_lower_open()) {
      if (callback) {
        return callback()
      } else {
        return false
      }
    }

    for (let lower of instance.lower_instances()) {
      if (callback) {
        lower.close(function () {
          if (!instance.any_lower_open()) {
            return callback()
          }
        })
      } else {
        lower.close()
      }
    }
  }

  instance.create_all = function () {
    for (let i = 0; i < Msg.instances.length; i++) {
      Msg.instances[i].create()
    }
  }

  instance.recreate_all = function () {
    for (let i = 0; i < Msg.instances.length; i++) {
      Msg.instances[i].recreate()
    }
  }

  instance.destroy_all = function () {
    for (let i = 0; i < Msg.instances.length; i++) {
      Msg.instances[i].destroy()
    }
  }

  instance.common_zIndex = function (zIndex) {
    zIndex = parseInt(zIndex)

    let common

    if (zIndex > 0) {
      common = parseInt(zIndex.toString().substring(1))
    } else {
      common = -2000
    }

    return common
  }

  instance.highest_zIndex = function () {
    let highest = -2000

    let windows = Array.from(document.querySelectorAll(".Msg-window"))

    for (let i = 0; i < windows.length; i++) {
      let zIndex = parseInt(windows[i].style.zIndex)

      if (zIndex > highest) {
        highest = zIndex
      }
    }

    return parseInt(highest)
  }

  instance.highest_instance = function () {
    let zIndex = instance.highest_zIndex()

    if (zIndex < 0) {
      return false
    }

    for (let i of Msg.instances) {
      if (i.window !== undefined) {
        if (parseInt(i.window.style.zIndex) === zIndex) {
          return i
        }
      }
    }

    return false
  }

  instance.highest_common_zIndex = function () {
    let highest = -2000

    let windows = Array.from(document.querySelectorAll(".Msg-window"))

    for (let i = 0; i < windows.length; i++) {
      let zIndex = instance.common_zIndex(windows[i].style.zIndex)

      if (zIndex > highest) {
        highest = zIndex
      }
    }

    return highest
  }

  instance.is_highest = function () {
    if (instance.is_open()) {
      let zIndex = instance.highest_zIndex()

      if (parseInt(instance.window.style.zIndex) === zIndex) {
        return true
      }
    }

    return false
  }

  instance.html = function () {
    if (instance.created()) {
      return instance.content.innerHTML
    }

    return ""
  }

  instance.title_html = function () {
    if (instance.titlebar !== undefined) {
      return instance.titlebar.innerHTML
    }

    return ""
  }

  instance.check_add_overflow_hidden = function () {
    if (instance.options.lock) {
      document
        .querySelector(instance.options.locked_element)
        .classList.add("Msg-overflow-hidden")
    }
  }

  instance.check_remove_overflow_hidden = function () {
    for (let i of Msg.instances) {
      if (i.is_open()) {
        if (i.options.lock) {
          return
        }
      }
    }

    document
      .querySelector(instance.options.locked_element)
      .classList.remove("Msg-overflow-hidden")
  }

  instance.to_top = function () {
    if (instance.is_open()) {
      let zIndex = parseInt(instance.window.style.zIndex)

      let highest_common = instance.highest_common_zIndex()

      let highest

      if (instance.options.zStack_level === 1) {
        highest = Math.max(5000000, 5000000 + highest_common)
      } else {
        highest = Math.max(50000000, 50000000 + highest_common)
      }

      if (highest > zIndex) {
        if (instance.overlay !== undefined) {
          instance.overlay.style.zIndex = highest + 1
        }

        instance.window.style.zIndex = highest + 2
      }
    }
  }

  instance.instances = function () {
    return Msg.instances
  }

  instance.higher_instances = function () {
    let instances = []

    for (let inst of Msg.instances) {
      if (inst.options.zStack_level === 2) {
        instances.push(inst)
      }
    }

    return instances
  }

  instance.lower_instances = function () {
    let instances = []

    for (let inst of Msg.instances) {
      if (inst.options.zStack_level === 1) {
        instances.push(inst)
      }
    }

    return instances
  }

  instance.get_instance_by_id = function (id) {
    for (let i of Msg.instances) {
      if (i.options.id == id) {
        return i
      }
    }
  }

  instance.temp_disable_close_timer = function () {
    instance.temp_disable_close_timeout = setTimeout(function () {
      instance.close_enabled = true
    }, instance.options.temp_disable_close_delay)
  }

  instance.temp_disable_click_timer = function () {
    instance.temp_disable_click_timeout = setTimeout(function () {
      instance.click_enabled = true
    }, instance.options.temp_disable_click_delay)
  }

  instance.temp_disable_keys_timer = function () {
    instance.temp_disable_keys_timeout = setTimeout(function () {
      instance.keys_enabled = true
    }, instance.options.temp_disable_keys_delay)
  }

  instance.autoclose_timer = function () {
    instance.autoclose_timeout = setTimeout(function () {
      instance.close()
    }, instance.options.autoclose_delay)
  }

  instance.reset_timers = function () {
    clearTimeout(instance.temp_disable_close_timeout)
    clearTimeout(instance.temp_disable_click_timeout)
    clearTimeout(instance.temp_disable_keys_timeout)
    clearTimeout(instance.autoclose_timeout)

    instance.close_enabled = true
    instance.click_enabled = true
    instance.keys_enabled = true
  }

  instance.clear_autoclose_progressbar_interval = function () {
    clearInterval(instance.progressbar_animation)
  }

  instance.animate_autoclose_progressbar = function () {
    instance.clear_autoclose_progressbar_interval()

    if (instance.options.reverse_autoclose_progressbar) {
      let percentage = 0

      instance.progressbar.style.width = "0%"

      instance.progressbar_animation = setInterval(function () {
        if (!instance.created()) {
          clearInterval(instance.progressbar_animation)
        }

        percentage += 1

        instance.set_progress(percentage)

        if (percentage >= 100) {
          clearInterval(instance.progressbar_animation)
        }
      }, instance.options.autoclose_delay / 100)
    } else {
      let percentage = 100

      instance.progressbar.style.width = "100%"

      instance.progressbar_animation = setInterval(function () {
        if (!instance.created()) {
          clearInterval(instance.progressbar_animation)
        }

        percentage -= 1

        instance.set_progress(percentage)

        if (percentage <= 0) {
          clearInterval(instance.progressbar_animation)
        }
      }, instance.options.autoclose_delay / 100)
    }
  }

  instance.set_progress = function (percentage) {
    if (percentage === undefined) {
      return
    }

    instance.create()

    if (instance.progressbar === undefined) {
      return
    }

    if (instance.options.before_set_progress(instance) === false) {
      return
    }

    if (percentage > 100) {
      percentage = 100
    }

    if (percentage < 0) {
      percentage = 0
    }

    instance.progressbar.style.width = `${percentage}%`

    instance.options.after_set_progress(instance)
  }

  instance.get_progress = function () {
    if (instance.progressbar === undefined) {
      return
    }

    return Math.round(
      (instance.progressbar.offsetWidth / instance.window.offsetWidth) * 100
    )
  }

  instance.clear_effect_intervals = function () {
    clearInterval(instance.overlay_fade_in_interval)
    clearInterval(instance.overlay_fade_out_interval)
    clearInterval(instance.fade_in_interval)
    clearInterval(instance.fade_out_interval)
    clearInterval(instance.scale_in_interval)
    clearInterval(instance.scale_out_interval)
    clearInterval(instance.slide_in_interval)
    clearInterval(instance.slide_out_interval)

    instance.slide_in_ongoing = false
    instance.slide_in_direction = undefined
  }

  instance.reset_props = function () {
    if (instance.overlay !== undefined) {
      instance.overlay.style.opacity = 1
    }

    instance.window.style.opacity = 1
    instance.window.style.zoom = 1
  }

  instance.resolve_effect_duration = function (n, duration) {
    if (typeof duration === "object") {
      return duration[n]
    } else {
      return duration
    }
  }

  instance.overlay_fade_in = function (callback) {
    let speed =
      instance.resolve_effect_duration(
        0,
        instance.options.show_effect_duration
      ) / 20

    if (instance.overlay === undefined || speed === 0) {
      if (instance.overlay !== undefined) {
        instance.overlay.style.opacity = 1
      }

      if (callback) {
        return callback()
      }

      return
    }

    instance.overlay.style.opacity = 0
    instance.window.style.opacity = 0

    let opacity = 0

    instance.overlay_fade_in_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      opacity += 0.05

      instance.overlay.style.opacity = opacity

      if (opacity >= 1) {
        clearInterval(instance.overlay_fade_in_interval)

        if (callback) {
          return callback()
        }
      }
    }, speed)
  }

  instance.overlay_fade_out = function (callback) {
    let speed =
      instance.resolve_effect_duration(
        1,
        instance.options.close_effect_duration
      ) / 20

    if (
      instance.overlay === undefined ||
      speed === 0 ||
      instance.overlay.style.opacity == 0
    ) {
      if (instance.overlay !== undefined) {
        instance.overlay.style.opacity = 0
      }

      if (callback) {
        return callback()
      }

      return
    }

    let opacity = Number(instance.overlay.style.opacity)

    instance.overlay_fade_out_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      opacity -= 0.05

      instance.overlay.style.opacity = opacity

      if (opacity <= 0) {
        clearInterval(instance.overlay_fade_out_interval)

        if (callback) {
          return callback()
        }
      }
    }, speed)
  }

  instance.fade_in = function (callback) {
    let speed =
      instance.resolve_effect_duration(
        1,
        instance.options.show_effect_duration
      ) / 20

    if (speed === 0) {
      instance.window.style.opacity = 1

      if (callback) {
        return callback()
      }

      return
    }

    instance.window.style.opacity = 0

    let opacity = 0

    instance.fade_in_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      opacity += 0.05

      instance.window.style.opacity = opacity

      if (opacity >= 1) {
        clearInterval(instance.fade_in_interval)

        if (callback) {
          return callback()
        }
      }
    }, speed)
  }

  instance.fade_out = function (callback) {
    let speed =
      instance.resolve_effect_duration(
        0,
        instance.options.close_effect_duration
      ) / 20

    if (speed === 0 || instance.window.style.opacity == 0) {
      instance.window.style.opacity = 0

      if (callback) {
        return callback()
      }

      return
    }

    let opacity = Number(instance.window.style.opacity)

    instance.fade_out_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      opacity -= 0.05

      instance.window.style.opacity = opacity

      if (opacity <= 0) {
        clearInterval(instance.fade_out_interval)

        if (callback) {
          return callback()
        }
      }
    }, speed)
  }

  instance.scale_in = function (callback) {
    let speed =
      instance.resolve_effect_duration(
        1,
        instance.options.show_effect_duration
      ) / 25

    if (speed === 0) {
      instance.window.style.opacity = 1

      if (callback) {
        return callback()
      }

      return
    }

    let scale = 0.5

    let transform = instance.window.style.transform

    let split = transform.split(")")

    let new_transform = ""

    for (let s of split) {
      s = s.trim()

      if (s !== "" && !s.includes("scale")) {
        new_transform += `${s}) `
      }
    }

    new_transform = new_transform.trim()

    instance.window.style.transform = new_transform + ` scale(${scale})`

    instance.window.style.opacity = 0

    let winopacity = 0

    instance.scale_in_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      scale += 0.02

      instance.window.style.transform = new_transform + ` scale(${scale})`

      winopacity += 0.04

      instance.window.style.opacity = winopacity

      if (scale >= 1) {
        clearInterval(instance.scale_in_interval)

        if (callback) {
          return callback()
        }
      }
    }, speed)
  }

  instance.scale_out = function (callback) {
    let speed =
      instance.resolve_effect_duration(
        0,
        instance.options.close_effect_duration
      ) / 25

    if (speed === 0 || instance.window.style.opacity == 0) {
      instance.window.style.opacity = 0

      if (callback) {
        return callback()
      }

      return
    }

    let scale = 1

    let transform = instance.window.style.transform

    let split = transform.split(")")

    let new_transform = ""

    for (let s of split) {
      s = s.trim()

      if (s !== "" && !s.includes("scale")) {
        new_transform += `${s}) `
      }
    }

    let winopacity = Number(instance.window.style.opacity)

    new_transform = new_transform.trim()

    instance.window.style.transform = new_transform + ` scale(${scale})`

    instance.scale_out_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      scale -= 0.02

      instance.window.style.transform = new_transform + ` scale(${scale})`

      winopacity -= 0.04

      instance.window.style.opacity = winopacity

      if (scale <= 0.5) {
        clearInterval(instance.scale_out_interval)

        if (callback) {
          return callback()
        }
      }
    }, speed)
  }

  instance.slide_in = function (callback) {
    let speed = instance.resolve_effect_duration(
      1,
      instance.options.show_effect_duration
    )

    instance.window.style.opacity = 1

    if (speed === 0) {
      if (callback) {
        return callback()
      }

      return
    }

    let direction = instance.options.show_effect.split("_")[1]

    instance.slide_in_ongoing = true
    instance.slide_direction = direction

    let p = instance.options.position

    let pos = false
    let spos = false
    let diff = false

    if (p === "bottom") {
      if (direction === "up") {
        pos = "bottom"
        spos = `stack_pos_${pos}`
        instance.window.style.bottom = 0 - instance.window.offsetHeight + "px"
        diff = ((instance.window.offsetHeight + instance[spos]) / speed) * 10
      } else if (direction === "down") {
        pos = "bottom"
        spos = `stack_pos_${pos}`
        instance.window.style.bottom = window.innerHeight + "px"
        diff =
          ((parseInt(instance.window.style.bottom) - instance[spos]) / speed) *
          10
      }
    } else if (p === "top") {
      if (direction === "up") {
        pos = "top"
        spos = `stack_pos_${pos}`
        instance.window.style.top = window.innerHeight + "px"
        diff =
          ((parseInt(instance.window.style.top) - instance[spos]) / speed) * 10
      } else if (direction === "down") {
        pos = "top"
        spos = `stack_pos_${pos}`
        instance.window.style.top = 0 - instance.window.offsetHeight + "px"
        diff = ((instance.window.offsetHeight + instance[spos]) / speed) * 10
      }
    } else if (p.includes("right")) {
      if (direction === "up" || direction === "down") {
        if (p === "topright") {
          if (direction === "up") {
            pos = "top"
            spos = `stack_pos_${pos}`
            instance.window.style.top = window.innerHeight + "px"
            diff =
              ((parseInt(instance.window.style.top) - instance[spos]) / speed) *
              10
          } else if (direction === "down") {
            pos = "top"
            spos = `stack_pos_${pos}`
            instance.window.style.top = 0 - instance.window.offsetHeight + "px"
            diff =
              ((instance.window.offsetHeight + instance[spos]) / speed) * 10
          }
        } else if (p === "bottomright") {
          if (direction === "up") {
            pos = "bottom"
            spos = `stack_pos_${pos}`
            instance.window.style.bottom =
              0 - instance.window.offsetHeight + "px"
            diff =
              ((instance.window.offsetHeight + instance[spos]) / speed) * 10
          } else if (direction === "down") {
            pos = "bottom"
            spos = `stack_pos_${pos}`
            instance.window.style.bottom = window.innerHeight + "px"
            diff =
              ((parseInt(instance.window.style.bottom) - instance[spos]) /
                speed) *
              10
          }
        }
      }

      if (direction === "left") {
        pos = "right"
        spos = `stack_pos_${pos}`
        instance.window.style.right = 0 - instance.window.offsetWidth + "px"
        diff = ((instance.window.offsetWidth + instance[spos]) / speed) * 10
      } else if (direction === "right") {
        pos = "right"
        spos = `stack_pos_${pos}`
        instance.window.style.right = window.innerWidth + "px"
        diff =
          ((parseInt(instance.window.style.right) - instance[spos]) / speed) *
          10
      }
    } else if (p.includes("left")) {
      if (direction === "up" || direction === "down") {
        if (p === "topleft") {
          if (direction === "up") {
            pos = "top"
            spos = `stack_pos_${pos}`
            instance.window.style.top = window.innerHeight + "px"
            diff =
              ((parseInt(instance.window.style.top) - instance[spos]) / speed) *
              10
          } else if (direction === "down") {
            pos = "top"
            spos = `stack_pos_${pos}`
            instance.window.style.top = 0 - instance.window.offsetHeight + "px"
            diff =
              ((instance.window.offsetHeight + instance[spos]) / speed) * 10
          }
        } else if (p === "bottomleft") {
          if (direction === "up") {
            pos = "bottom"
            spos = `stack_pos_${pos}`
            instance.window.style.bottom =
              0 - instance.window.offsetHeight + "px"
            diff =
              ((instance.window.offsetHeight + instance[spos]) / speed) * 10
          } else if (direction === "down") {
            pos = "bottom"
            spos = `stack_pos_${pos}`
            instance.window.style.bottom = window.innerHeight + "px"
            diff =
              ((parseInt(instance.window.style.bottom) - instance[spos]) /
                speed) *
              10
          }
        }
      } else if (direction === "left") {
        pos = "left"
        spos = `stack_pos_${pos}`
        instance.window.style.left = window.innerWidth + "px"
        diff =
          ((parseInt(instance.window.style.left) - instance[spos]) / speed) * 10
      } else if (direction === "right") {
        pos = "left"
        spos = `stack_pos_${pos}`
        instance.window.style.left = 0 - instance.window.offsetWidth + "px"
        diff = ((instance.window.offsetWidth + instance[spos]) / speed) * 10
      }
    }

    if (!pos) {
      finish()
      return
    }

    diff = Math.max(1, diff)

    function finish () {
      clearInterval(instance.slide_in_interval)

      instance.slide_in_ongoing = false
      instance.slide_in_direction = undefined

      instance.window.style[pos] = instance[spos] + "px"

      if (callback) {
        return callback()
      }
    }

    instance.slide_in_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      if (pos === "top") {
        if (direction === "up") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= instance[spos]) {
            finish()
          }
        }

        if (direction === "down") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= instance[spos]) {
            finish()
          }
        }
      }

      if (pos === "bottom") {
        if (direction === "up") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= instance[spos]) {
            finish()
          }
        }

        if (direction === "down") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= instance[spos]) {
            finish()
          }
        }
      }

      if (pos === "left") {
        if (direction === "left") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= instance[spos]) {
            finish()
          }
        }

        if (direction === "right") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= instance[spos]) {
            finish()
          }
        }
      }

      if (pos === "right") {
        if (direction === "left") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= instance[spos]) {
            finish()
          }
        }

        if (direction === "right") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= instance[spos]) {
            finish()
          }
        }
      }
    }, 10)
  }

  instance.slide_out = function (callback) {
    let speed = instance.resolve_effect_duration(
      0,
      instance.options.close_effect_duration
    )

    if (speed === 0 || instance.window.style.opacity == 0) {
      instance.window.style.opacity = 0

      if (callback) {
        return callback()
      }

      return
    }

    let direction = instance.options.close_effect.split("_")[1]

    let p = instance.options.position

    let pos = false
    let og = false
    let diff = false
    let npos = false

    if (p === "bottom") {
      if (direction === "up") {
        diff =
          ((window.innerHeight - parseInt(instance.window.style.bottom)) /
            speed) *
          10
        npos = window.innerHeight + instance.window.offsetHeight
        pos = "bottom"
      } else if (direction === "down") {
        diff =
          ((parseInt(instance.window.style.bottom) +
            instance.window.offsetHeight) /
            speed) *
          10
        npos = 0 - instance.window.offsetHeight
        pos = "bottom"
      }
    } else if (p === "top") {
      if (direction === "up") {
        diff =
          ((parseInt(instance.window.style.top) +
            instance.window.offsetHeight) /
            speed) *
          10
        npos = 0 - instance.window.offsetHeight
        pos = "top"
      } else if (direction === "down") {
        diff =
          ((window.innerHeight - parseInt(instance.window.style.top)) / speed) *
          10
        npos = window.innerHeight + instance.window.offsetHeight
        pos = "top"
      }
    } else if (p.includes("right")) {
      if (direction === "up" || direction === "down") {
        if (p === "topright") {
          if (direction === "up") {
            diff =
              ((parseInt(instance.window.style.top) +
                instance.window.offsetHeight) /
                speed) *
              10
            npos = 0 - instance.window.offsetHeight
            pos = "top"
          } else if (direction === "down") {
            diff =
              ((window.innerHeight - parseInt(instance.window.style.top)) /
                speed) *
              10
            npos = window.innerHeight + instance.window.offsetHeight
            pos = "top"
          }
        } else if (p === "bottomright") {
          if (direction === "up") {
            diff =
              ((window.innerHeight - parseInt(instance.window.style.bottom)) /
                speed) *
              10
            npos = window.innerHeight + instance.window.offsetHeight
            pos = "bottom"
          } else if (direction === "down") {
            diff =
              ((parseInt(instance.window.style.bottom) +
                instance.window.offsetHeight) /
                speed) *
              10
            npos = 0 - instance.window.offsetHeight
            pos = "bottom"
          }
        }
      }

      if (direction === "left") {
        diff =
          ((window.innerWidth - parseInt(instance.window.style.right)) /
            speed) *
          10
        npos = window.innerWidth + instance.window.offsetWidth
        pos = "right"
      } else if (direction === "right") {
        diff =
          ((parseInt(instance.window.style.right) +
            instance.window.offsetWidth) /
            speed) *
          10
        npos = 0 - instance.window.offsetWidth
        pos = "right"
      }
    } else if (p.includes("left")) {
      if (direction === "up" || direction === "down") {
        if (p === "topleft") {
          if (direction === "up") {
            diff =
              ((parseInt(instance.window.style.top) +
                instance.window.offsetHeight) /
                speed) *
              10
            npos = 0 - instance.window.offsetHeight
            pos = "top"
          } else if (direction === "down") {
            diff =
              ((window.innerHeight - parseInt(instance.window.style.top)) /
                speed) *
              10
            npos = window.innerHeight + instance.window.offsetHeight
            pos = "top"
          }
        } else if (p === "bottomleft") {
          if (direction === "up") {
            diff =
              ((window.innerHeight - parseInt(instance.window.style.bottom)) /
                speed) *
              10
            npos = window.innerHeight + instance.window.offsetHeight
            pos = "bottom"
          } else if (direction === "down") {
            diff =
              ((parseInt(instance.window.style.bottom) +
                instance.window.offsetHeight) /
                speed) *
              10
            npos = 0 - instance.window.offsetHeight
            pos = "bottom"
          }
        }
      } else if (direction === "left") {
        diff =
          ((parseInt(instance.window.style.left) +
            instance.window.offsetWidth) /
            speed) *
          10
        npos = 0 - instance.window.offsetWidth
        pos = "left"
      } else if (direction === "right") {
        diff =
          ((window.innerWidth - parseInt(instance.window.style.left)) / speed) *
          10
        npos = window.innerWidth + instance.window.offsetWidth
        pos = "left"
      }
    }

    if (!pos) {
      finish()
      return
    }

    diff = Math.max(1, diff)

    function finish () {
      clearInterval(instance.slide_out_interval)

      instance.window.style[pos] = npos - 20 + "px"

      if (callback) {
        return callback()
      }
    }

    instance.slide_out_interval = setInterval(function () {
      if (!instance.created()) {
        instance.clear_effect_intervals()
        return
      }

      if (pos === "top") {
        if (direction === "up") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= npos) {
            finish()
          }
        }

        if (direction === "down") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= npos) {
            finish()
          }
        }
      }

      if (pos === "bottom") {
        if (direction === "up") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= npos) {
            finish()
          }
        }

        if (direction === "down") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= npos) {
            finish()
          }
        }
      }

      if (pos === "left") {
        if (direction === "left") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= npos) {
            finish()
          }
        }

        if (direction === "right") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= npos) {
            finish()
          }
        }
      }

      if (pos === "right") {
        if (direction === "left") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) + diff + "px"

          if (parseInt(instance.window.style[pos]) >= npos) {
            finish()
          }
        }

        if (direction === "right") {
          instance.window.style[pos] =
            parseInt(instance.window.style[pos]) - diff + "px"

          if (parseInt(instance.window.style[pos]) <= npos) {
            finish()
          }
        }
      }
    }, 10)
  }

  instance.start_while_open_interval = function () {
    instance.clear_while_open_interval()

    instance.while_open_interval = setInterval(function () {
      instance.options.while_open(instance)
    }, instance.options.while_open_interval)
  }

  instance.clear_while_open_interval = function () {
    clearInterval(instance.while_open_interval)
  }

  instance.stack_pos_top_sort = function (a, b) {
    return a.stack_pos_top - b.stack_pos_top
  }

  instance.stack_pos_top_sort2 = function (a, b) {
    return b.stack_pos_top - a.stack_pos_top
  }

  instance.stack_pos_bottom_sort = function (a, b) {
    return a.stack_pos_bottom - b.stack_pos_bottom
  }

  instance.stack_pos_bottom_sort2 = function (a, b) {
    return b.stack_pos_bottom - a.stack_pos_bottom
  }

  instance.stack_pos_left_sort = function (a, b) {
    return a.stack_pos_left - b.stack_pos_left
  }

  instance.stack_pos_left_sort2 = function (a, b) {
    return b.stack_pos_left - a.stack_pos_left
  }

  instance.stack_pos_right_sort = function (a, b) {
    return a.stack_pos_right - b.stack_pos_right
  }

  instance.stack_pos_right_sort2 = function (a, b) {
    return b.stack_pos_right - a.stack_pos_right
  }

  instance.highest_in_position = function (mode) {
    let highest = -2000
    let highest_ins

    let p = instance.options.position

    for (let i of Msg.instances) {
      if (i.is_open()) {
        if (i.options.position === p) {
          let pos

          if (mode === "vertical") {
            if (p.includes("top")) {
              pos = i.stack_pos_top
            } else if (p.includes("bottom")) {
              pos = i.stack_pos_bottom
            }
          } else if (mode === "horizontal") {
            if (p.includes("left")) {
              pos = i.stack_pos_left
            } else if (p.includes("right")) {
              pos = i.stack_pos_right
            }
          }

          if (pos !== undefined) {
            if (pos > highest) {
              highest = pos
              highest_ins = i
            }
          }
        }
      }
    }

    return highest_ins
  }

  instance.lowest_in_position = function (mode) {
    let lowest = 200000000
    let lowest_ins

    let p = instance.options.position

    for (let i of Msg.instances) {
      if (i.is_open()) {
        if (i.options.position === p) {
          let pos

          if (mode === "vertical") {
            if (p.includes("top")) {
              pos = i.stack_pos_top
            } else if (p.includes("bottom")) {
              pos = i.stack_pos_bottom
            }
          } else if (mode === "horizontal") {
            if (p.includes("left")) {
              pos = i.stack_pos_left
            } else if (p.includes("right")) {
              pos = i.stack_pos_right
            }
          }

          if (pos !== undefined) {
            if (pos < lowest) {
              lowest = pos
              lowest_ins = i
            }
          }
        }
      }
    }

    return lowest_ins
  }

  instance.above_in_position = function (ins, mode) {
    let ins_above = []

    let p = ins.options.position

    for (let i of Msg.instances) {
      if (i.is_open()) {
        if (i.options.position === p) {
          if (mode === "vertical") {
            if (p.includes("top")) {
              if (i.stack_pos_top > ins.stack_pos_top) {
                ins_above.push(i)
              }
            } else if (p.includes("bottom")) {
              if (i.stack_pos_bottom > ins.stack_pos_bottom) {
                ins_above.push(i)
              }
            }
          } else if (mode === "horizontal") {
            if (p.includes("left")) {
              if (i.stack_pos_left > ins.stack_pos_left) {
                ins_above.push(i)
              }
            } else if (p.includes("right")) {
              if (i.stack_pos_right > ins.stack_pos_right) {
                ins_above.push(i)
              }
            }
          }
        }
      }
    }

    if (mode === "vertical") {
      if (p.includes("top")) {
        ins_above.sort(instance.stack_pos_top_sort)
      } else if (p.includes("bottom")) {
        ins_above.sort(instance.stack_pos_bottom_sort)
      }
    } else if (mode === "horizontal") {
      if (p.includes("left")) {
        ins_above.sort(instance.stack_pos_left_sort)
      } else if (p.includes("right")) {
        ins_above.sort(instance.stack_pos_right_sort)
      }
    }

    return ins_above
  }

  instance.nextbelow_in_position = function (ins, mode) {
    let ins_below = []

    let p = ins.options.position

    for (let i of Msg.instances) {
      if (i.is_open()) {
        let ip = i.options.position

        if (ip === p) {
          if (mode === "vertical") {
            let sp

            if (ip.includes("left")) {
              sp = i.stack_pos_left
            } else if (ip.includes("right")) {
              sp = i.stack_pos_right
            }

            if (sp !== undefined) {
              if (
                sp > i.options.edge_padding_x + 2 ||
                sp < i.options.edge_padding_x - 2
              ) {
                continue
              }
            }

            if (p.includes("top")) {
              if (i.stack_pos_top < ins.stack_pos_top) {
                ins_below.push(i)
              }
            } else if (p.includes("bottom")) {
              if (i.stack_pos_bottom < ins.stack_pos_bottom) {
                ins_below.push(i)
              }
            }
          } else if (mode === "horizontal") {
            if (p.includes("left")) {
              if (i.stack_pos_left < ins.stack_pos_left) {
                ins_below.push(i)
              }
            } else if (p.includes("right")) {
              if (i.stack_pos_right < ins.stack_pos_right) {
                ins_below.push(i)
              }
            }
          }
        }
      }
    }

    if (mode === "vertical") {
      if (p.includes("top")) {
        ins_below.sort(instance.stack_pos_top_sort2)
      } else if (p.includes("bottom")) {
        ins_below.sort(instance.stack_pos_bottom_sort2)
      }
    } else if (mode === "horizontal") {
      if (p.includes("left")) {
        ins_below.sort(instance.stack_pos_left_sort2)
      } else if (p.includes("right")) {
        ins_below.sort(instance.stack_pos_right_sort2)
      }
    }

    return ins_below[0]
  }

  instance.check_vStack = function () {
    if (instance.vStackable) {
      let p = instance.options.position

      if (p.includes("top")) {
        instance.stack_pos_top = -1000000
      } else if (p.includes("bottom")) {
        instance.stack_pos_bottom = -1000000
      }

      let highest = instance.highest_in_position("vertical")

      let new_top, new_bottom

      if (highest !== undefined && highest !== instance) {
        if (p.includes("top")) {
          new_top =
            highest.stack_pos_top +
            highest.stack_height +
            instance.options.sideStack_padding

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "up" &&
              instance.slide_direction !== "down")
          ) {
            instance.window.style.top = new_top + "px"
          }
        } else if (p.includes("bottom")) {
          new_bottom =
            highest.stack_pos_bottom +
            highest.stack_height +
            instance.options.sideStack_padding

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "up" &&
              instance.slide_direction !== "down")
          ) {
            instance.window.style.bottom = new_bottom + "px"
          }
        }
      } else {
        if (p.includes("top")) {
          new_top = instance.options.edge_padding_y

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "up" &&
              instance.slide_direction !== "down")
          ) {
            instance.window.style.top = new_top + "px"
          }
        } else if (p.includes("bottom")) {
          new_bottom = instance.options.edge_padding_y

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "up" &&
              instance.slide_direction !== "down")
          ) {
            instance.window.style.bottom = new_bottom + "px"
          }
        }
      }

      if (p.includes("top")) {
        instance.stack_pos_top = new_top
      } else if (p.includes("bottom")) {
        instance.stack_pos_bottom = new_bottom
      }
    }
  }

  instance.collapse_vStack = function () {
    let p = instance.options.position

    let ins_above = instance.above_in_position(instance, "vertical")

    for (let i of ins_above) {
      if (
        !i.options.sideStack_collapse ||
        i.options.sideStack !== "vertical" ||
        i.closing
      ) {
        continue
      }

      let below = instance.nextbelow_in_position(i, "vertical")

      let new_top, new_bottom

      if (below !== undefined) {
        if (p.includes("top")) {
          new_top =
            below.stack_pos_top +
            below.window.offsetHeight +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "up" && i.slide_direction !== "down")
          ) {
            i.window.style.top = new_top + "px"
          }
        } else if (p.includes("bottom")) {
          new_bottom =
            below.stack_pos_bottom +
            below.window.offsetHeight +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "up" && i.slide_direction !== "down")
          ) {
            i.window.style.bottom = new_bottom + "px"
          }
        }
      } else {
        if (p.includes("top")) {
          new_top = i.options.edge_padding_y

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "up" && i.slide_direction !== "down")
          ) {
            i.window.style.top = new_top + "px"
          }
        } else if (p.includes("bottom")) {
          new_bottom = i.options.edge_padding_y

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "up" && i.slide_direction !== "down")
          ) {
            i.window.style.bottom = new_bottom + "px"
          }
        }
      }

      if (p.includes("top")) {
        i.stack_pos_top = new_top
      } else if (p.includes("bottom")) {
        i.stack_pos_bottom = new_bottom
      }
    }
  }

  instance.fix_vStack = function () {
    let p = instance.options.position

    let below = instance.lowest_in_position("vertical")

    let new_top, new_bottom

    if (below !== undefined) {
      let above = instance.above_in_position(below, "vertical")

      for (let i of above) {
        if (p.includes("top")) {
          new_top =
            below.stack_pos_top +
            below.window.offsetHeight +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "up" && i.slide_direction !== "down")
          ) {
            i.window.style.top = new_top + "px"
          }

          i.stack_pos_top = new_top
        } else if (p.includes("bottom")) {
          new_bottom =
            below.stack_pos_bottom +
            below.window.offsetHeight +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "up" && i.slide_direction !== "down")
          ) {
            i.window.style.bottom = new_bottom + "px"
          }

          i.stack_pos_bottom = new_bottom
        }

        below = i
      }
    }
  }

  instance.check_hStack = function () {
    if (instance.hStackable) {
      let p = instance.options.position

      if (p.includes("left")) {
        instance.stack_pos_left = -1000000
      } else if (p.includes("right")) {
        instance.stack_pos_right = -1000000
      }

      let highest = instance.highest_in_position("horizontal")

      let new_left, new_right

      if (highest !== undefined && highest !== instance) {
        if (p.includes("left")) {
          new_left =
            highest.stack_pos_left +
            highest.stack_width +
            instance.options.sideStack_padding

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "left" &&
              instance.slide_direction !== "right")
          ) {
            instance.window.style.left = new_left + "px"
          }
        } else if (p.includes("right")) {
          new_right =
            highest.stack_pos_right +
            highest.stack_width +
            instance.options.sideStack_padding

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "left" &&
              instance.slide_direction !== "right")
          ) {
            instance.window.style.right = new_right + "px"
          }
        }
      } else {
        if (p.includes("left")) {
          new_left = instance.options.edge_padding_x

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "left" &&
              instance.slide_direction !== "right")
          ) {
            instance.window.style.left = new_left + "px"
          }
        } else if (p.includes("right")) {
          new_right = instance.options.edge_padding_x

          if (
            !instance.slide_in_ongoing ||
            (instance.slide_direction !== "left" &&
              instance.slide_direction !== "right")
          ) {
            instance.window.style.right = new_right + "px"
          }
        }
      }

      if (p.includes("left")) {
        instance.stack_pos_left = new_left
      } else if (p.includes("right")) {
        instance.stack_pos_right = new_right
      }
    }
  }

  instance.collapse_hStack = function () {
    let p = instance.options.position

    let ins_above = instance.above_in_position(instance, "horizontal")

    for (let i of ins_above) {
      if (
        !i.options.sideStack_collapse ||
        i.options.sideStack !== "horizontal" ||
        i.closing
      ) {
        continue
      }

      let below = instance.nextbelow_in_position(i, "horizontal")

      let new_left, new_right

      if (below !== undefined) {
        if (p.includes("left")) {
          new_left =
            below.stack_pos_left +
            below.window.offsetWidth +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "left" && i.slide_direction !== "right")
          ) {
            i.window.style.left = new_left + "px"
          }
        } else if (p.includes("right")) {
          new_right =
            below.stack_pos_right +
            below.window.offsetWidth +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "left" && i.slide_direction !== "right")
          ) {
            i.window.style.right = new_right + "px"
          }
        }
      } else {
        if (p.includes("left")) {
          new_left = i.options.edge_padding_x

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "left" && i.slide_direction !== "right")
          ) {
            i.window.style.left = new_left + "px"
          }
        } else if (p.includes("right")) {
          new_right = i.options.edge_padding_x

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "left" && i.slide_direction !== "right")
          ) {
            i.window.style.right = new_right + "px"
          }
        }
      }

      if (p.includes("left")) {
        i.stack_pos_left = new_left
      } else if (p.includes("right")) {
        i.stack_pos_right = new_right
      }
    }
  }

  instance.fix_hStack = function () {
    let p = instance.options.position

    let below = instance.lowest_in_position("horizontal")

    if (below !== undefined) {
      let above = instance.above_in_position(below, "horizontal")

      let new_left, new_right

      for (let i of above) {
        if (p.includes("left")) {
          new_left =
            below.stack_pos_left +
            below.window.offsetWidth +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "left" && i.slide_direction !== "right")
          ) {
            i.window.style.left = new_left + "px"
          }

          i.stack_pos_left = new_left
        } else if (p.includes("right")) {
          new_right =
            below.stack_pos_right +
            below.window.offsetWidth +
            i.options.sideStack_padding

          if (
            !i.slide_in_ongoing ||
            (i.slide_direction !== "left" && i.slide_direction !== "right")
          ) {
            i.window.style.right = new_right + "px"
          }

          i.stack_pos_right = new_right
        }

        below = i
      }
    }
  }

  instance.fix_stacks = function () {
    if (instance.is_open()) {
      instance.fix_vStack()
      instance.fix_hStack()
    }
  }

  instance.set_default_positions = function () {
    let p = instance.options.position
    let edge_x = instance.options.edge_padding_x
    let edge_y = instance.options.edge_padding_y

    if (p === "top") {
      instance.stack_pos_top = edge_y
      instance.stack_pos_bottom = undefined
      instance.stack_pos_left = undefined
      instance.stack_pos_right = undefined
    } else if (p === "bottom") {
      instance.stack_pos_top = undefined
      instance.stack_pos_bottom = edge_y
      instance.stack_pos_left = undefined
      instance.stack_pos_right = undefined
    } else if (p === "left") {
      instance.stack_pos_top = undefined
      instance.stack_pos_bottom = undefined
      instance.stack_pos_left = edge_x
      instance.stack_pos_right = undefined
    } else if (p === "right") {
      instance.stack_pos_top = undefined
      instance.stack_pos_bottom = undefined
      instance.stack_pos_left = undefined
      instance.stack_pos_right = edge_x
    } else if (p === "topleft") {
      instance.stack_pos_top = edge_y
      instance.stack_pos_bottom = undefined
      instance.stack_pos_left = edge_x
      instance.stack_pos_right = undefined
    } else if (p === "topright") {
      instance.stack_pos_top = edge_y
      instance.stack_pos_bottom = undefined
      instance.stack_pos_left = undefined
      instance.stack_pos_right = edge_x
    } else if (p === "bottomleft") {
      instance.stack_pos_top = undefined
      instance.stack_pos_bottom = edge_y
      instance.stack_pos_left = edge_x
      instance.stack_pos_right = undefined
    } else if (p === "bottomright") {
      instance.stack_pos_top = undefined
      instance.stack_pos_bottom = edge_y
      instance.stack_pos_left = undefined
      instance.stack_pos_right = edge_x
    } else {
      instance.stack_pos_top = undefined
      instance.stack_pos_bottom = undefined
      instance.stack_pos_left = undefined
      instance.stack_pos_right = undefined
    }

    instance.stack_width = instance.window.offsetWidth
    instance.stack_height = instance.window.offsetHeight
  }

  instance.change_class = function (new_class) {
    if (
      instance.container !== undefined &&
      instance.container.classList.contains(
        `Msg-container-${instance.options.class}`
      )
    ) {
      instance.container.classList.remove(
        `Msg-container-${instance.options.class}`
      )
      instance.container.classList.add(`Msg-container-${new_class}`)
    }

    if (
      instance.overlay !== undefined &&
      instance.overlay.classList.contains(
        `Msg-overlay-${instance.options.class}`
      )
    ) {
      instance.overlay.classList.remove(`Msg-overlay-${instance.options.class}`)
      instance.overlay.classList.add(`Msg-overlay-${new_class}`)
    }

    if (
      instance.overlay_x !== undefined &&
      instance.overlay_x.classList.contains(
        `Msg-overlay-x-${instance.options.class}`
      )
    ) {
      instance.overlay_x.classList.remove(
        `Msg-overlay-x-${instance.options.class}`
      )
      instance.overlay_x.classList.add(`Msg-overlay-x-${new_class}`)
    }

    if (
      instance.window !== undefined &&
      instance.window.classList.contains(`Msg-window-${instance.options.class}`)
    ) {
      instance.window.classList.remove(`Msg-window-${instance.options.class}`)
      instance.window.classList.add(`Msg-window-${new_class}`)
    }

    if (
      instance.topbar !== undefined &&
      instance.topbar.classList.contains(`Msg-topbar-${instance.options.class}`)
    ) {
      instance.topbar.classList.remove(`Msg-topbar-${instance.options.class}`)
      instance.topbar.classList.add(`Msg-topbar-${new_class}`)
    }

    if (
      instance.titlebar !== undefined &&
      instance.titlebar.classList.contains(
        `Msg-titlebar-${instance.options.class}`
      )
    ) {
      instance.titlebar.classList.remove(
        `Msg-titlebar-${instance.options.class}`
      )
      instance.titlebar.classList.add(`Msg-titlebar-${new_class}`)
    }

    if (
      instance.window_inner_x !== undefined &&
      instance.window_inner_x.classList.contains(
        `Msg-window-inner-x-${instance.options.class}`
      )
    ) {
      instance.window_inner_x.classList.remove(
        `Msg-window-inner-x-${instance.options.class}`
      )
      instance.window_inner_x.classList.add(`Msg-window-inner-x-${new_class}`)
    }

    if (
      instance.window_floating_x !== undefined &&
      instance.window_floating_x.classList.contains(
        `Msg-window-floating-x-${instance.options.class}`
      )
    ) {
      instance.window_floating_x.classList.remove(
        `Msg-window-floating-x-${instance.options.class}`
      )
      instance.window_floating_x.classList.add(
        `Msg-window-floating-x-${new_class}`
      )
    }

    if (
      instance.content_container !== undefined &&
      instance.content_container.classList.contains(
        `Msg-content-container-${instance.options.class}`
      )
    ) {
      instance.content_container.classList.remove(
        `Msg-content-container-${instance.options.class}`
      )
      instance.content_container.classList.add(
        `Msg-content-container-${new_class}`
      )
    }

    if (
      instance.content !== undefined &&
      instance.content.classList.contains(
        `Msg-content-${instance.options.class}`
      )
    ) {
      instance.content.classList.remove(`Msg-content-${instance.options.class}`)
      instance.content.classList.add(`Msg-content-${new_class}`)
    }

    if (
      instance.progressbar_container !== undefined &&
      instance.progressbar_container.classList.contains(
        `Msg-progressbar-container-${instance.options.class}`
      )
    ) {
      instance.progressbar_container.classList.remove(
        `Msg-progressbar-container-${instance.options.class}`
      )
      instance.progressbar_container.classList.add(
        `Msg-progressbar-container-${new_class}`
      )
    }

    if (
      instance.progressbar !== undefined &&
      instance.progressbar.classList.contains(
        `Msg-progressbar-${instance.options.class}`
      )
    ) {
      instance.progressbar.classList.remove(
        `Msg-progressbar-${instance.options.class}`
      )
      instance.progressbar.classList.add(`Msg-progressbar-${new_class}`)
    }

    instance.options.class = new_class
  }

  instance.remove = function () {
    instance.destroy()

    for (let i = 0; i < Msg.instances.length; i++) {
      if (Msg.instances[i].options.id === instance.options.id) {
        Msg.instances.splice(i, 1)
        break
      }
    }
  }

  instance.is_textbox = function (element) {
    let tag_name = element.tagName.toLowerCase()

    if (tag_name === "textarea") return true
    if (tag_name !== "input") return false

    let type = element.getAttribute("type")

    if (!type) {
      return false
    }

    let input_types = [
      "text",
      "password",
      "number",
      "email",
      "tel",
      "url",
      "search",
      "date",
      "datetime",
      "datetime-local",
      "time",
      "month",
      "week",
    ]

    return input_types.includes(type.toLowerCase())
  }

  if (
    Msg.msg === undefined &&
    instance.options.id !== "__internal_instance__"
  ) {
    Msg.msg = Msg.factory({ id: "__internal_instance__" })

    let style = document.createElement("style")

    let css = `
		.Msg-overflow-hidden{overflow:hidden}

		.Msg-overlay{background-color:rgba(0, 0, 0, 0.7)}
		.Msg-window{background-color:white;color:#222222}
		.Msg-titlebar{background-color:#c8c8c8;color:#222222}
		.Msg-progressbar{background-color:#c8c8c8}
		.Msg-window-inner-x:hover{background-color:#cacaca}
		.Msg-window-floating-x{background-color:#3a3a3a;color:white}
		.Msg-window-floating-x:hover{background-color:#2a2a2a}
		.Msg-overlay-x{color:white}
		.Msg-overlay-x:hover{background-color:#686868}

		.Msg-overlay-blue{background-color:rgba(101, 107, 124, 0.7)}
		.Msg-window-blue{background-color:#4f84b8;color:white}
		.Msg-titlebar-blue{background-color:#43729f;color:white}
		.Msg-progressbar-blue{background-color:#43729f}
		.Msg-window-inner-x-blue:hover{background-color:#476b8f}
		.Msg-overlay-x-blue{color:white}
		.Msg-overlay-x-blue:hover{background-color:#747484}

		.Msg-overlay-red{background-color:rgba(104, 64, 64, 0.7)}
		.Msg-window-red{background-color:#ca4e4e;color:white}
		.Msg-titlebar-red{background-color:#af3f3f;color:white}
		.Msg-progressbar-red{background-color:#af3f3f}
		.Msg-window-inner-x-red:hover{background-color:#9d4d4d}
		.Msg-overlay-x-red{color:white}
		.Msg-overlay-x-red:hover{background-color:#805e5e}

		.Msg-overlay-green{background-color:rgba(121, 159, 133, 0.7)}
		.Msg-window-green{background-color:#58a564;color:white}
		.Msg-titlebar-green{background-color:#52935c;color:white}
		.Msg-progressbar-green{background-color:#52935c}
		.Msg-window-inner-x-green:hover{background-color:#4e8456}
		.Msg-overlay-x-green{color:white}
		.Msg-overlay-x-green:hover{background-color:#7c957c}

		.Msg-overlay-black{background-color:rgba(121, 121, 121, 0.7)}
		.Msg-window-black{background-color:#1D1F21;color:white}
		.Msg-titlebar-black{background-color:#3c3c3c;color:white}
		.Msg-progressbar-black{background-color:#3c3c3c}
		.Msg-window-inner-x-black:hover{background-color:#424242}
		.Msg-overlay-x-black{color:white}
		.Msg-overlay-x-black:hover{background-color:#686868}

		.Msg-content-snackbar{padding:1.2em !important}
		`

    style.innerHTML = css

    document.head.appendChild(style)

    document.addEventListener("keydown", function (e) {
      let highest = Msg.msg.highest_instance()

      if (!highest) return

      if (!highest.keys_enabled) {
        let captureKey = function (e) {
          e.stopPropagation()
          this.removeEventListener("keyup", captureKey, true)
        }

        document.addEventListener("keyup", captureKey, true)
      }

      if (e.key === "Escape") {
        let highest = Msg.msg.highest_instance()

        if (!highest) return

        if (highest.options.clear_editables) {
          let el = document.activeElement

          if (highest.is_textbox(el)) {
            if (!el.readOnly && !el.disabled) {
              if (el.value.trim() !== "") {
                let split = el.value.trimEnd().split(" ")
                let new_value = split.slice(0, -1).join(" ") + " "

                if (new_value.trim() === "") {
                  new_value = ""
                }

                el.value = new_value

                let event = new Event("input", {
                  bubbles: true,
                  cancelable: true,
                })

                el.dispatchEvent(event)

                return
              }
            }
          }
        }

        if (highest.options.close_on_escape) {
          highest.close()
        }
      }
    })
  }

  if (instance.options.id !== "__internal_instance__") {
    Msg.instances.push(instance)
    Msg.num_created += 1
  }

  return instance
}

Msg.instances = []

try {
  module.exports = Msg
} catch (e) {}