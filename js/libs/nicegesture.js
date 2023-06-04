const NiceGesture = {}
NiceGesture.enabled = true
NiceGesture.button = 1
NiceGesture.threshold = 10

NiceGesture.start = (container, actions) => {
  container.addEventListener(`mousedown`, (e) => {
    if (!NiceGesture.enabled) {
      return
    }

    NiceGesture.reset()

    if (e.button === NiceGesture.button) {
      NiceGesture.active = true
      NiceGesture.first_y = e.clientY
      NiceGesture.first_x = e.clientX
    }
  })

  container.addEventListener(`mousemove`, (e) => {
    if (!NiceGesture.enabled || !NiceGesture.active || NiceGesture.coords.length > 1000) {
      return
    }

    let coord = {
      x: e.clientX,
      y: e.clientY,
    }

    NiceGesture.coords.push(coord)
  })

  container.addEventListener(`mouseup`, (e) => {
    if (e.button !== NiceGesture.button) {
      return
    }

    if (!NiceGesture.enabled || !NiceGesture.active) {
      actions.default(e)
      return
    }

    NiceGesture.check(e, actions)
  })

  NiceGesture.reset()
}

NiceGesture.reset = () => {
  NiceGesture.active = false
  NiceGesture.first_y = 0
  NiceGesture.first_x = 0
  NiceGesture.last_y = 0
  NiceGesture.last_x = 0
  NiceGesture.coords = []
}

NiceGesture.check = (e, actions) => {
  NiceGesture.last_x = e.clientX
  NiceGesture.last_y = e.clientY

  if (NiceGesture.action(e, actions)) {
    e.preventDefault()
  }
  else if (actions.default) {
    actions.default(e)
  }

  NiceGesture.reset(actions)
}

NiceGesture.action = (e, actions) => {
  if (NiceGesture.coords.length === 0) {
    return false
  }

  let ys = NiceGesture.coords.map(c => c.y)
  let max_y = Math.max(...ys)
  let min_y = Math.min(...ys)

  let xs = NiceGesture.coords.map(c => c.x)
  let max_x = Math.max(...xs)
  let min_x = Math.min(...xs)

  if (Math.abs(max_y - min_y) < NiceGesture.threshold &&
    Math.abs(max_x - min_x) < NiceGesture.threshold) {
    return false
  }

  let gt = NiceGesture.threshold
  let path_y, path_x

  if (min_y < NiceGesture.first_y - gt) {
    path_y = `up`
  }
  else if (max_y > NiceGesture.first_y + gt) {
    path_y = `down`
  }

  if (path_y === `up`) {
    if ((Math.abs(NiceGesture.last_y - min_y) > gt) || (max_y > NiceGesture.first_y + gt)) {
      path_y = `up_and_down`
    }
  }

  if (path_y === `down`) {
    if ((Math.abs(NiceGesture.last_y - max_y) > gt) || (min_y < NiceGesture.first_y - gt)) {
      path_y = `up_and_down`
    }
  }

  if (max_x > NiceGesture.first_x + gt) {
    path_x = `right`
  }
  else if (min_x < NiceGesture.first_x - gt) {
    path_x = `left`
  }

  if (path_x === `left`) {
    if ((Math.abs(NiceGesture.last_x - min_x) > gt) || (max_x > NiceGesture.first_x + gt)) {
      path_x = `left_and_right`
    }
  }

  if (path_x === `right`) {
    if ((Math.abs(NiceGesture.last_x - max_x) > gt) || (min_x < NiceGesture.first_x - gt)) {
      path_x = `left_and_right`
    }
  }

  let path

  if (max_y - min_y > max_x - min_x) {
    path = path_y
  }
  else {
    path = path_x
  }

  if (actions[path]) {
    actions[path](e)
  }

  return true
}