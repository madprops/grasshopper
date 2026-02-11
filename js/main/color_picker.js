App.start_color_picker_window = () => {
  if (App.check_ready(`color_picker`)) {
    return
  }

  App.create_window({
    id: `color_picker`,
    setup: () => {
      DOM.ev(`#color_picker_copy_rgb`, `click`, () => {
        App.copy_to_clipboard(App.color_picker_rgb)
      })

      DOM.ev(`#color_picker_copy_hex`, `click`, () => {
        App.copy_to_clipboard(App.color_picker_hex())
      })

      DOM.ev(`#color_picker_copy_hsl`, `click`, () => {
        App.copy_to_clipboard(App.color_picker_hsl())
      })

      DOM.ev(`#color_picker_copy_rgba`, `click`, () => {
        App.copy_to_clipboard(App.color_picker_rgba())
      })

      DOM.ev(`#color_picker_copy_hexa`, `click`, () => {
        App.copy_to_clipboard(App.color_picker_hexa())
      })

      DOM.ev(`#color_picker_copy_hsla`, `click`, () => {
        App.copy_to_clipboard(App.color_picker_hsla())
      })

      DOM.ev(`#color_picker_close`, `click`, () => {
        App.hide_window()
      })

      DOM.ev(`#color_picker_name_button`, `click`, () => {
        App.color_picker_enter()
      })

      let el = DOM.el(`#color_picker`)
      App.color_picker_rgb = `rgb(0, 0, 0)`

      App.color_picker = AColorPicker.createPicker(el, {
        showAlpha: true,
        showHSL: true,
        showRGB: true,
        showHEX: true,
        color: App.color_picker_rgb,
      })

      App.color_picker.on(`change`, (picker, color) => {
        App.color_picker_rgb = color.toString()
      })
    },
    after_show: () => {
      App.color_picker_focus_name()
    },
    after_hide: () => {
      //
    },
    colored_top: true,
  })
}

App.show_color_picker_window = () => {
  App.start_color_picker_window()
  App.show_window(`color_picker`)
}

App.color_picker_hex = () => {
  return AColorPicker.parseColor(App.color_picker_rgb, `hex`)
}

App.color_picker_hsl = () => {
  return AColorPicker.parseColor(App.color_picker_rgb, `hslcss`)
}

App.color_picker_rgba = () => {
  return AColorPicker.parseColor(App.color_picker_rgb, `rgbacss`)
}

App.color_picker_hexa = () => {
  return AColorPicker.parseColor(App.color_picker_rgb, `hexcss4`)
}

App.color_picker_hsla = () => {
  return AColorPicker.parseColor(App.color_picker_rgb, `hslacss`)
}

App.color_to_hex = (value) => {
  return AColorPicker.parseColor(value, `hex`)
}

App.color_picker_enter = () => {
  let input = DOM.el(`#color_picker_name_input`)
  let value = input.value
  let hex = App.color_to_hex(value)

  App.color_picker.setColor(hex)
  input.value = ``

  App.color_picker_focus_name()
}

App.color_picker_focus_name = () => {
  DOM.el(`#color_picker_name_input`).focus()
}