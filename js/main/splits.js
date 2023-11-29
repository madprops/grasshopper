App.edit_tab_split = (args = {}) => {
  let def_args = {
    which: `top`,
    prompt_title: true,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})

  if (!active.length) {
    return
  }

  let force = App.check_force(`warn_on_edit_tabs`, active)

  if (args.which === `top` || args.which === `bottom`) {
    let other = args.which === `top` ? `bottom` : `top`

    App.show_confirm({
      message: `Add splits (${active.length})`,
      confirm_action: () => {
        for (let it of active) {
          App.apply_edit({what: `split_${args.which}`, item: it, value: true, on_change: (value) => {
            App.custom_save(it.id, `custom_split_${args.which}`, value)
          }})

          App.apply_edit({what: `split_${other}`, item: it, value: false, on_change: (value) => {
            App.custom_save(it.id, `custom_split_${other}`, value)
          }})
        }
      },
      force: force,
    })
  }
  else if (args.which === `both`) {
    if (active.length < 2) {
      App.alert(`Multiple tabs are required to do this`)
      return
    }

    for (let it of active.slice(1, -1)) {
      App.apply_edit({what: `split_top`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `custom_split_top`, value)
      }})

      App.apply_edit({what: `split_bottom`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `custom_split_bottom`, value)
      }})
    }

    let top = active.at(0)
    let bottom = active.at(-1)

    App.apply_edit({what: `split_top`, item: top, value: true, on_change: (value) => {
      App.custom_save(top.id, `custom_split_top`, value)
    }})

    App.apply_edit({what: `split_bottom`, item: bottom, value: true, on_change: (value) => {
      App.custom_save(bottom.id, `custom_split_bottom`, value)
    }})
  }
}

App.remove_item_split = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})

  if (active.length === 1) {
    if (item.rule_split_top || item.rule_split_bottom) {
      App.domain_rule_message()
    }
  }

  App.remove_edits({what: [`split_top`, `split_bottom`], items: active})
}

App.remove_all_splits = () => {
  App.remove_edits({what: [`split_top`, `split_bottom`]})
}

App.apply_splits = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  let has_split = false

  for (let what of [`top`, `bottom`]) {
    if (App.get_split(item, what)) {
      item.element.classList.add(`split_${what}`)
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