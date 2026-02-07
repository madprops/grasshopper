App.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

App.create_debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    App.error(`Invalid debouncer function`)
    return
  }

  if ((typeof delay !== `number`) || (delay < 1)) {
    App.error(`Invalid debouncer delay`)
    return
  }

  let timer
  let obj = {}

  function clear() {
    clearTimeout(timer)
    timer = undefined
  }

  function run(...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.call_2 = (...args) => {
    if (timer) {
      return
    }

    obj.call(args)
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

App.remove_protocol = (url, www = true, file = true) => {
  url = url.replace(/^https?:\/\//, ``)

  if (www) {
    url = url.replace(/^www\./, ``)
  }

  if (file) {
    url = url.replace(/^file:\/\//, ``)
  }

  return url
}

App.copy_to_clipboard = (text, what = ``) => {
  if (!text) {
    return
  }

  navigator.clipboard.writeText(text)
  let msg

  if (what) {
    msg = `${what} Copied`
  }
  else {
    msg = `Copied to clipboard`
  }

  App.footer_message(msg)
}

App.read_clipboard = async () => {
  let perm = await App.ask_permission(`clipboardRead`)

  if (!perm) {
    return
  }

  try {
    return await navigator.clipboard.readText()
  }
  catch (err) {
    App.error(`Failed to read clipboard: ${err.message}`)
    return
  }
}

App.plural = (n, singular, plural) => {
  if (n === 1) {
    return singular
  }

  return plural
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

App.format_url = (url) => {
  return App.remove_slashes_end(url)
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

App.is_local = (s) => {
  return s.startsWith(`file://`)
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
    // eslint-disable-next-line no-console
    console.error(`🔴 ${message}`)
  }
  else if (mode === `normal`) {
    // eslint-disable-next-line no-console
    console.info(`🟢 ${message}`)
  }
  else if (mode === `debug`) {
    if (!App.force_debug) {
      if (App.settings_done && !App.get_setting(`debug_mode`)) {
        return
      }
    }

    // eslint-disable-next-line no-console
    console.info(`🔵 ${message}`)
  }
  else if (mode === `debug_force`) {
    // eslint-disable-next-line no-console
    console.info(`🔵 ${message}`)
  }
  else if (mode === `green`) {
    // eslint-disable-next-line no-console
    console.info(`%c${message}`, `color: lightgreen;`)
  }
  else {
    // eslint-disable-next-line no-console
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

  if (DOM.class(el, [`text`])) {
    if (el.value.trim()) {
      return true
    }
  }

  return false
}

App.single_space = (s) => {
  return s.replace(/ +/g, ` `)
}

// | is ommitted on purpose
App.escape_regex = (s) => {
  return s.replace(/[.*+?^${}()[\]\\]/g, `\\$&`)
}

App.wheel_direction = (e) => {
  if (e.deltaY > 0) {
    return `down`
  }

  return `up`
}

App.no_linebreaks = (s) => {
  return s.replace(/\n/g, ` `)
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
  return s.replace(/</g, `&lt;`).replace(/>/g, `&gt;`)
}

App.is_object = (o) => {
  if ((typeof o === `object`) && !Array.isArray(o) && (o !== null)) {
    return true
  }

  return false
}

App.is_array = (a) => {
  return Array.isArray(a)
}

App.random_int = (args = {}) => {
  let def_args = {
    exclude: [],
  }

  App.def_args(def_args, args)

  if (args.exclude.length > 0) {
    let available = []

    for (let i = args.min; i <= args.max; i++) {
      if (!args.exclude.includes(i)) {
        available.push(i)
      }
    }

    if (!available.length) {
      return
    }

    let random_index

    if (args.rand) {
      random_index = Math.floor(args.rand() * available.length)
    }
    else {
      random_index = Math.floor(Math.random() * available.length)
    }

    return available[random_index]
  }

  if (args.rand) {
    return Math.floor(args.rand() * (args.max - args.min + 1) + args.min)
  }

  return Math.floor(Math.random() * (args.max - args.min + 1) + args.min)
}

App.random_string = (n) => {
  let text = ``

  let possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`

  for (let i = 0; i < n; i++) {
    text += possible[App.random_int({min: 0, max: possible.length - 1})]
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

App.scroll_to_left = (el) => {
  el.scrollLeft = 0
  let pos = el.selectionStart
  let text = el.value
  let new_pos = text.lastIndexOf(`\n`, pos - 1)
  let start = new_pos === -1 ? 0 : new_pos + 1
  el.setSelectionRange(start, start)
}

App.scroll_to_right = (el) => {
  el.scrollLeft = el.scrollWidth
}

App.to_set = (array) => {
  return Array.from(new Set(array))
}

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
  else if ((diff >= App.HOUR) && (diff < App.DAY)) {
    n = diff / App.HOUR
    m = [`hour`, `hours`]
  }
  else if ((diff >= App.DAY) && (diff < App.MONTH)) {
    n = diff / App.DAY
    m = [`day`, `days`]
  }
  else if ((diff >= App.MONTH) && (diff < App.YEAR)) {
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
  return Math.round(n * (10 ** decimals)) / (10 ** decimals)
}

App.obj = (str) => {
  return JSON.parse(str)
}

App.str = (obj, format = false) => {
  if (format) {
    return JSON.stringify(obj, null, 2)
  }

  return JSON.stringify(obj)
}

App.remove_extension = (s) => {
  return s.split(`.`).slice(0, -1).join(`.`)
}

App.now = () => {
  return Date.now()
}

App.clone = (obj) => {
  return App.obj(App.str(obj))
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
  return (a.length === b.length) && a.every(el => b.includes(el))
}

App.wildcard = (pattern, str, exact = false) => {
  let w = pattern.replace(/[.+^${}()|[\]\\]/g, `\\$&`)
  let end = exact ? `$` : ``
  let re = new RegExp(`^${w.replace(/\*/g, `.*`).replace(/\?/g, `.`)}${end}`, `i`)
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
  if (!arr.some(x => x === undefined)) {
    return
  }

  let filtered = arr.filter(x => x !== undefined)
  arr.length = 0
  arr.push(...filtered)
}

App.trigger_title = (el, name) => {
  let dcmd = App.get_setting(name)

  if (dcmd) {
    let cmd = App.get_command(dcmd)

    if (cmd) {
      if (name.startsWith(`click_press`)) {
        el.title += `\nClick Press: ${cmd.name}`
      }
      else if (name.startsWith(`click`)) {
        el.title += `\nClick: ${cmd.name}`
      }
      else if (name.startsWith(`middle_click_press`)) {
        el.title += `\nMiddle Click Press: ${cmd.name}`
      }
      else if (name.startsWith(`middle_click`)) {
        el.title += `\nMiddle Click: ${cmd.name}`
      }
      else if (name.startsWith(`double_click`)) {
        el.title += `\nDouble Click: ${cmd.name}`
      }
      else if (name.startsWith(`wheel_up_shift`)) {
        el.title += `\nShift Wheel Up: ${cmd.name}`
      }
      else if (name.startsWith(`wheel_down_shift`)) {
        el.title += `\nShift Wheel Down: ${cmd.name}`
      }
      else if (name.startsWith(`wheel_up`)) {
        el.title += `\nWheel Up: ${cmd.name}`
      }
      else if (name.startsWith(`wheel_down`)) {
        el.title += `\nWheel Down: ${cmd.name}`
      }
      else if (name.startsWith(`ctrl_click`)) {
        el.title += `\nCtrl Click: ${cmd.name}`
      }
      else if (name.startsWith(`shift_click`)) {
        el.title += `\nShift Click: ${cmd.name}`
      }
      else if (name.startsWith(`ctrl_shift_click`)) {
        el.title += `\nCtrl Shift Click: ${cmd.name}`
      }
      else if (name.startsWith(`ctrl_middle_click`)) {
        el.title += `\nCtrl Middle Click: ${cmd.name}`
      }
      else if (name.startsWith(`shift_middle_click`)) {
        el.title += `\nShift Middle Click: ${cmd.name}`
      }
      else if (name.startsWith(`ctrl_shift_middle_click`)) {
        el.title += `\nCtrl Shift Middle Click: ${cmd.name}`
      }

      el.title = el.title.trim()
    }
  }
}

App.item_or_items = (value, what) => {
  let items = [what, `${what}s`]
  return items.some(v => value.includes(v))
}

App.fix_url = (url) => {
  url = url.toLowerCase().trim()
  let protocols = [`http://`, `https://`]

  if (!protocols.some(p => url.startsWith(p))) {
    url = `https://${url}`
  }

  return url
}

App.remove_quotes = (str) => {
  return str.replace(/"/g, ``)
}

App.remove_separators = (cmds) => {
  cmds = cmds.filter(x => x.cmd !== App.separator_string)
  return cmds.filter(x => x.text !== App.separator_string)
}

App.at_left = (el) => {
  return el.scrollLeft <= 0
}

App.at_right = (el) => {
  return el.scrollLeft >= (el.scrollWidth - el.clientWidth)
}

App.input_at_start = (input) => {
  input.setSelectionRange(0, 0)
}

App.input_at_end = (input) => {
  input.setSelectionRange(input.value.length, input.value.length)
}

App.urls_match = (url_1, url_2) => {
  url_1 = App.remove_slashes_end(url_1)
  url_2 = App.remove_slashes_end(url_2)
  return url_1 === url_2
}

App.is_json = (text) => {
  try {
    let parsed = JSON.parse(text)
    return ((typeof parsed === `object`)) && (parsed !== null)
  }
  catch (e) {
    return false
  }
}

App.shuffle_array = (array) => {
  return array
    .map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
}

App.clone_if_node = (el) => {
  return el instanceof Node ? el.cloneNode(true) : el
}

App.boolstring = (s) => {
  return s && (s === `true`)
}

App.indent = (s, n) => {
  let lines = s.split(`\n`).map(x => x.trim())
  return lines.join(`\n`)
}

App.random_word = (parts = 3, cap = true) => {
  let cons = `bcdfghjklmnpqrstvwxyz`
  let vowels = `aeiou`
  let cons_next = App.random_int({min: 0, max: 1}) === 0
  let word = ``

  for (let i = 0; i < parts * 2; i++) {
    if (cons_next) {
      let index = App.random_int({min: 0, max: cons.length - 1})
      word += cons[index]
    }
    else {
      let index = App.random_int({min: 0, max: vowels.length - 1})
      word += vowels[index]
    }

    cons_next = !cons_next
  }

  if (cap) {
    word = App.capitalize(word)
  }

  return word
}

App.get_random_item = (array) => {
  if (!Array.isArray(array) || !array.length) {
    return null
  }

  let index = App.random_int({min: 0, max: array.length - 1})
  return array[index]
}

App.get_random_items = (array, num) => {
  let indices = []
  let len = array.length - 1

  for (let n = 1; n <= num; n++) {
    indices.push(App.random_int({min: 0, max: len, exclude: indices}))
  }

  let items = indices.map(i => array[i])
  return items
}

App.remove_from_list = (list, value) => {
  let existing = list.findIndex(item => item.value === value)

  if (existing !== -1) {
    list.splice(existing, 1)
  }
}

// Find the similarity between two strings
App.string_similarity = (s1, s2) => {
  let longer = s1
  let shorter = s2

  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }

  let longer_length = longer.length

  if (longer_length === 0) {
    return 1.0
  }

  return (longer_length - App.string_similarity_distance(longer, shorter)) / parseFloat(longer_length)
}

// Find the similarity distance between two strings
App.string_similarity_distance = (s1, s2) => {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  let costs = new Array()

  for (let i = 0; i <= s1.length; i++) {
    let last_value = i

    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      }
      else if (j > 0) {
        let new_value = costs[j - 1]

        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          new_value = Math.min(Math.min(new_value, last_value),
            costs[j]) + 1
        }

        costs[j - 1] = last_value
        last_value = new_value
      }
    }

    if (i > 0) {
      costs[s2.length] = last_value
    }
  }

  return costs[s2.length]
}

App.sort_chars = (text) => {
  let chars = text.toLowerCase().split(``).filter(x => x).sort()
  return chars.join(``)
}

App.get_words = (text) => {
  return text.split(` `).filter(x => x)
}

App.regex_u = (c, n) => {
  return `${c}{${n}}`
}

App.regex_t = (c, n) => {
  let u = App.regex_u(c, n)
  return `(?:(?!${u}|\\s).)`
}

App.regex_t2 = (c, n) => {
  let u = App.regex_u(c, n)
  return `(?:(?!${u}).)`
}

App.char_regex_1 = (char, n = 1) => {
  let c = App.escape_regex(char)
  let u = App.regex_u(c, n)
  let t = App.regex_t(c, n)
  let t2 = App.regex_t2(c, n)
  let regex = `${u}(${t}${t2}*${t}|${t})${u}`
  return new RegExp(regex, `g`)
}

App.char_regex_2 = (char, n = 1) => {
  let c = App.escape_regex(char)
  let u = App.regex_u(c, n)
  let t = App.regex_t(c, n)
  let regex = `(?:^|\\s)${u}(${t}.*?${t}|${t})${u}(?:$|\\s)`
  return new RegExp(regex, `g`)
}

App.char_regex_3 = (char, n = 1) => {
  let c = App.escape_regex(char)
  let u = App.regex_u(c, n)
  let t2 = App.regex_t2(c, n)
  let regex = `${u}(${t2}+)${u}`
  return new RegExp(regex, `g`)
}

App.to_bold = (text) => {
  return `<span class="md_highlight">${text}</span>`
}