const App = {}
App.size = 14
App.limit = 25
App.started = false

App.init = () => {
  App.el_grid = DOM.el(`#grid`)
  App.el_colorbox = DOM.el(`#colorbox`)
  App.el_counter = DOM.el(`#counter`)
  App.audio_laser = DOM.el(`#audio_laser`)
  App.audio_bell = DOM.el(`#audio_bell`)
  App.get_style()
  App.prepare_blocks()
  App.prepare_colorbox()
  App.prepare_counter()
  App.start()
}

App.start = () => {
  App.active = 0
  App.count = 0
  App.start_grid()
  App.update_counter()
  App.started = true
}

App.random_int = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

App.get_style = () => {
  let style = getComputedStyle(document.body)

  App.colors = [
    `#ffffff`,
    style.getPropertyValue(`--color_1`),
    style.getPropertyValue(`--color_2`),
    style.getPropertyValue(`--color_3`),
    style.getPropertyValue(`--color_4`),
    style.getPropertyValue(`--color_5`),
    style.getPropertyValue(`--color_6`)
  ]
}

App.set_active = (item, color) => {
  item.active = true
  App.active += 1
  item.block.classList.add(`active`)
}

App.set_color = (item, color) => {
  item.color = color
  item.block.dataset.color = color
  item.block.style.backgroundColor = App.colors[color]
}

App.random_color = () => {
  return App.random_int(1, App.colors.length - 1)
}

App.start_grid = () => {
  App.grid = []
  App.el_grid.innerHTML = ``

  for (let y=0; y<App.size; y++) {
    let row = []
    let elrow = DOM.create(`div`)
    elrow.classList.add(`grid_row`)

    for (let x=0; x<App.size; x++) {
      let item = {}
      item.x = x
      item.y = y
      item.active = false
      item.checked = false

      let color = App.random_color()
      let block = DOM.create(`div`)
      block.classList.add(`block`)
      block.dataset.color = color
      item.block = block
      App.set_color(item, color)

      row.push(item)
      elrow.append(block)
    }

    App.grid.push(row)
    App.el_grid.append(elrow)
  }

  let first = App.grid[0][0]
  App.set_active(first)
  App.set_color(first, 0)
}

App.onclick = (color) => {
  if (color === 0) {
    return
  }

  App.fill(0, 0, color)
  App.reset_checked()
  App.count += 1
  App.update_counter()
  App.audio_laser.play()
}

App.prepare_blocks = () => {
  DOM.ev(App.el_grid, `click`, (e) => {
    if (!App.started) {
      return
    }

    if (e.target.classList.contains(`block`)) {
      App.onclick(parseInt(e.target.dataset.color))
    }
  })
}

App.prepare_colorbox = () => {
  DOM.ev(App.el_colorbox, `click`, (e) => {
    if (!App.started) {
      return
    }

    if (e.target.classList.contains(`block`)) {
      App.onclick(parseInt(e.target.dataset.color))
    }
  })
}

App.reset_checked = () => {
  for (let row of App.grid) {
    for (let item of row) {
      item.checked = false
    }
  }
}

App.fill = (y, x, color) => {
  if (y < 0 || y >= App.size) {
    return
  }

  if (x < 0 || x >= App.size) {
    return
  }

  let item = App.grid[y][x]

  if (item.checked) {
    return
  }

  item.checked = true
  let is_first = y === 0 && x === 0

  if (is_first || item.active || item.color === color) {
    if (!item.active) {
      App.set_active(item, color)
    }

    if (item.color !== color) {
      App.set_color(item, color)
    }

    App.fill(y + 1, x, color)
    App.fill(y - 1, x, color)
    App.fill(y, x + 1, color)
    App.fill(y, x - 1, color)
  }

  return
}

App.prepare_counter = () => {
  DOM.ev(App.el_counter, `click`, () => {
    App.start()
  })
}

App.update_counter = () => {
  App.el_counter.textContent = `Clicks: ${App.count} / ${App.limit}`
  let won = App.active === App.size * App.size

  if (won || App.count >= App.limit) {
    App.started = false
    App.el_counter.textContent += ` (Click Here To Restart)`
    App.audio_bell.play()
  }
}