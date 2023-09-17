App.create_debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    App.error(`Invalid debouncer function`)
    return
  }

  if (!delay) {
    App.error(`Invalid debouncer delay`)
    return
  }

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

App.copy_to_clipboard = (text, what = `Text`) => {
  navigator.clipboard.writeText(text)
  App.show_feedback(`${what} copied to clipboard`)
}

App.plural = (n, singular, plural) => {
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

App.get_protocol = (url) => {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ``
  }

  return url_obj.protocol
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
  let w = s.charAt(0).toUpperCase() + s.slice(1)
  let lower = w.toLowerCase()

  if (lower === `url`) {
    w = `URL`
  }

  return w
}

App.capitalize_words = (s) => {
  let words = s.split(` `)

  let capitalized = words.map(word => {
    return App.capitalize(word)
  })

  return capitalized.join(` `)
}

App.nice_date = (date = App.now(), seconds = false) => {
  let s = ``

  if (seconds) {
    s = `:ss`
  }

  return dateFormat(date, `dd/mmm/yy | h:MM${s} tt`)
}

App.is_url = (s) => {
  return s.startsWith(`http://`) || s.startsWith(`https://`)
}

App.get_extension = (s) => {
  if (App.is_url(s)) {
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

App.log = (message, mode = `normal`, date = false) => {
  if (date) {
    let d = App.nice_date(undefined, true)
    message = `${message} - ${d}`
  }

  if (mode === `error`) {
    console.error(`🔴 ${message}`)
  }
  else if (mode === `normal`) {
    console.info(`🟢 ${message}`)
  }
  else if (mode === `debug`) {
    if (App.settings_ready && !App.get_setting(`debug_mode`)) {
      return
    }

    console.info(`🔵 ${message}`)
  }
  else if (mode === `debug_force`) {
    console.info(`🔵 ${message}`)
  }
  else if (mode === `green`) {
    console.info(`%c${message}`, `color: lightgreen;`)
  }
  else {
    console.info(message)
  }
}

App.debug = (message, force = false) => {
  let s = force ? `debug_force` : `debug`
  App.log(message, s, true)
}

App.error = (message) => {
  App.log(message, `error`, true)
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

App.element_is_visible = (el) => {
  let container_rect = el.parentElement.getBoundingClientRect()
  let rect = el.getBoundingClientRect()
  let top_visible = rect.top >= container_rect.top - 2
  let bottom_visible = rect.bottom <= container_rect.bottom + 2
  return top_visible && bottom_visible
}

App.text_with_value_focused = () => {
  let el = document.activeElement

  if (el.classList.contains(`text`)) {
    if (el.value.trim()) {
      return true
    }
  }

  return false
}

App.only_chars = (s) => {
  return s.replace(/[^\w]/g, ``)
}

App.no_space = (s) => {
  return s.replace(/\s+/g, ``)
}

App.single_space = (s) => {
  return s.replace(/\s+/g, ` `)
}

App.wheel_direction = (e) => {
  if (e.deltaY > 0) {
    return `down`
  }
  else {
    return `up`
  }
}

App.one_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n`).replace(/ +/g, ` `).trim()
}

App.single_linebreak = (s) => {
  return s.replace(/(\n\s*){2,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

App.double_linebreak = (s) => {
  return s.replace(/(\n\s*){3,}/g, `\n\n`).replace(/ +/g, ` `).trim()
}

App.contains_number = (str) => {
  return /\d/.test(str)
}

App.escape_regex = (s) => {
  return s.replace(/[^A-Za-z0-9|]/g, `\\$&`)
}

App.hostname_full = (item) => {
  return `${item.protocol}//${item.hostname}`
}

App.check_force = (warn_setting, num, force_single = false) => {
  if (num === 1 && force_single) {
    return true
  }

  if (num >= App.max_warn_limit) {
    return false
  }

  if (warn_setting) {
    return !App.get_setting(warn_setting)
  }

  return true
}

App.text_with_empty_lines = () => {
  if (document.activeElement.tagName === `TEXTAREA`) {
    return /\s*\n{1,}$/.test(document.activeElement.value)
  }

  return true
}

App.make_html_safe = (s) => {
  return s.replace(/\</g, `&lt;`).replace(/\>/g, `&gt;`)
}

App.is_object = (o) => {
  if (typeof o === `object` && !Array.isArray(o) && o !== null) {
    return true
  }

  return false
}

App.is_array = (a) => {
  return Array.isArray(a)
}

App.random_int = (min, max, exclude = undefined, random_function) => {
  let num

  if (random_function) {
    num = Math.floor(random_function() * (max - min + 1) + min)
  }
  else {
    num = Math.floor(Math.random() * (max - min + 1) + min)
  }

  if (exclude) {
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

App.random_choice = (list, rand) => {
  return list[App.random_int(0, list.length - 1, undefined, rand)]
}

App.parse_delay = (s) => {
  let delay
  let split = s.split(`_`)

  if (split[1] === `seconds`) {
    delay = split[0] * 1000
  }
  else if (split[1] === `minutes`) {
    delay = split[0] * 1000 * 60
  }
  else if (split[1] === `hours`) {
    delay = split[0] * 1000 * 60 * 60
  }

  return delay
}

App.scroll_to_bottom = (el) => {
  el.scrollTop = el.scrollHeight
  el.scrollLeft = 0
}

App.scroll_to_top = (el) => {
  el.scrollTop = 0
  el.scrollLeft = 0
}

App.scroll_to_right = (el) => {
  el.scrollLeft = el.scrollWidth
}

App.to_set = (array) => {
  return [...new Set(array)]
}

App.color_icon = (color) => {
  return `<div class='color_icon background_${color}'></div>`
}

App.MINUTE = 60000
App.HOUR = 3600000
App.DAY = 86400000
App.YEAR = 31536000000

App.timeago = (date) => {
  let diff = App.now() - date
  let s

  if (diff < App.MINUTE) {
    s = `just now`
  }
  else if (diff < App.HOUR) {
    let n = Math.floor(diff / 60 / 1000)

    if (n === 1) {
      s = `${n} min ago`
    }
    else {
      s = `${n} mins ago`
    }
  }
  else if (diff >= App.HOUR && diff < App.DAY) {
    let n = Math.floor(diff / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} hr ago`
    }
    else {
      s = `${n} hrs ago`
    }
  }
  else if (diff >= App.DAY && diff < App.YEAR) {
    let n = Math.floor(diff / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} day ago`
    }
    else {
      s = `${n} days ago`
    }
  }
  else if (diff >= App.YEAR) {
    let n = Math.floor(diff / 365 / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `${n} year ago`
    }
    else {
      s = `${n} years ago`
    }
  }

  return s
}

App.obj = (str) => {
  return JSON.parse(str)
}

App.str = (obj, format = false) => {
  if (format) {
    return JSON.stringify(obj, null, 2)
  }
  else {
    return JSON.stringify(obj)
  }
}

App.fillpad = (s, n, c) => {
  s = s.toString()
  let olen = s.length

  for (let i=0; i<(n - olen); i++) {
    s = c + s
  }

  return s
}

App.remove_extension = (s) => {
  return s.split(`.`).slice(0, -1).join(`.`)
}

App.now = () => {
  return Date.now()
}

App.clone = (obj) => {
  return structuredClone(obj)
}

App.sep = (items) => {
  items.push({separator: true})
}

App.domain = (s) => {
  let url = new URL(s)
  let protocol = url.protocol
  let hostname = url.hostname
  return `${protocol}//${hostname}`
}