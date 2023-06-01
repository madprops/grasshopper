const NiceGesture = {}
NiceGesture.enabled = true
NiceGesture.button = `right`
NiceGesture.threshold = 10

NiceGesture.start = (container, actions) => {
  container.addEventListener(`mousedown`, (e) => {
    if (!NiceGesture.enabled) {
      return
    }

    NiceGesture.reset()
    let btn

    if (NiceGesture.button === `left`) {
      btn = 0
    }
    else if (NiceGesture.button === `middle`) {
      btn = 1
    }
    else if (NiceGesture.button === `right`) {
      btn = 2
    }

    // Right Click
    if (e.button === btn) {
      NiceGesture.active = true
      NiceGesture.first_y = e.clientY
      NiceGesture.first_x = e.clientX
    }
  })

  container.addEventListener(`mousemove`, (e) => {
    if (!NiceGesture.enabled) {
      return
    }

    if (!NiceGesture.active) {
      return
    }

    if (NiceGesture.coords.length > 1000) {
      return
    }

    let coord = {
      x: e.clientX,
      y: e.clientY,
    }

    NiceGesture.coords.push(coord)
  })

  function release (e) {
    if (!NiceGesture.enabled) {
      return
    }

    if (!NiceGesture.active) {
      return
    }

    NiceGesture.check(e, actions)
  }

  container.addEventListener(`contextmenu`, (e) => {
    if (NiceGesture.button === `right`) {
      release(e)
    }
  })

  container.addEventListener(`mouseup`, (e) => {
    if (NiceGesture.button === `left` || NiceGesture.button === `middle`) {
      release(e)
    }
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

  if (Math.abs(max_y - min_y) < NiceGesture.threshold) {
    return false
  }

  if (Math.abs(max_x - min_x) < NiceGesture.threshold) {
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