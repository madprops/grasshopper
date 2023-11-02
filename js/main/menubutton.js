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
  let prev = DOM.create(`div`, `button`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button`)
  next.textContent = `>`

  DOM.ev(args.button, `click`, () => {
    args.show()
  })

  args.set = (value, on_change = true) => {
    let opt = Menubutton.opt(args, value)
    Menubutton.set_text(args, opt)

    if (on_change && args.on_change) {
      args.on_change(args, opt)
    }
  }

  args.prev = () => {
    Menubutton.cycle(args, `prev`)
  }

  args.next = () => {
    Menubutton.cycle(args, `next`)
  }

  args.show = () => {
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
          Menubutton.set_text(args, opt)

          if (args.on_change) {
            args.on_change(args, opt)
          }
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
      items: items,
      expand: true,
      index: index,
      margin: args.button.clientHeight,
      after_dismiss: args.after_dismiss,
      after_hide: args.after_hide,
      after_action: args.after_action,
      after_alt_action: args.after_alt_action,
    })
  }

  if (args.selected) {
    for (let opt of args.opts) {
      if (args.selected === opt.value) {
        Menubutton.set_text(args, opt)
        break
      }
    }
  }

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
    let icon_s = opt.icon

    if (icon_s instanceof Node) {
      icon_s = icon_s.cloneNode(true)
    }

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
    Menubutton.set_text(args, opt)

    if (args.on_change) {
      args.on_change(args, opt)
    }
  }
}

Menubutton.opt = (args, value) => {
  for (let opt of args.opts) {
    if (opt.value === value) {
      return opt
    }
  }
}