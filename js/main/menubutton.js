App.create_menubutton = (args = {}) => {
  let def_args = {
    wrap: true,
  }

  args = Object.assign(def_args, args)

  if (!args.button) {
    args.button = DOM.create(`div`, `settings_menu button`, args.id)
  }

  args.container = DOM.create(`div`, `flex_row_center gap_1`)
  let prev = DOM.create(`div`, `button arrow_prev`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button arrow_next`)
  next.textContent = `>`

  DOM.ev(args.button, `click`, () => {
    let items = []

    for (let opt of args.opts) {
      if (opt[0] === App.separator_string) {
        items.push({separator: true})
        continue
      }

      items.push({
        icon: opt[2],
        text: opt[0],
        action: () => {
          args.text(args, opt)

          if (args.on_change) {
            args.on_change(args, opt)
          }
        },
      })
    }

    NeedContext.show_on_element(args.button, items, true, args.button.clientHeight)
  })

  args.text = (args, opt) => {
    if (opt.length === 2) {
      args.button.textContent = opt[0]
    }
    else if (opt.length === 3) {
      args.button.innerHTML = (opt[2] || ``) + opt[0]
    }
  }

  args.set = (value, on_change = true) => {
    let opt = App.menubutton_item(args, value)
    args.text(args, opt)

    if (on_change && args.on_change) {
      args.on_change(args, opt)
    }
  }

  function prev_fn () {
    App.menubutton_cycle(args, `prev`)
  }

  function next_fn () {
    App.menubutton_cycle(args, `next`)
  }

  if (args.selected) {
    for (let opt of args.opts) {
      if (args.selected === opt[1]) {
        args.button.textContent = opt[0]
        break
      }
    }
  }

  DOM.ev(prev, `click`, prev_fn)
  DOM.ev(next, `click`, next_fn)
  args.container.append(prev)
  args.container.append(next)
  args.button.after(args.container)
  prev.after(args.button)
  return args
}

App.menubutton_cycle = (args, dir) => {
  let waypoint = false
  let opts = args.opts.slice(0)

  if (dir === `prev`) {
    opts.reverse()
  }

  let opt

  if (args.wrap) {
    opt = opts[0]
  }

  for (let item of opts) {
    if (item[0] === App.separator_string) {
      continue
    }

    if (waypoint) {
      opt = item
      break
    }

    if (item[0] === args.button.textContent) {
      waypoint = true
    }
  }

  if (opt) {
    args.text(args, opt)

    if (args.on_change) {
      args.on_change(args, opt)
    }
  }
}

App.menubutton_item = (args, value) => {
  for (let opt of args.opts) {
    if (opt[1] === value) {
      return opt
    }
  }
}

App.menubutton_item_2 = (args, name) => {
  for (let opt of args.opts) {
    if (opt[0] === name) {
      return opt
    }
  }
}