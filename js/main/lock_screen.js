App.start_lock_screen = () => {
  if (App.check_ready(`lock_screen`)) {
    return
  }

  if (App.is_popup()) {
    App.open_command(`lock_screen`)
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
      let cmd = App.get_setting(`lock_screen_command`)
      App.run_command({cmd, from: `lock_screen`})
    },
    after_hide: () => {
      App.screen_locked = false
      let cmd = App.get_setting(`unlock_screen_command`)
      App.run_command({cmd, from: `lock_screen`})
    },
    colored_top: true,
  })
}

App.lock_screen = async () => {
  App.start_lock_screen()
  App.hide_window()

  let img_el = DOM.el(`#lock_screen_image`)

  if (App.get_setting(`empty_lock_screen`)) {
    DOM.hide(img_el)
  }
  else {
    let img_src = App.get_setting(`lock_screen_image`)

    if (!img_src) {
      img_src = `img/lock.jpg`
    }

    if (img_src === `uploaded`) {
      img_src = await App.get_stored_lock_screen_image()
    }

    img_el.src = img_src
    DOM.show(img_el)
  }

  let text_el = DOM.el(`#lock_screen_text`)
  let num_words = App.get_setting(`lock_screen_words`)

  if (num_words > 0) {
    let words = App.get_random_words(num_words)
    text_el.textContent = words.join(` `)
    DOM.show(text_el)
  }
  else {
    DOM.hide(text_el)
  }

  clearTimeout(App.words_auto_hide_timeout)
  let words_auto_hide = App.get_setting(`lock_screen_words_auto_hide`)

  if (words_auto_hide > 0) {
    App.words_auto_hide_timeout = setTimeout(() => {
      DOM.hide(text_el)
    }, words_auto_hide * 1000)
  }

  App.show_window(`lock_screen`)
}

App.unlock_screen = () => {
  let pw = App.get_setting(`lock_screen_password`)

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

App.upload_lock_screen_image = () => {
  App.upload_image({
    key_name: `storedLockScreenImage`,
    category: `lock`,
    filter: `lock screen image`,
    set_function: () => {
      App.set_uploaded_lock_screen_image()
    },
  })
}

App.get_stored_lock_screen_image = async () => {
  try {
    let result = await browser.storage.local.get(`storedLockScreenImage`)

    if (result.storedLockScreenImage) {
      return result.storedLockScreenImage
    }

    return null
  }
  catch (error) {
    return null
  }
}

App.set_uploaded_lock_screen_image = () => {
  App.set_setting({setting: `lock_screen_image`, value: `uploaded`})
  App.refresh_setting_widgets([`lock_screen_image`])
}