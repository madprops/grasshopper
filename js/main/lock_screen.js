App.start_lock_screen = () => {
  if (App.check_ready(`lock_screen`)) {
    return
  }

  App.create_window({
    id: `lock_screen`,
    setup: () => {
      let unlock = DOM.el(`#unlock_screen`)

      DOM.ev(unlock, `click`, () => {
        App.unlock_screen()
      })
    },
    after_show: () => {
      App.screen_locked = true
    },
    after_hide: () => {
      App.screen_locked = false
    },
    colored_top: true,
  })
}

App.lock_screen = () => {
  App.start_lock_screen()
  App.hide_window()
  let img_el = DOM.el(`#lock_screen_image`)
  let img_src = App.get_setting(`screen_lock_image`)

  if (!img_src) {
    img_src = `img/lock.jpg`
  }

  img_el.src = img_src
  App.show_window(`lock_screen`)
}

App.unlock_screen = () => {
  let pw = App.get_setting(`screen_lock_password`)

  if (pw) {
    App.show_prompt({
      password: true,
      placeholder: `Password`,
      on_submit: (ans) => {
        if (ans === pw) {
          App.hide_window()
        }
      },
    })

    return
  }

  App.hide_window()
}