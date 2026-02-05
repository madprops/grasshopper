App.start_color_picker_window = () => {
  if (App.check_ready(`color_picker`)) {
    return
  }

  App.create_window({
    id: `color_picker`,
    setup: () => {
      DOM.ev(`#color_picker_copy_rgb`, `click`, () => {
        App.copy_to_clipboard(App.colorpicker_rgb)
      })

      DOM.ev(`#color_picker_copy_hex`, `click`, () => {
        App.copy_to_clipboard(App.colorpicker_hex())
      })

      DOM.ev(`#color_picker_close`, `click`, () => {
        App.hide_window()
      })

      let el = DOM.el(`#color_picker`)

      App.colorpicker = AColorPicker.createPicker(el, {
        showAlpha: true,
        showHSL: true,
        showRGB: true,
        showHEX: true,
        color: `rgb(0, 0, 0)`,
      })

      App.colorpicker.on(`change`, (picker, color) => {
        App.colorpicker_rgb = color.toString()
      })
    },
    after_show: () => {
      //
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

App.colorpicker_hex = () => {
  return App.colorlib.rgb_to_hex(App.colorpicker_rgb)
}