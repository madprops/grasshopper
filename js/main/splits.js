App.edit_tab_split = (args = {}) => {
  let def_args = {
    which: `top`,
    prompt_title: true,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})

  function check_title () {
    if (!args.prompt_title) {
      return
    }

    if (args.which === `bottom`) {
      return
    }

    if ((args.which === `top`) && (active.length !== 1)) {
      return
    }

    if ((active.length === 1) && (active[0].rule_split_title)) {
      return
    }

    App.edit_tab_split_title(args.item)
  }

  let force = App.check_force(`warn_on_edit_tabs`, active)

  if (args.which === `top` || args.which === `bottom`) {
    let other = args.which === `top` ? `bottom` : `top`

    App.show_confirm({
      message: `Add splits (${active.length})`,
      confirm_action: () => {
        for (let it of active) {
          if (App.apply_edit(`split_${args.which}`, it, true)) {
            App.custom_save(it.id, `custom_split_${args.which}`, true)
          }

          if (App.apply_edit(`split_${other}`, it, false)) {
            App.custom_save(it.id, `custom_split_${other}`, false)
          }

          if (App.apply_edit(`split_title`, it, false)) {
            App.custom_save(it.id, `custom_split_title`, )
          }
        }

        App.remove_split_title(active)
        check_title()
      },
      force: force,
    })
  }
  else if (args.which === `auto`) {
    if (active.length < 2) {
      App.alert_autohide(`Need at least 2 tabs`)
      return
    }

    for (let it of active.slice(1, -1)) {
      if (App.apply_edit(`split_top`, it, false)) {
        App.custom_save(it.id, `custom_split_top`, false)
      }

      if (App.apply_edit(`split_bottom`, it, false)) {
        App.custom_save(it.id, `custom_split_bottom`, false)
      }
    }

    let it = active.at(0)
    let it_2 = active.at(-1)
    let what

    if (it.custom_split_top && it_2.custom_split_bottom) {
      what = false
    }
    else {
      what = true
    }

    if (App.apply_edit(`split_top`, it, what)) {
      App.custom_save(it.id, `custom_split_top`, what)
    }

    if (App.apply_edit(`split_bottom`, it_2, what)) {
      App.custom_save(it_2.id, `custom_split_bottom`, what)
    }

    App.remove_split_title(active)

    if (what) {
      check_title()
    }
  }
}

App.edit_tab_split_title = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let value = App.get_split_title(item)

  App.show_prompt({
    value: value,
    placeholder: `Enter Title`,
    on_submit: (title) => {
      if (!title) {
        title = App.edit_default(`split_title`)
      }

      for (let it of active) {
        if (App.apply_edit(`split_title`, it, title)) {
          App.custom_save(it.id, `custom_split_title`, title)
        }
      }
    },
  })
}

App.remove_split_title = (items) => {
  let title = App.edit_default(`split_title`)

  for (let item of items) {
    if (App.apply_edit(`split_title`, item, title)) {
      App.custom_save(item.id, `custom_split_title`, title)
    }
  }
}

App.remove_item_split = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})

  if (active.length === 1) {
    if (item.rule_split_top || item.rule_split_bottom) {
      App.alert_autohide(`Some splits are set by domain rules`)
    }
  }

  App.remove_edits({what: [`split_top`, `split_bottom`, `split_title`], items: active})
}

App.remove_all_splits = () => {
  App.remove_edits({what: [`split_top`, `split_bottom`, `split_title`]})
}

App.replace_split = (item, which) => {
  App.alert_autohide(`Click on a tab`)
  App.split_pick = true
  App.split_pick_original = item
  App.split_pick_which = which
}

App.do_replace_split = (item) => {
  App.split_pick = false
  let title = App.split_pick_original.custom_split_title
  App.remove_item_split(App.split_pick_original)
  App.edit_tab_split({item: item, which: App.split_pick_which, prompt_title: false})

  if (App.apply_edit(`split_title`, item, title)) {
    App.custom_save(item.id, `custom_split_title`, title)
  }
}

App.apply_splits = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  let has_split = false

  for (let what of [`top`, `bottom`]) {
    if (App.get_split(item, what)) {
      item.element.classList.add(`split_${what}`)

      if (what === `top`) {
        item.element.dataset.split_title = App.get_split_title(item) || ``
      }

      has_split = true
    }
    else {
      item.element.classList.remove(`split_${what}`)
    }
  }

  if (has_split) {
    item.element.classList.add(`split`)
  }
  else {
    item.element.classList.remove(`split`)
  }
}