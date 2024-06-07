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

App.copy_to_clipboard = (text, what = ``) => {
  if (!text) {
    return
  }

  navigator.clipboard.writeText(text)

  if (what) {
    App.alert_autohide(`${what} copied to clipboard`)
  }
  else {
    App.footer_message(`Copied to clipboard`)
  }
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

App.get_path = (url) => {
  return App.remove_slashes_end(App.remove_protocol(url))
}

App.capitalize = (s) => {
  let w = s.charAt(0).toUpperCase() + s.slice(1)
  let lower = w.toLowerCase()

  if (lower === `url`) {
    w = `URL`
  }

  return w.replace(/_/, ` `)
}

App.capitalize_words = (s) => {
  let words = s.split(/[_\s]+/)

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
    if (!App.force_debug) {
      if (App.settings_done && !App.get_setting(`debug_mode`)) {
        return
      }
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

App.text_with_value_focused = () => {
  let el = document.activeElement

  if (el.classList.contains(`text`)) {
    if (el.value.trim()) {
      return true
    }
  }

  return false
}

App.no_space = (s) => {
  return s.replace(/\s+/g, ``)
}

App.single_space = (s) => {
  return s.replace(/ +/g, ` `)
}

// | is ommitted on purpose
App.remove_special = (s) => {
  return s.replace(/[\'\"\-\!\?\@\#\$\%\^\&\*\+\<\>\[\]\(\)\_]/g, ``)
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

App.clean_lines = (s) => {
  let split = s.split(`\n`).map(x => x.trim()).filter(x => x)
  return split.join(`\n`)
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

App.random_string = (n) => {
  let text = ``

  let possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`

  for (let i = 0; i < n; i++) {
    text += possible[App.random_int(0, possible.length - 1)]
  }

  return text
}

App.parse_delay = (s) => {
  let delay
  let split = s.split(`_`)

  if (split[1] === `seconds`) {
    delay = split[0] * App.SECOND
  }
  else if (split[1] === `minutes`) {
    delay = split[0] * App.MINUTE
  }
  else if (split[1] === `hours`) {
    delay = split[0] * App.HOUR
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
  return Array.from(new Set(array))
}

App.SECOND = 1000
App.MINUTE = 60 * App.SECOND
App.HOUR = 60 * App.MINUTE
App.DAY = 24 * App.HOUR
App.MONTH = 30 * App.DAY
App.YEAR = 365 * App.DAY

App.timeago = (date) => {
  let diff = App.now() - date
  let decimals = true

  let n = 0
  let m = ``

  if (diff < App.MINUTE) {
    n = diff / App.SECOND
    m = [`second`, `seconds`]
    decimals = false
  }
  else if (diff < App.HOUR) {
    n = diff / App.MINUTE
    m = [`minute`, `minutes`]
    decimals = false
  }
  else if (diff >= App.HOUR && diff < App.DAY) {
    n = diff / App.HOUR
    m = [`hour`, `hours`]
  }
  else if (diff >= App.DAY && diff < App.MONTH) {
    n = diff / App.DAY
    m = [`day`, `days`]
  }
  else if (diff >= App.MONTH && diff < App.YEAR) {
    n = diff / App.MONTH
    m = [`month`, `months`]
  }
  else if (diff >= App.YEAR) {
    n = diff / App.YEAR
    m = [`year`, `years`]
  }

  if (decimals) {
    n = App.round(n, 1)
  }
  else {
    n = Math.round(n)
  }

  let w = App.plural(n, m[0], m[1])
  return `${n} ${w}`
}

App.round = (n, decimals) => {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
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

App.remove_extension = (s) => {
  return s.split(`.`).slice(0, -1).join(`.`)
}

App.now = () => {
  return Date.now()
}

App.clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

App.sep = (items) => {
  items.push({separator: true})
}

App.def_args = (def, args) => {
  for (let key in def) {
    if ((args[key] === undefined) && (def[key] !== undefined)) {
      args[key] = def[key]
    }
  }
}

App.split_list = (s) => {
  return s.split(/[, ]+/).map(x => x.trim())
}

App.input_deselect = (input) => {
  input.selectionStart = input.selectionEnd
}

App.cursor_at_end = (input) => {
  input.setSelectionRange(input.value.length, input.value.length)
}

App.sort_alpha = (array) => {
  array.sort((a, b) => {
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: `base`})
  })
}

App.same_arrays = (a, b) => {
  return a.length === b.length && a.every(el => b.includes(el))
}

App.wildcard = (pattern, str, exact = false) => {
  let w = pattern.replace(/[.+^${}()|[\]\\]/g, `\\$&`)
  let end = exact ? `$` : ``
  let re = new RegExp(`^${w.replace(/\*/g, `.*`).replace(/\?/g,`.`)}${end}`, `i`)
  return re.test(str)
}

App.is_regex = (str) => {
  return str.startsWith(`/`) && str.endsWith(`/`)
}

App.some = (value) => {
  if (Array.isArray(value)) {
    return Boolean(value.length)
  }

  return Boolean(value)
}

App.remove_undefined = (arr) => {
  arr.map((v, i, o) => {
    if (v === undefined ) {
      o.splice(i, 1)
    }
  })
}