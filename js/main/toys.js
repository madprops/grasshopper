App.locust_swarm = () => {
  App.stop_locust_swarm()

  let canvas = DOM.create(`canvas`)
  canvas.id = `canvas_locust_swarm`
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  App.locust_swarm_canvas = canvas

  DOM.ev(canvas, `click`, () => {
    App.stop_locust_swarm()
  })

  document.body.appendChild(canvas)
  let context = canvas.getContext(`2d`)
  canvas.width = document.body.offsetWidth
  let width = canvas.width
  let height = canvas.height
  context.fillStyle = `#000`
  context.fillRect(0, 0, width, height)
  let columns = Math.floor(width / 20) + 1
  let y_position = Array(columns).fill(0)
  let chars = [`🦗`, `🌿`]
  let delay = 50
  let num = 0
  let limit = 1000

  function random_char() {
    return chars[Math.floor(Math.random() * chars.length)]
  }

  function matrix() {
    context.fillStyle = `#0001`
    context.fillRect(0, 0, width, height)
    context.fillStyle = `#0f0`
    context.font = `15pt monospace`

    for (let [index, y] of y_position.entries()) {
      let text = random_char()
      let x = index * 20
      context.fillText(text, x, y)

      if (y > 100 + Math.random() * 10000) {
        y_position[index] = 0
      }
      else {
        y_position[index] = y + 20
      }
    }

    num += 1

    if (num >= limit) {
      App.stop_locust_swarm()
    }
  }

  if (!delay || (delay < 1)) {
    App.error(`Locust Swarm delay is invalid`)
    return
  }

  App.locust_swarm_on = true
  App.locust_swarm_interval = setInterval(matrix, delay)
}

App.stop_locust_swarm = () => {
  clearInterval(App.locust_swarm_interval)

  if (App.locust_swarm_canvas) {
    App.locust_swarm_canvas.remove()
    App.locust_swarm_canvas = undefined
  }

  App.locust_swarm_on = false
}

App.start_breathe_effect = () => {
  clearTimeout(App.breathe_effect_timeout)
  App.breathe_effect_on = !App.breathe_effect_on
  App.apply_theme()

  App.breathe_effect_timeout = setTimeout(() => {
    App.stop_breathe_effect()
  }, App.SECOND * 9)
}

App.stop_breathe_effect = () => {
  App.breathe_effect_on = false
  App.apply_theme()
}