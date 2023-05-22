App.create_debouncer = (func, delay) => {
  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

App.remove_protocol = (url) => {
  return url.replace(/^https?:\/\//, ``)
}

App.copy_to_clipboard = (text, what = ``) => {
  navigator.clipboard.writeText(text)

  if (what) {
    App.show_feedback(`${what} copied to clipboard`)
  }
}

App.plural = (n, singular, plural) => {
  if (n === 1) {
    return `${n.toLocaleString()} ${singular}`
  }
  else {
    return `${n.toLocaleString()} ${plural}`
  }
}

App.plural_2 = (n, singular, plural) => {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

App.get_hostname = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.hostname
}

App.urls_equal = (u1, u2) => {
  return App.remove_slashes_end(u1) === App.remove_slashes_end(u2)
}

App.remove_slashes_end = (s) => {
  return s.replace(/\/+$/g, ``)
}

App.remove_hash = (url) => {
  return url.split(`#`)[0]
}

App.format_url = (url) => {
  return App.remove_slashes_end(App.remove_hash(url))
}

App.capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

App.is_http = (item) => {
  return item.protocol === `http:` || item.protocol === `https:`
}

App.nice_date = (date = Date.now()) => {
  return dateFormat(date, `dd/mmm/yy | h:MM:ss tt`)
}

App.get_coords = (el) => {
  let rect = el.getBoundingClientRect()
  return {x: rect.left, y: rect.top}
}

App.get_random_int = (min, max, exclude = undefined) => {
  let num = Math.floor(Math.random() * (max - min + 1) + min)

  if (exclude !== undefined) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

App.is_image = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.image_extensions.includes(extension)
}

App.is_video = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.video_extensions.includes(extension)
}

App.get_extension = (s) => {
  if (s.startsWith(`http://`) || s.startsWith(`https://`)) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split(`//`).slice(1).join(`//`)
    let matches = url_2.match(/\/.*\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }
  else {
    let matches = s.match(/\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }

  return ``
}

App.get_template = (id) => {
  let template = DOM.el(`#template_${id}`)

  if (template) {
    return template.innerHTML.trim()
  }
}

App.fillpad = (s, n, c) => {
  let olen = s.length

  for (let i=0; i<(n - olen); i++) {
    s = c + s
  }

  return s
}

App.close_window = () => {
  window.close()

  // Sidebar doesn't close so return to tabs
  if (App.settings.switch_to_tabs) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
    }
  }
}

App.log = (message, mode = `normal`) => {
  if (mode === `error`) {
    console.error(message)
  }
  else {
    console.info(`🟢 ${message}`)
  }
}

App.find_duplicates = (objects, property) => {
  let frequency_map = objects.reduce((map, obj) => {
    map[obj[property]] = (map[obj[property]] || 0) + 1
    return map
  }, {})

  return objects.filter(obj => frequency_map[obj[property]] > 1)
}

App.get_excess = (objects, property) => {
  let items = {}
  let excess = []

  for (let obj of objects) {
    if (items[obj[property]]) {
      excess.push(obj)
    }
    else {
      items[obj[property]] = obj
    }
  }

  return excess
}

App.is_at_top = (container) => {
  return container.scrollTop === 0
}

App.is_at_bottom = (container) => {
  return container.scrollTop + container.clientHeight === container.scrollHeight
}

App.element_is_visible = (container, el) => {
  let container_rect = container.getBoundingClientRect()
  let rect = el.getBoundingClientRect()
  let top_visible = rect.top >= container_rect.top - 2
  let bottom_visible = rect.bottom <= container_rect.bottom + 2
  return top_visible && bottom_visible
}

App.image_extensions = [`jpg`, `jpeg`, `png`, `gif`, `webp`, `bmp`]
App.video_extensions = [`mp4`, `webm`]