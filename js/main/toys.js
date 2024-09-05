App.locust_swarm = () => {
  App.stop_locust_swarm()

  let canvas = DOM.create(`canvas`)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.zIndex = 999999
  canvas.style.position = `fixed`
  canvas.style.top = 0
  canvas.style.left = 0
  App.locust_swarm_canvas = canvas

  DOM.ev(canvas, `click`, () => {
    App.stop_locust_swarm()
  })

  document.body.appendChild(canvas)

  let context = canvas.getContext(`2d`)
  canvas.width = document.body.offsetWidth
  let width = canvas.width
  let height = canvas.height
  context.fillStyle = `#000000`
  context.fillRect(0, 0, width, height)
  let columns = Math.floor(width / 20) + 1
  let y_position = Array(columns).fill(0)

  function matrix() {
    context.fillStyle = `#0001`
    context.fillRect(0, 0, width, height)
    context.fillStyle = `#0f0`
    context.font = `15pt monospace`

    y_position.forEach((y, index) => {
      let text = App.grasshopper_icon
      let x = index * 20
      context.fillText(text, x, y)

      if (y > 100 + Math.random() * 10000) {
        y_position[index] = 0
      }
      else {
        y_position[index] = y + 20
      }
    })
  }

  App.locust_swarm_on = true
  App.locust_swarm_interval = setInterval(matrix, 50)
}

App.stop_locust_swarm = () => {
  clearInterval(App.locust_swarm_interval)

  if (App.locust_swarm_canvas) {
    App.locust_swarm_canvas.remove()
    App.locust_swarm_canvas = undefined
  }

  App.locust_swarm_on = false
}