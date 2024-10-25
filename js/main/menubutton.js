const Menubutton = {}

Menubutton.create = (args = {}) => {
  let def_args = {
    wrap: true,
  }

  App.def_args(def_args, args)

  if (!args.button) {
    args.button = DOM.create(`div`, `menubutton button`, args.id)
  }

  args.container = DOM.create(`div`, `menubutton_container`)
  args.button.draggable = true

  args.button.ondragstart = (e) => {
    e.dataTransfer.setData(`text/plain`, args.button.id)
  }

  let prev = DOM.create(`div`, `button arrow_button`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button arrow_button`)
  next.textContent = `>`

  DOM.ev(args.button, `click`, () => {
    args.show()
  })

  DOM.ev(args.button, `auxclick`, (e) => {
    if (e.button === 1) {
      if (args.on_middle_click) {
        args.on_middle_click()
      }
      else {
        args.select_first()
      }
    }
  })

  args.refresh_opts = () => {
    if (args.source) {
      args.opts = args.source()
    }
  }

  args.refresh_opts()

  args.set = (value, on_change = true) => {
    args.action(Menubutton.opt(args, value), on_change)
  }

  args.prev = () => {
    Menubutton.cycle(args, `prev`)
  }

  args.next = () => {
    Menubutton.cycle(args, `next`)
  }

  args.select_first = () => {
    args.refresh_opts()
    args.action(args.opts[0])
  }

  args.action = (opt, on_change = true) => {
    if (!opt) {
      return
    }

    Menubutton.set_text(args, opt)

    if (on_change) {
      if (args.on_change) {
        args.on_change(args, opt)
      }
    }
  }

  args.show = () => {
    args.refresh_opts()
    let items = []

    for (let opt of args.opts) {
      if (opt.text === App.separator_string) {
        App.sep(items)
        continue
      }

      items.push({
        icon: opt.icon,
        text: opt.text,
        info: opt.info,
        image: opt.image,
        action: () => {
          args.action(opt)
        },
      })
    }

    let index = 0

    if (args.get_value) {
      let i = 0
      let value = args.get_value()

      for (let o of args.opts) {
        if (!o.value) {
          continue
        }

        if (o.value === value) {
          index = i
          break
        }

        i += 1
      }
    }

    App.show_context({
      element: args.button,
      items,
      expand: true,
      index,
      margin: args.button.clientHeight,
      after_dismiss: args.after_dismiss,
      after_hide: args.after_hide,
      after_action: args.after_action,
      after_shift_action: args.after_shift_action,
      after_ctrl_action: args.after_ctrl_action,
      after_alt_action: args.after_alt_action,
      after_middle_action: args.after_middle_action,
    })
  }

  args.first_set = false

  args.refresh_button = () => {
    if (args.selected !== undefined) {
      for (let opt of args.opts) {
        if (args.selected === opt.value) {
          Menubutton.set_text(args, opt)
          args.first_set = true
          break
        }
      }
    }
  }

  args.refresh_button()
  DOM.ev(prev, `click`, args.prev)
  DOM.ev(next, `click`, args.next)
  args.container.append(prev)
  args.container.append(next)
  args.button.after(args.container)
  prev.after(args.button)
  return args
}

Menubutton.set_text = (args, opt) => {
  args.button.innerHTML = ``

  if (opt.icon) {
    let icon = DOM.create(`div`, `menupanel_icon`)
    let icon_s = App.clone_if_node(opt.icon)
    icon.append(icon_s)
    args.button.append(icon)
  }

  let text = DOM.create(`div`)
  text.append(opt.text)
  args.button.append(text)
  args.value = opt.value
}

Menubutton.cycle = (args, dir) => {
  let waypoint = false
  let opts = args.opts.slice(0)

  if (dir === `prev`) {
    opts.reverse()
  }

  let opt

  if (args.wrap) {
    opt = opts[0]
  }

  for (let o of opts) {
    if (o.text === App.separator_string) {
      continue
    }

    if (waypoint) {
      opt = o
      break
    }

    if (o.value === args.value) {
      waypoint = true
    }
  }

  if (opt) {
    args.action(opt)
  }
}

Menubutton.opt = (args, value) => {
  for (let opt of args.opts) {
    if (opt.value === value) {
      return opt
    }
  }
}