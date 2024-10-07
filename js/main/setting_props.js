App.build_settings = () => {
  // Setting Properties
  App.setting_props = {}
  let category, props

  // Add category props to main object
  function add_props () {
    for (let key in props) {
      props[key].category = category
      App.setting_props[key] = props[key]
    }
  }

  category = `general`

  props = {
    main_mode: {
      name: `Main Mode`,
      type: `menu`,
      value: `tabs`,
      info: `The mode to show by default`,
      version: 1,
      setup: (key) => {
        let values = []

        for (let mode of App.modes) {
          values.push({text: App.get_mode_name(mode), value: mode})
        }

        App.settings_make_menu(key, values)
      },
    },
    text_mode: {
      name: `Text Mode`,
      type: `menu`,
      value: `title`,
      info: `What to show as the text for each item`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Title`, value: `title`},
          {text: `URL`, value: `url`},
          {text: `Title / URL`, value: `title_url`},
          {text: `URL / Title`, value: `url_title`},
        ])
      },
    },
    item_height: {
      name: `Item Height`,
      type: `menu`,
      value: `normal`,
      info: `How big each item is`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes)
      },
    },
    item_border: {
      name: `Item Border`,
      type: `menu`,
      value: `none`,
      info: `Borders between items`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])
      },
    },
    item_align: {
      name: `Item Align`,
      type: `menu`,
      value: `left`,
      info: `How to align the text in each item`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.aligns)
      },
    },
    item_icon: {
      name: `Item Icon`,
      type: `menu`,
      value: `normal`,
      info: `The size of the item icons`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes)
      },
    },
    icon_effect: {
      name: `Icon Effect`,
      type: `menu`,
      value: `spin`,
      info: `Effect for icons when multiple items are selected`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Spin`, value: `spin`},
          {text: `Invert`, value: `invert`},
          {text: `Border`, value: `border`},
        ])
      },
    },
    hover_effect: {
      name: `Hover Effect`,
      type: `menu`,
      value: `glow`,
      info: `What effect to use when hovering items`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.effects)
      },
    },
    selected_effect: {
      name: `Selected Effect`,
      type: `menu`,
      value: `background`,
      info: `What effect to use on selected items`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.effects)
      },
    },
    loading_effect: {
      name: `Loading Effect`,
      type: `menu`,
      value: `icon`,
      info: `Which effect to show on loading tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.loading_effects)
      },
    },
    tab_sort: {
      name: `Tab Sort`,
      type: `menu`,
      value: `normal`,
      no_mirror: true,
      info: `How to sort the tabs
      Either by index or by recent use`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Normal`, value: `normal`},
          {text: `Recent`, value: `recent`},
        ])
      },
    },
    new_tab_mode: {
      name: `New Tab Mode`,
      type: `menu`,
      value: `below_special`,
      info: `What to do when opening a new tab
      Normal means whatever the browser decides
      Special means when used through item menus like the Hover Button or the Extra Menu`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Normal`, value: `normal`},
          {text: `Above Current`, value: `above_all`},
          {text: `Below Current`, value: `below_all`},
          {text: `Above Special`, value: `above_special`},
          {text: `Below Special`, value: `below_special`},
        ])
      },
    },
    auto_restore: {
      name: `Auto-Restore`,
      type: `menu`,
      value: `action`,
      info: `When to auto-restore after the mouse leaves the window
      Or if it should restore instantly after an action
      Restore means going back to the main mode and clearing the filter`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Never`, value: `never`},
          {text: App.separator_string},
          {text: `1 Second`, value: `1_seconds`},
          {text: `3 Seconds`, value: `3_seconds`},
          {text: `5 Seconds`, value: `5_seconds`},
          {text: `10 Seconds`, value: `10_seconds`},
          {text: `30 Seconds`, value: `30_seconds`},
          {text: App.separator_string},
          {text: `On Action`, value: `action`},
        ], () => {
          clearTimeout(App.restore_timeout)
        })
      },
    },
    width: {
      name: `Popup Width`,
      type: `menu`,
      value: 75,
      actions: [`theme`],
      info: `Width of the popup
      It doesn't affect the sidebar`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.get_size_options())
      },
    },
    height: {
      name: `Popup Height`,
      type: `menu`,
      value: 90,
      actions: [`theme`],
      info: `Height of the popup
      It doesn't affect the sidebar`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.get_size_options())
      },
    },
    prompt_mode: {
      name: `Prompt Mode`,
      type: `menu`,
      value: `at_end`,
      info: `Controls the position of the caret and higlight mode on text prompts`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `At Start`, value: `at_start`},
          {text: `At End`, value: `at_end`},
          {text: `Highlight`, value: `highlight`},
        ])
      },
    },
    domain_rules: {
      name: `Domain Rules`,
      type: `list`,
      value: [],
      info: `Apply rules to domains automatically, like color, title, and tags`,
      version: 1,
    },
    custom_urls: {
      name: `Custom URLs`,
      type: `list`,
      value: [
        {_id_: `store`, name: `Store`, url: `https://addons.mozilla.org/firefox/addon/grasshopper-urls`, icon: `🦊`},
        {_id_: `repo`, name: `Repo`, url: `https://github.com/madprops/grasshopper`, icon: `🐙`},
      ],
      actions: [`commands`],
      info: `List of URLs that can be used in commands`,
      version: 1,
    },
    command_combos: {
      name: `Command Combos`,
      type: `list`,
      value: [],
      actions: [`commands`],
      info: `Define Command Combos here`,
      version: 1,
    },
    open_in_new_tab: {
      name: `Open In New Tab`,
      type: `checkbox`,
      value: true,
      info: `Open items like from History or Bookmarks in a new tab instead of on the same tab`,
      version: 1,
    },
    fetch_favicons: {
      name: `Fetch Favicons`,
      type: `checkbox`,
      value: true,
      info: `Fetch favicons from a public server on modes without local favicons`,
      version: 1,
    },
    smooth_scroll: {
      name: `Smooth Scroll`,
      type: `checkbox`,
      value: true,
      info: `Enable smooth list scrolling in some cases`,
      version: 1,
    },
    tab_blink: {
      name: `Tab Blink`,
      type: `checkbox`,
      value: true,
      info: `Blink when focusing tabs through certain actions when not directly clicking them`,
      version: 1,
    },
    wrap_text: {
      name: `Wrap Text`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Allow long lines to wrap into multiple lines, increasing the height of some items`,
      version: 1,
    },
    icon_pick: {
      name: `Icon Pick`,
      type: `checkbox`,
      value: false,
      info: `Clicking the icons (favicon) of items toggles select
      Right click an icon to deselect all items except that one
      Click and drag to select other items`,
      version: 1,
    },
    load_lock: {
      name: `Load Lock`,
      type: `checkbox`,
      value: false,
      info: `Require a double click or command to load`,
      version: 1,
    },
    click_select: {
      name: `Click Select`,
      type: `checkbox`,
      value: false,
      info: `Click to select without triggering an action`,
      version: 1,
    },
    lock_drag: {
      name: `Lock Drag`,
      type: `checkbox`,
      value: false,
      info: `Require holding Ctrl to drag tab items vertically
      This is to avoid accidental re-ordering`,
      version: 1,
    },
    auto_blur: {
      name: `Auto Blur`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Blur the sidebar automatically then the mouse moves out, for privacy`,
      version: 1,
    },
    sound_effects: {
      name: `Sound Effects`,
      type: `checkbox`,
      value: false,
      info: `Enable some sound effects on certain actions`,
      version: 1,
    },
  }

  add_props()
  category = `theme`

  props = {
    text_color: {
      name: `Text Color`,
      type: `color`,
      value: App.dark_colors.text,
      actions: [`theme`],
      info: `Main color to use for the text`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key)
      },
    },
    background_color: {
      name: `Background Color`,
      type: `color`,
      value: App.dark_colors.background,
      actions: [`theme`],
      info: `Main color to use for the background`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key)
      },
    },
    background_image: {
      name: `Background Image`,
      type: `text`,
      value: `Background 1`,
      actions: [`theme`],
      placeholder: `Image URL`,
      btns: [`pick`],
      info: `The background image below the background color
      Pick from the list or enter a URL`,
      version: 1,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_background(e)
        })
      },
    },
    background_effect: {
      name: `Background Effect`,
      type: `menu`,
      value: `none`,
      actions: [`theme`],
      info: `The effect on the background image`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.background_effects)
      },
    },
    background_tiles: {
      name: `Background Tiles`,
      type: `menu`,
      value: `none`,
      actions: [`theme`],
      info: `The tile size of the background image`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `50px`, value: `50px`},
          {text: `100px`, value: `100px`},
          {text: `150px`, value: `150px`},
          {text: `200px`, value: `200px`},
          {text: `250px`, value: `250px`},
          {text: `300px`, value: `300px`},
          {text: `350px`, value: `350px`},
          {text: `400px`, value: `400px`},
          {text: `450px`, value: `450px`},
          {text: `500px`, value: `500px`},
        ])
      },
    },
    background_opacity: {
      name: `Background Opacity`,
      type: `menu`,
      value: 90,
      actions: [`theme`],
      placeholder: `Opacity`,
      info: `The lower the number, the more the background image is shown`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(0, 100, 5))
      },
    },
    font: {
      name: `Font`,
      type: `text`,
      actions: [`theme`],
      value: `Nova Square`,
      placeholder: `Font Name`,
      btns: [`pick`],
      no_empty: true,
      info: `Font to use for the text
      Pick from the list, or enter a Google Font name, or enter a font URL`,
      version: 1,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_font(e)
        })
      },
    },
    font_size: {
      name: `Font Size`,
      type: `menu`,
      value: App.default_font_size,
      actions: [`theme`],
      placeholder: `Px`,
      info: `The font size in pixels to use for text
      The interface scales accordingly`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(6, 28, 1))
      },
    },
    custom_css: {
      name: `Custom CSS`,
      type: `textarea`,
      actions: [`theme`],
      value: ``,
      placeholder: `Paste CSS Here`,
      info: `Add custom CSS to override the default style`,
      version: 1,
    },
    text_glow: {
      name: `Text Glow`,
      type: `checkbox`,
      actions: [`theme`],
      value: false,
      info: `Add a glow effect to all text`,
      version: 1,
    },
  }

  add_props()
  category = `bookmarks`

  props = {
    bookmarks_folder: {
      name: `Bookmarks Folder`,
      type: `text`,
      value: `Grasshopper`,
      placeholder: `Folder Name`,
      no_empty: true,
      info: `Where to save bookmarks`,
      version: 1,
    },
    bookmark_rules: {
      name: `Bookmark Rules`,
      type: `list`,
      value: [],
      info: `Save bookmarks on certain folders based on rules`,
      version: 2,
    },
    max_bookmark_folders: {
      name: `Max Bookmark Folders`,
      type: `number`,
      value: 100,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max bookmark folders to fetch`,
      version: 1,
    },
    bookmarks_footer_folder: {
      name: `Bookmarks Footer`,
      type: `number`,
      value: 10,
      placeholder: `Number`,
      min: 0,
      max: 100,
      info: `How long the bookmarks folder info in the footer of Bookmarks can be
      Set it to 0 to not display it at all`,
      version: 1,
    },
    all_bookmarks: {
      name: `All Bookmarks`,
      type: `checkbox`,
      value: true,
      info: `Show other bookmarks apart from the configured bookmarks folder
      When entering Bookmarks mode`,
      version: 1,
    },
    direct_bookmarks_folder: {
      name: `Direct Bookmarks`,
      type: `checkbox`,
      value: false,
      info: `Create new bookmark folders at the default root instead of asking for location`,
      version: 1,
    },
  }

  add_props()
  category = `media`

  props = {
    image_icon: {
      name: `View Image Icon`,
      type: `text_smaller`,
      value: `🖼️`,
      placeholder: App.icon_placeholder,
      info: `Media icon for images`,
      version: 1,
    },
    view_image_tabs: {
      name: `View Image (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in Tabs mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_image_history: {
      name: `View Image (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in History mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_image_bookmarks: {
      name: `View Image (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in Bookmarks mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_image_closed: {
      name: `View Image (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an image in Closed mode`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    video_icon: {
      name: `View Video Icon`,
      type: `text_smaller`,
      value: `▶️`,
      placeholder: App.icon_placeholder,
      info: `Media icon for videos`,
      version: 1,
    },
    view_video_tabs: {
      name: `View Video (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in Tabs mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_video_history: {
      name: `View Video (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in History mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_video_bookmarks: {
      name: `View Video (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in Bookmarks mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_video_closed: {
      name: `View Video (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on a video in Closed mode`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    audio_icon: {
      name: `View Audio Icon`,
      type: `text_smaller`,
      value: `🎵`,
      placeholder: App.icon_placeholder,
      info: `Media icon for audio`,
      version: 1,
    },
    view_audio_tabs: {
      name: `View Audio (Tabs)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in Tabs mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_audio_history: {
      name: `View Audio (History)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in History mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_audio_bookmarks: {
      name: `View Audio (Bookmarks)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in Bookmarks mode`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    view_audio_closed: {
      name: `View Audio (Closed)`,
      type: `menu`,
      value: `icon`,
      info: `What to do when clicking on an audio in Closed mode`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.media_modes)
      },
    },
    filter_media: {
      name: `Filter Media`,
      type: `checkbox`,
      value: true,
      info: `Consider media when using the filter normally, like typing 'image'`,
      version: 1,
    },
  }

  add_props()
  category = `icons`

  props = {
    active_icon: {
      name: `Active Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for active tabs
      Active means the current visible tab in the browser`,
      version: 1,
    },
    active_icon_side: {
      name: `Active Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Active Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    active_icon_show: {
      name: `Active Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Active Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    pin_icon: {
      name: `Pin Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for pinned tabs`,
      version: 1,
    },
    pin_icon_side: {
      name: `Pin Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Pin Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    pin_icon_show: {
      name: `Pin Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Pin Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    normal_icon: {
      name: `Normal Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for normal tabs`,
      version: 1,
    },
    normal_icon_side: {
      name: `Normal Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Normal Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    normal_icon_show: {
      name: `Normal Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Normal Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    playing_icon: {
      name: `Playing Icon`,
      type: `text_smaller`,
      value: `🔊`,
      placeholder: App.icon_placeholder,
      info: `Icons for tabs emitting sound`,
      version: 1,
    },
    playing_icon_side: {
      name: `Playing Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Playing Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    playing_icon_show: {
      name: `Playing Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Playing Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    muted_icon: {
      name: `Muted Icon`,
      type: `text_smaller`,
      value: `🔇`,
      placeholder: App.icon_placeholder,
      info: `Icons for muted tabs`,
      version: 1,
    },
    muted_icon_side: {
      name: `Muted Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Muted Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    muted_icon_show: {
      name: `Muted Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Muted Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    unloaded_icon: {
      name: `Unloaded Icon`,
      type: `text_smaller`,
      value: `💤`,
      info: `Icons for unloaded tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    unloaded_icon_side: {
      name: `Unloaded Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Unloaded Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    unloaded_icon_show: {
      name: `Unloaded Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Unloaded Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    loading_icon: {
      name: `Loading Icon`,
      type: `text_smaller`,
      value: `⏳`,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs that are still loading`,
      version: 1,
    },
    loading_icon_side: {
      name: `Loading Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Loading Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    loading_icon_show: {
      name: `Loading Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Loading Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    loaded_icon: {
      name: `Loaded Icon`,
      type: `text_smaller`,
      value: ``,
      info: `Icons for loaded tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    loaded_icon_side: {
      name: `Loaded Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Loaded Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    loaded_icon_show: {
      name: `Loaded Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Loaded Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    unread_icon: {
      name: `Unread Icon`,
      type: `text_smaller`,
      value: `⭕`,
      info: `Icons for unread tabs`,
      placeholder: App.icon_placeholder,
      version: 1,
    },
    unread_icon_side: {
      name: `Unread Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Unread Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    unread_icon_show: {
      name: `Unread Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Unread Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    titled_icon: {
      name: `Titled Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs with a custom title`,
      version: 1,
    },
    titled_icon_side: {
      name: `Titled Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Titled Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    titled_icon_show: {
      name: `Titled Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Titled Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    tagged_icon: {
      name: `Tagged Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for tagged tabs`,
      version: 1,
    },
    tagged_icon_side: {
      name: `Tagged Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Tagged Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    tagged_icon_show: {
      name: `Tagged Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Tagged Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    notes_icon: {
      name: `Notes Icon`,
      type: `text_smaller`,
      value: `📝`,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs with notes`,
      version: 1,
    },
    notes_icon_side: {
      name: `Notes Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Notes Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    notes_icon_show: {
      name: `Notes Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Notes Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    edited_icon: {
      name: `Edited Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for edited tabs
      Edits include color, tags, notes, etc`,
      version: 1,
    },
    edited_icon_side: {
      name: `Edited Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Edited Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    edited_icon_show: {
      name: `Edited Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Edited Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    parent_icon: {
      name: `Parent Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs that are parents`,
      version: 1,
    },
    parent_icon_side: {
      name: `Parent Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Parent Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    parent_icon_show: {
      name: `Parent Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Parent Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    node_icon: {
      name: `Node Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs that are nodes`,
      version: 1,
    },
    node_icon_side: {
      name: `Nodes Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Nodes Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    node_icon_show: {
      name: `Nodes Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Nodes Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    root_icon: {
      name: `Root Icon`,
      type: `text_smaller`,
      value: `🌀`,
      placeholder: App.icon_placeholder,
      info: `Icon for tabs with a root`,
      version: 1,
    },
    root_icon_side: {
      name: `Root Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Root Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    root_icon_show: {
      name: `Root Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Root Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    custom_icon_side: {
      name: `Custom Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Custom Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides_2)
      },
    },
    custom_icon_show: {
      name: `Custom Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Custom Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    notes_icon_click: {
      name: `Notes Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Show the notes when clicking the notes icon`,
      version: 1,
    },
    parent_icon_click: {
      name: `Parent Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Go to the item's nodes`,
      version: 1,
    },
    node_icon_click: {
      name: `Nodes Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Show the item's parent`,
      version: 1,
    },
    root_icon_click: {
      name: `Root Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Go to the root when clicking the root icon`,
      version: 1,
    },
    custom_icon_click: {
      name: `Custom Icon Click`,
      type: `checkbox`,
      value: true,
      info: `Show a menu when clicking the custom icons`,
      version: 1,
    },
    auto_root_icon: {
      name: `Auto Root Icon`,
      type: `checkbox`,
      value: true,
      info: `Show the root icon only when not at the root already`,
      version: 1,
    },
    button_icons: {
      name: `Button Icons`,
      type: `checkbox`,
      value: true,
      actions: [`theme`],
      info: `Show icons next to the text on the buttons, like on the Main Menu or Settings`,
      version: 1,
    },
    generate_icons: {
      name: `Generate Icons`,
      type: `checkbox`,
      value: true,
      info: `Generate icons if favicons are not found`,
      version: 1,
    },
  }

  add_props()
  category = `show`

  props = {
    clock: {
      name: `Clock`,
      type: `menu`,
      value: `show_12`,
      info: `Show the time in the Filter input`,
      no_mirror: true,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `12 hours`, value: `show_12`},
          {text: `24 hours`, value: `show_24`},
        ])
      },
    },
    show_pinline: {
      name: `Show Pinline`,
      type: `menu`,
      value: `auto`,
      info: `Show a separator between pinned and normal tabs`,
      version: 3,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Never`, value: `never`},
          {text: `Auto`, value: `auto`},
          {text: `Always`, value: `always`},
        ])
      },
    },
    pinline_menu: {
      name: `Pinline Menu`,
      type: `list`,
      value: [
        {cmd: `new_pinned_tab`},
        {cmd: `select_pinned_tabs`},
        {cmd: `select_normal_tabs`},
        {cmd: `select_unloaded_tabs`},
        {cmd: `select_all_items`},
      ],
      info: `Menu to show when clicking the Pinline`,
      separator: true,
      version: 1,
    },
    show_tooltips: {
      name: `Show Tooltips`,
      type: `checkbox`,
      value: true,
      info: `Show tooltips when hovering items`,
      version: 1,
    },
    show_scroller: {
      name: `Show Scroller`,
      type: `checkbox`,
      value: true,
      info: `Show a button at the top of a scrolled list to return to the top`,
      version: 1,
    },
    show_feedback: {
      name: `Show Feedback`,
      type: `checkbox`,
      value: true,
      info: `Show feedback messages on certain actions`,
      version: 1,
    },
    hide_pins: {
      name: `Hide Pins`,
      type: `checkbox`,
      value: false,
      info: `Don't show the pins in All filter mode.
      Might be used in combination with the Tab Box or Show Pins`,
      version: 1,
    },
    active_trace: {
      name: `Active Trace`,
      type: `checkbox`,
      value: false,
      info: `Show numbers as a trace on recently used tabs
      It goes from 1 to 9`,
      version: 1,
    },
    show_scrollbars: {
      name: `Show Scrollbars`,
      type: `checkbox`,
      value: false,
      info: `Show the regular scrollbars
      Else scrollbars are disabled`,
      version: 1,
    },
  }

  add_props()
  category = `close`

  props = {
    close_button: {
      name: `Close Button`,
      type: `menu`,
      value: `right`,
      info: `How to show the Close Button on tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
          {text: App.separator_string},
          {text: `Left Hover`, value: `left_hover`},
          {text: `Right Hover`, value: `right_hover`},
        ])
      },
    },
    close_button_menu: {
      name: `Close Button Menu`,
      type: `list`,
      value: [
        {cmd: `filter_node_tabs`},
        {cmd: `filter_domain`},
        {cmd: `filter_color`},
        {cmd: `duplicate_tabs`},
        {cmd: `unload_tabs`},
        {cmd: `settings_category_close`},
      ],
      info: `Menu to show when clicking the Close Button`,
      version: 1,
    },
    close_button_menu_2: {
      name: `Close Button Menu 2`,
      type: `list`,
      value: [
        {cmd: `filter_domain`},
        {cmd: `search_domain_history`},
        {cmd: `search_domain_bookmarks`},
      ],
      info: `Menu to show when long pressing the Close Button`,
      version: 1,
    },
    middle_click_close_button: {
      name: `Middle Click Close`,
      type: `menu`,
      value: `unload_tabs`,
      info: `Command to run when middle clicking the Close Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    close_button_padding: {
      name: `Close Button Padding`,
      type: `number`,
      value: 13,
      placeholder: `Px`,
      min: 0,
      max: App.max_padding_setting,
      info: `Horizontal padding for the Close Buttons`,
      version: 1,
    },
    close_icon: {
      name: `Close Icon`,
      type: `text_smaller`,
      value: `x`,
      placeholder: App.icon_placeholder,
      info: `Icon for the close buttons`,
      version: 1,
    },
  }

  add_props()
  category = `hover`

  props = {
    hover_button: {
      name: `Hover Button`,
      type: `menu`,
      value: `none`,
      info: `This is a button that appears on the side of items, to run commands`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
        ])
      },
    },
    hover_menu: {
      name: `Hover Menu`,
      type: `list`,
      value: [
        {cmd: `filter_node_tabs`},
        {cmd: `filter_domain`},
        {cmd: `filter_color`},
        {cmd: `duplicate_tabs`},
        {cmd: `unload_tabs`},
        {cmd: `settings_category_hover`},
      ],
      info: `Menu to show when clicking the Hover Button`,
      version: 1,
    },
    hover_menu_2: {
      name: `Hover Menu 2`,
      type: `list`,
      value: [
        {cmd: `filter_domain`},
        {cmd: `search_domain_history`},
        {cmd: `search_domain_bookmarks`},
      ],
      info: `Menu to show when long pressing or right clicking the Hover Button`,
      version: 1,
    },
    middle_click_hover_button: {
      name: `Middle Click Hover`,
      type: `menu`,
      value: `close_tabs`,
      info: `Command to run when middle clicking the Hover Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    hover_button_padding: {
      name: `Hover Button Padding`,
      type: `number`,
      value: 7,
      placeholder: `Px`,
      min: 0,
      max: App.max_padding_setting,
      info: `Horizontal padding for the Hover Buttons`,
      version: 1,
    },
    hover_icon: {
      name: `Hover Icon`,
      type: `text_smaller`,
      value: `🔆`,
      placeholder: App.icon_placeholder,
      info: `Icon for the hover buttons`,
      version: 1,
    },
    hover_button_pick: {
      name: `Hover Button Pick`,
      type: `checkbox`,
      value: true,
      info: `Pick items when right clicking the Hover Button`,
      version: 1,
    },
  }

  add_props()
  category = `menus`

  props = {
    global_menu: {
      name: `Global Menu`,
      type: `list`,
      value: [],
      info: `Make this the menu for all modes
      If this has items it overrides all other mode menus`,
      version: 1,
    },
    tabs_menu: {
      name: `Tabs Menu`,
      type: `list`,
      value: [
        {cmd: `open_new_tab`},
        {cmd: `reopen_tab`},
        {cmd: App.separator_string},
        {cmd: `sort_tabs`},
        {cmd: `show_tabs_info`},
        {cmd: `open_tab_urls`},
        {cmd: `show_tab_urls`},
        {cmd: App.separator_string},
        {cmd: `export_tabs`},
        {cmd: `import_tabs`},
        {cmd: App.separator_string},
        {cmd: `show_close_tabs_menu`},
      ],
      info: `Menu to show when clicking the tabs menu`,
      version: 1,
    },
    history_menu: {
      name: `History Menu`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `show_search_media_menu`},
      ],
      info: `Menu to show when clicking the history menu`,
      version: 1,
    },
    bookmarks_menu: {
      name: `Bookmarks Menu`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `show_search_media_menu`},
        {cmd: `bookmark_page`},
        {cmd: `pick_bookmarks_folder`},
      ],
      info: `Menu to show when clicking the bookmarks menu`,
      version: 1,
    },
    closed_menu: {
      name: `Closed Menu`,
      type: `list`,
      value: [
        {cmd: `forget_closed`},
      ],
      info: `Menu to show when clicking the closed menu`,
      version: 1,
    },
    empty_menu: {
      name: `Empty Menu`,
      type: `list`,
      value: [
        {cmd: `open_new_tab`},
        {cmd: `reopen_tab`},
        {cmd: `select_all_items`},
      ],
      separator: true,
      info: `Menu to show when right clicking empty space`,
      version: 1,
    },
    extra_menu_mode: {
      name: `Extra Menu Mode`,
      type: `menu`,
      value: `none`,
      info: `How to show the Extra Menu on right click
      Either on its own submenu, flat at the root level, or totally replace the Item Menu`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Normal`, value: `normal`},
          {text: `Flat`, value: `flat`},
          {text: `Total`, value: `total`},
        ])
      },
    },
    extra_menu: {
      name: `Extra Menu`,
      type: `list`,
      separator: true,
      value: [
        {cmd: `open_new_tab`, middle: `insert_header`},
        {cmd: `add_jump_tag_1`, middle: `remove_jump_tag_1`},
      ],
      info: `Extra menu to show when right clicking items`,
      version: 4,
    },

    ...App.settings_generic_menus(),
  }

  add_props()
  category = `tab_box`

  props = {
    show_tab_box: {
      name: `Show Tab Box`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Enable or disable the Tab Box`,
      version: 3,
    },
    tab_box_position: {
      name: `Tab Box Position`,
      type: `menu`,
      value: `bottom`,
      no_mirror: true,
      info: `The position of the Tab Box`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Top`, value: `top`},
          {text: `Bottom`, value: `bottom`},
        ])
      },
    },
    tab_box_size: {
      name: `Tab Box Size`,
      type: `menu`,
      value: `normal`,
      no_mirror: true,
      info: `The size of the Tab Box`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_2)
      },
    },
    tab_box_mode: {
      name: `Tab Box Mode`,
      type: `menu`,
      value: `recent`,
      no_mirror: true,
      info: `What to show in the Tab Box`,
      version: 4,
      setup: (key) => {
        App.settings_make_menu(key, App.get_setting_tab_box_modes())
      },
    },
    tab_box_hover_effect: {
      name: `Tab Box Hover Effect`,
      type: `menu`,
      value: `glow`,
      info: `What effect to show on hovered items in the Tab Box`,
      version: 4,
      setup: (key) => {
        App.settings_make_menu(key, App.effects)
      },
    },
    tab_box_active_effect: {
      name: `Tab Box Active Effect`,
      type: `menu`,
      value: `underline`,
      info: `What effect to show on active items in the Tab Box`,
      version: 4,
      setup: (key) => {
        App.settings_make_menu(key, App.effects)
      },
    },
    tab_box_auto_grow: {
      name: `Tab Box Auto Grow`,
      type: `menu`,
      value: `none`,
      info: `Grow the Tab Box when the mouse enters, restore it when the mouse leaves`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Normal`, value: `normal`},
          {text: `Big`, value: `big`},
          {text: `Huge`, value: `huge`},
        ])
      },
    },
    tab_box_auto_shrink: {
      name: `Tab Box Auto Shrink`,
      type: `menu`,
      value: `none`,
      info: `Shrink the Tab Box automatically when it has no items`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
        ])
      },
    },
    tab_box_color_mode: {
      name: `Tab Box Color Mode`,
      type: `menu`,
      value: `icon`,
      separator: true,
      info: `The color mode inside the Tab Box
      For colors like green, red, etc`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_displays)
      },
    },
    tab_box_color_enabled: {
      name: `Tab Box Color`,
      type: `checkbox`,
      value: false,
      info: `Enable the background color of the Tab Box`,
      version: 1,
    },
    tab_box_color: {
      name: `Tab Box Color`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Background color of the Tab Box`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    tab_box_max: {
      name: `Tab Box Max`,
      type: `number`,
      value: 20,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in the Tab Box`,
      version: 1,
    },
    tab_box_icons: {
      name: `Tab Box Icons`,
      type: `checkbox`,
      value: true,
      info: `Enable icons in the items of the Tab Box
      This means icons like muted, or notes`,
      version: 1,
    },
    tab_box_taglist: {
      name: `Tab Box Taglist`,
      type: `checkbox`,
      value: true,
      info: `Enable the Taglist in the items of the Tab Box`,
      version: 1,
    },
    tab_box_focus: {
      name: `Tab Box Focus`,
      type: `checkbox`,
      value: true,
      info: `Focus the tab that was activated through the Tab Box`,
      version: 1,
    },
    tab_box_scroll: {
      name: `Tab Box Scroll`,
      type: `checkbox`,
      value: true,
      info: `Scroll to the top of the Tab Box in certain modes`,
      version: 1,
    },
    tab_box_blur: {
      name: `Tab Box Blur`,
      type: `checkbox`,
      value: true,
      info: `Add a blur effect to the title of the Tab Box`,
      version: 1,
    },
    tab_box_count: {
      name: `Tab Box Count`,
      type: `checkbox`,
      value: true,
      info: `Show the number of items in the Tab Box`,
      version: 1,
    },
    tab_box_wheel: {
      name: `Tab Box Wheel`,
      type: `checkbox`,
      value: false,
      info: `Change the Tab Box mode when using the mousewheel`,
      version: 1,
    },
    tab_box_headers: {
      name: `Tab Box Headers`,
      type: `checkbox`,
      value: false,
      info: `Show headers in the Tab Box on all modes`,
      version: 1,
    },
    tab_box_auto_playing: {
      name: `Tab Box Auto Playing`,
      type: `checkbox`,
      value: false,
      info: `Auto show the Tab Box when a tab is playing`,
      version: 1,
    },
  }

  add_props()
  category = `footer`

  props = {
    show_footer: {
      name: `Show Footer`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Show a footer at the bottom with some information
      Clicking this scrolls the item list to the bottom`,
      version: 1,
    },
    footer_menu: {
      name: `Footer Menu`,
      type: `list`,
      value: [
        {cmd: `copy_item_url`},
        {cmd: `copy_item_title`},
        {cmd: `settings_category_footer`},
      ],
      info: `Menu to show when right clicking the footer`,
      version: 1,
    },
    footer_position: {
      name: `Footer Position`,
      type: `menu`,
      value: `bottom`,
      info: `Where to place the Footer`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Top`, value: `top`},
          {text: `Bottom`, value: `bottom`},
        ])
      },
    },
    footer_align: {
      name: `Footer Align`,
      type: `menu`,
      value: `left`,
      info: `How to align the footer text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Left`, value: `left`},
          {text: `Center`, value: `center`},
          {text: `Right`, value: `right`},
        ])
      },
    },
    click_footer: {
      name: `Click Footer`,
      type: `menu`,
      value: `go_to_bottom`,
      info: `Command to run when clicking the Footer`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_footer: {
      name: `Middle Click Footer`,
      type: `menu`,
      value: `copy_item_url`,
      info: `Command to run when middle clicking the Footer`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_footer: {
      name: `Wheel Up Footer`,
      type: `menu`,
      value: `scroll_up`,
      info: `Command to run when using the mousewheel up on the Footer`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_footer: {
      name: `Wheel Down Footer`,
      type: `menu`,
      value: `scroll_down`,
      info: `Command to run when using the mousewheel down on the Footer`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_shift_footer: {
      name: `Shift Wheel Up Footer`,
      type: `menu`,
      value: `page_up`,
      info: `Command to run when using the mousewheel up on the Footer while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_shift_footer: {
      name: `Shift Wheel Down Footer`,
      type: `menu`,
      value: `page_down`,
      info: `Command to run when using the mousewheel down on the Footer while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    show_footer_count: {
      name: `Count In Footer`,
      type: `checkbox`,
      value: true,
      info: `Show the item count on the Footer`,
      version: 1,
    },
  }

  add_props()
  category = `favorites`

  props = {
    show_favorites: {
      name: `Show Favorites`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Enable or disable the Favorites bar or button`,
      version: 2,
    },
    favorites_menu: {
      name: `Favorites Menu`,
      type: `list`,
      value: [
        {cmd: `show_recent_tabs`, middle: `filter_unread_tabs`},
        {cmd: `show_pinned_tabs`, middle: `filter_pinned_tabs`},
        {cmd: `show_color_red`, middle: `filter_color_red`},
        {cmd: `show_color_green`, middle: `filter_color_green`},
        {cmd: `show_color_blue`, middle: `filter_color_blue`},
        {cmd: `set_random_dark_colors`, middle: `set_random_light_colors`},
        {cmd: `edit_notes`, middle: `edit_global_notes`},
        {cmd: `toggle_auto_blur`, middle: `toggle_favorites_autohide`},
      ],
      info: `List of commands that can appear in various forms`,
      version: 1,
    },
    favorites_position: {
      name: `Favorites Position`,
      type: `menu`,
      value: `left`,
      no_mirror: true,
      separator: true,
      info: `How to show the Favorites Menu
      Either a bar, or a button at the top right`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Top`, value: `top`},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
          {text: `Bottom`, value: `bottom`},
          {text: App.separator_string},
          {text: `Button`, value: `button`},
        ])
      },
    },
    favorites_bar_color_enabled: {
      name: `Favorites Bar Color`,
      type: `checkbox`,
      value: false,
      info: `Enable the background color of the Favorites Bar`,
      version: 1,
    },
    favorites_bar_color: {
      name: `Favorites Bar Color`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      info: `Background color of the Favorites Bar`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    double_click_favorites_top: {
      name: `Double Click Fav Top`,
      type: `menu`,
      value: `open_new_tab`,
      info: `Command to run when double clicking the top empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_favorites_top: {
      name: `Middle Click Fav Top`,
      type: `menu`,
      value: `close_tabs`,
      info: `Command to run when middle clicking the top empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_favorites_top: {
      name: `Wheel Up Fav Top`,
      type: `menu`,
      value: `scroll_up`,
      info: `Command to run when using the mousewheel up on the top empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_favorites_top: {
      name: `Wheel Down Fav Top`,
      type: `menu`,
      value: `scroll_down`,
      info: `Command to run when using the mousewheel down on the top empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_shift_favorites_top: {
      name: `Shift Wheel Up Fav Top`,
      type: `menu`,
      value: `page_up`,
      info: `Command to run when using the mousewheel up on the top area of the Favorites Bar while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_shift_favorites_top: {
      name: `Shift Wheel Down Fav Top`,
      type: `menu`,
      value: `page_down`,
      info: `Command to run when using the mousewheel down on the top area of the Favorites Bar while holding Shift`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_favorites_center: {
      name: `Wheel Up Fav Center`,
      type: `menu`,
      value: `scroll_up`,
      info: `Command to run when using the mousewheel up on the center area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_favorites_center: {
      name: `Wheel Down Fav Center`,
      type: `menu`,
      value: `scroll_down`,
      info: `Command to run when using the mousewheel down on the center area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_shift_favorites_center: {
      name: `Shift Wheel Up Fav Center`,
      type: `menu`,
      value: `page_up`,
      info: `Command to run when using the mousewheel up on the center area of the Favorites Bar while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_shift_favorites_center: {
      name: `Shift Wheel Down Fav Center`,
      type: `menu`,
      value: `page_down`,
      info: `Command to run when using the mousewheel down on the center area of the Favorites Bar while holding Shift`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    double_click_favorites_bottom: {
      name: `Double Click Fav Bottom`,
      type: `menu`,
      value: `open_new_tab`,
      info: `Command to run when double clicking the bottom empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_favorites_bottom: {
      name: `Middle Click Fav Bottom`,
      type: `menu`,
      value: `close_tabs`,
      info: `Command to run when middle clicking the bottom empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_favorites_bottom: {
      name: `Wheel Up Fav Bottom`,
      type: `menu`,
      value: `scroll_up`,
      info: `Command to run when using the mousewheel up on the bottom empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_favorites_bottom: {
      name: `Wheel Down Fav Bottom`,
      type: `menu`,
      value: `scroll_down`,
      info: `Command to run when using the mousewheel down on the bottom empty area of the Favorites Bar`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_shift_favorites_bottom: {
      name: `Shift Wheel Up Fav Bottom`,
      type: `menu`,
      value: `page_up`,
      info: `Command to run when using the mousewheel up on the bottom area of the Favorites Bar while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_shift_favorites_bottom: {
      name: `Shift Wheel Down Fav Bottom`,
      type: `menu`,
      value: `page_down`,
      info: `Command to run when using the mousewheel down on the bottom area of the Favorites Bar while holding Shift`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_favorites_button: {
      name: `Middle Click Fav Button`,
      type: `menu`,
      value: `settings_category_favorites`,
      info: `Command to run when middle clicking the Favorites Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    favorites_gravity: {
      name: `Favorites Gravity`,
      type: `menu`,
      value: `center`,
      info: `Gravity of the items in side modes of the favorites bar
      Either make them stick to the top, center, or bottom`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Top`, value: `top`},
          {text: `Center`, value: `center`},
          {text: `Bottom`, value: `bottom`},
        ])
      },
    },
    favorites_blur: {
      name: `Favorites Blur`,
      type: `checkbox`,
      value: true,
      info: `Add a blur effect to the background of favorite bars`,
      version: 1,
    },
    favorites_autohide: {
      name: `Favorites Autohide`,
      type: `checkbox`,
      value: false,
      info: `Autohide the Favorites Bar when on left or right mode`,
      version: 1,
    },
  }

  add_props()
  category = `title`

  props = {
    show_main_title: {
      name: `Show The Title`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Show the Title at the top`,
      version: 1,
    },
    main_title: {
      name: `Title`,
      type: `text`,
      value: ``,
      no_mirror: true,
      placeholder: `Title At The Top`,
      info: `The text to show in the Title`,
      version: 1,
    },
    main_title_menu: {
      name: `Title Menu`,
      type: `list`,
      value: [
        {cmd: `copy_main_title`},
        {cmd: `edit_main_title`},
        {cmd: `toggle_main_title_date`},
        {cmd: App.separator_string},
        {cmd: `color_main_title_red`},
        {cmd: `color_main_title_green`},
        {cmd: `color_main_title_blue`},
        {cmd: `uncolor_main_title`},
        {cmd: App.separator_string},
        {cmd: `settings_category_title`},
      ],
      info: `Menu to show when right clicking the Title`,
      version: 1,
    },
    click_main_title: {
      name: `Click Title`,
      type: `menu`,
      value: `none`,
      info: `Command to run when clicking the Title`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    double_click_main_title: {
      name: `Double Click Title`,
      type: `menu`,
      value: `edit_main_title`,
      info: `Command to run when double clicking the Title`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_main_title: {
      name: `Middle Click Title`,
      type: `menu`,
      value: `toggle_main_title_date`,
      info: `Command to run when middle clicking the Title`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    main_title_align: {
      name: `Title Align`,
      type: `menu`,
      value: `center`,
      info: `How to align the Title`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.aligns)
      },
    },
    main_title_font_size: {
      name: `Title Font Size`,
      type: `menu`,
      value: App.default_font_size,
      placeholder: `Px`,
      info: `Font size for the Title`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(6, 28, 1))
      },
    },
    wrap_main_title: {
      name: `Wrap Title`,
      type: `checkbox`,
      value: false,
      separator: true,
      info: `Make the title text wrap on long titles`,
      version: 1,
    },
    main_title_colors: {
      name: `Title Colors`,
      type: `checkbox`,
      value: false,
      info: `Use custom colors on the Title`,
      version: 2,
    },
    main_title_text_color: {
      name: `Title Text Color`,
      type: `color`,
      value: App.default_color,
      info: `Text color of the Title`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    main_title_background_color: {
      name: `Title Background Color`,
      type: `color`,
      value: App.default_color,
      info: `Background color of the Title`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    main_title_date: {
      name: `Title Date`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Show the current date as the Title`,
      version: 2,
    },
    main_title_date_format: {
      name: `Title Date Format`,
      type: `text`,
      value: `dddd dS mmmm yyyy`,
      placeholder: `Date Format`,
      separator: true,
      info: `Format to use when showing the date as the Title`,
      version: 1,
    },
    main_title_auto_scroll: {
      name: `Title Auto Scroll`,
      type: `checkbox`,
      value: true,
      info: `Scroll left and right automatically on long titles`,
      version: 1,
    },
    main_title_scroll_amount: {
      name: `Title Scroll Amount`,
      type: `number`,
      value: 6,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many pixels to scroll when scrolling automatically`,
      version: 1,
    },
    main_title_scroll_delay: {
      name: `Title Scroll Delay`,
      type: `number`,
      value: 200,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How often in milliseconds to do an auto-scroll tick`,
      version: 1,
    },
    main_title_scroll_pause: {
      name: `Title Scroll Pause`,
      type: `number`,
      value: 1200,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Pause these milliseconds after reaching the edges when scrolling
      Or after manually scrolling`,
      version: 1,
    },
    wheel_up_main_title: {
      name: `Wheel Up Title`,
      type: `menu`,
      value: `scroll_main_title_left`,
      info: `Command to run when using the mousewheel up on the Title`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_main_title: {
      name: `Wheel Down Title`,
      type: `menu`,
      value: `scroll_main_title_right`,
      info: `Command to run when using the mousewheel down on the Title`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_shift_main_title: {
      name: `Shift Wheel Up Title`,
      type: `menu`,
      value: `previous_main_title_color`,
      info: `Command to run when using the mousewheel up on the Title while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_shift_main_title: {
      name: `Shift Wheel Down Title`,
      type: `menu`,
      value: `next_main_title_color`,
      info: `Command to run when using the mousewheel down on the Title while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
  }

  add_props()
  category = `taglist`

  props = {
    show_taglist: {
      name: `Show Taglist`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Enable or disable the Taglist`,
      version: 2,
    },
    taglist_position: {
      name: `Taglist Position`,
      type: `menu`,
      value: `below`,
      no_mirror: true,
      info: `Where to display the Taglist`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Above`, value: `above`},
          {text: `Below`, value: `below`},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
        ])
      },
    },
    taglist_mode: {
      name: `Taglist Mode`,
      type: `menu`,
      value: `filter`,
      info: `What to do when clicking the Taglist items`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Menu`, value: `menu`},
          {text: `Edit`, value: `edit`},
          {text: `Filter`, value: `filter`},
          {text: `Remove`, value: `remove`},
        ])
      },
    },
    taglist_add: {
      name: `Taglist Add`,
      type: `checkbox`,
      value: false,
      info: `Show the Taglist add button`,
      version: 1,
    },
    autohide_taglist: {
      name: `Autohide Taglist`,
      type: `checkbox`,
      value: false,
      info: `If the Taglist mode is above or below, only show tags when the item is selected`,
      version: 1,
    },
    sort_taglist: {
      name: `Sort Taglist`,
      type: `checkbox`,
      value: false,
      info: `Sort tags alphabetically in the Taglist`,
      version: 1,
    },
  }

  add_props()
  category = `gestures`

  props = {
    gestures_enabled: {
      name: `Gestures Enabled`,
      type: `checkbox`,
      value: true,
      info: `Enable mouse gestures`,
      actions: [`gestures`],
      version: 1,
    },
    gestures_threshold: {
      name: `Gestures Threshold`,
      type: `menu`,
      value: 10,
      info: `How sensitive gestures are`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Normal`, value: 10},
          {text: `Less Sensitive`, value: 100},
        ])
      },
    },
    gesture_up: {
      name: `Gesture Up`,
      type: `menu`,
      value: `go_to_top`,
      info: `Up gesture`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    gesture_down: {
      name: `Gesture Down`,
      type: `menu`,
      value: `go_to_bottom`,
      info: `Down gesture`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    gesture_left: {
      name: `Gesture Left`,
      type: `menu`,
      value: `show_previous_mode`,
      info: `Left gesture`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    gesture_right: {
      name: `Gesture Right`,
      type: `menu`,
      value: `show_next_mode`,
      info: `Right gesture`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    gesture_up_and_down: {
      name: `Gesture Up Down`,
      type: `menu`,
      value: `filter_all`,
      info: `Up and Down gesture`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    gesture_left_and_right: {
      name: `Gesture Left Right`,
      type: `menu`,
      value: `filter_domain`,
      info: `Left and Right gesture`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
  }

  add_props()
  category = `auxclick`

  props = {
    middle_click_tabs: {
      name: `Middle Click Tabs`,
      type: `menu`,
      value: `close_tabs`,
      info: `Command to run when middle clicking tab items`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_history: {
      name: `Middle Click History`,
      type: `menu`,
      value: `open_items`,
      info: `Command to run when middle clicking history items`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_bookmarks: {
      name: `Middle Click Bookmarks`,
      type: `menu`,
      value: `open_items`,
      info: `Command to run when middle clicking bookmark items`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_closed: {
      name: `Middle Click Closed`,
      type: `menu`,
      value: `open_items`,
      info: `Command to run when middle clicking closed items`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_main_menu: {
      name: `Middle Click Main Menu`,
      type: `menu`,
      value: `show_main_mode`,
      info: `Command to run when middle clicking the Main Menu`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_filter_menu: {
      name: `Middle Click Filter Menu`,
      type: `menu`,
      value: `previous_filter`,
      info: `Command to run when middle clicking the Filter Menu`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_actions_menu: {
      name: `Middle Click Actions`,
      type: `menu`,
      value: `browser_reload`,
      info: `Command to run when middle clicking the Actions Menu`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_actions: {
      name: `Wheel Up Actions`,
      type: `menu`,
      value: `jump_tabs_all_up`,
      info: `Command to run when using the mousewheel up on the Actions Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_actions: {
      name: `Wheel Down Actions`,
      type: `menu`,
      value: `jump_tabs_all_down`,
      info: `Command to run when using the mousewheel down on the Actions Button`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_playing: {
      name: `Middle Click Playing`,
      type: `menu`,
      value: `toggle_mute_tabs`,
      info: `Command to run when middle clicking the Playing Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_playing: {
      name: `Wheel Up Playing`,
      type: `menu`,
      value: `jump_tabs_playing_down`,
      info: `Command to run when using the mousewheel up on the Playing Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_playing: {
      name: `Wheel Down Playing`,
      type: `menu`,
      value: `jump_tabs_playing_up`,
      info: `Command to run when using the mousewheel down on the Playing Button`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_step_back: {
      name: `Middle Click Step Back`,
      type: `menu`,
      value: `recent_tabs_forwards`,
      info: `Command to run when middle clicking the Step Back Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_step_back: {
      name: `Wheel Up Step Back`,
      type: `menu`,
      value: `recent_tabs_forwards`,
      info: `Command to run when using the mousewheel up on the Step Back Button`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_step_back: {
      name: `Wheel Down Step Back`,
      type: `menu`,
      value: `recent_tabs_backwards`,
      info: `Command to run when using the mousewheel down on the Step Back Button`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_pinline: {
      name: `Middle Click Pinline`,
      type: `menu`,
      value: `close_normal_tabs`,
      info: `Command to run when middle clicking the Pinline`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
  }

  add_props()
  category = `warns`

  props = {
    warn_special_pinned: {
      name: `Pinned Special`,
      type: `checkbox`,
      value: true,
      info: `Treat pinned tabs as special`,
      version: 1,
    },
    warn_special_playing: {
      name: `Playing Special`,
      type: `checkbox`,
      value: true,
      info: `Treat playing tabs as special`,
      version: 1,
    },
    warn_special_header: {
      name: `Header Special`,
      type: `checkbox`,
      value: true,
      info: `Treat header tabs as special`,
      version: 1,
    },
    warn_special_edited: {
      name: `Edited Special`,
      type: `checkbox`,
      value: true,
      info: `Treat edited tabs as special`,
      version: 1,
    },
    warn_on_close_tabs: {
      name: `Warn On Close Tabs`,
      type: `menu`,
      value: `special`,
      info: `Warn when closing tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_unload_tabs: {
      name: `Warn On Unload Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unloading tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_pin_tabs: {
      name: `Warn On Pin Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when pinning tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_unpin_tabs: {
      name: `Warn On Unpin Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unpinning tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_duplicate_tabs: {
      name: `Warn Duplicate Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when duplicating tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_open: {
      name: `Warn On Open`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when opening items`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_bookmark: {
      name: `Warn On Bookmark`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when adding bookmarks`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_load_tabs: {
      name: `Warn On Load Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when loading tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_mute_tabs: {
      name: `Warn On Mute Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when muting tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_unmute_tabs: {
      name: `Warn On Unmute Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when unmuting tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_edit_tabs: {
      name: `Warn On Edit Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when changing custom tab properties, like color, title, etc`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_sort_tabs: {
      name: `Warn On Sort Tabs`,
      type: `menu`,
      value: `always`,
      info: `Warn when sorting tabs with reverse, asc, or desc`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    max_warn_limit: {
      name: `Max Warn Limit`,
      type: `number`,
      value: 25,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Force a confirm after these many items regardless of warn settings`,
      version: 1,
    },
  }

  add_props()
  category = `zones`

  props = {
    split_padding: {
      name: `Split Padding`,
      type: `checkbox`,
      value: true,
      info: `Add padding above or below splits`,
      version: 1,
    },
    double_click_header: {
      name: `Double Click Header`,
      type: `checkbox`,
      value: true,
      info: `Select the tab group of a header by double clicking on headers`,
      version: 1,
    },
    header_icon_pick: {
      name: `Header Icon Pick`,
      type: `checkbox`,
      value: true,
      info: `Enable the header icon pick to select the items below`,
      version: 1,
    },
    split_width: {
      name: `Split Width`,
      type: `menu`,
      value: 2,
      placeholder: `Number`,
      info: `The width of the split borders`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(1, 20, 1))
      },
    },
    header_action: {
      name: `Header Action`,
      type: `menu`,
      value: `activate`,
      info: `What to do when clicking a header`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Select`, value: `select`},
          {text: `Activate`, value: `activate`},
          {text: `First`, value: `first`},
        ])
      },
    },
    split_side: {
      name: `Split Side`,
      type: `menu`,
      value: `right`,
      info: `Which side to show the split side border`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
          {text: `Both`, value: `both`},
        ])
      },
    },
    header_icon: {
      name: `Header Icon`,
      type: `text_smaller`,
      value: `🚥`,
      placeholder: App.icon_placeholder,
      info: `Icon for header tabs
      Leave empty to use an arrow`,
      version: 1,
    },
    subheader_icon: {
      name: `Subheader Icon`,
      type: `text_smaller`,
      value: ``,
      placeholder: App.icon_placeholder,
      separator: true,
      info: `Icon for subheheader tabs
      Leave empty to use an arrow`,
      version: 1,
    },
    split_color_enabled: {
      name: `Split Color`,
      type: `checkbox`,
      value: false,
      info: `Use the split custom color
      Else use a proper color automatically`,
      version: 1,
    },
    split_color: {
      name: `Split Color`,
      hide_name: true,
      type: `color`,
      separator: true,
      value: App.default_color,
      info: `The color of the splits between tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_header_mode: {
      name: `Header Text Color`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for Header Tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_header: {
      name: `Header Text Color`,
      hide_name: true,
      type: `color`,
      separator: true,
      value: App.default_color,
      info: `Custom text color for Header Tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_header_mode: {
      name: `Header Background Color`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for Header Tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_header: {
      name: `Header Background Color`,
      hide_name: true,
      type: `color`,
      separator: true,
      value: App.default_color,
      info: `Custom background color for Header Tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_subheader_mode: {
      name: `Subheader Text Color`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for Subheader Tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_subheader: {
      name: `Subheader Text Color`,
      hide_name: true,
      type: `color`,
      separator: true,
      value: App.default_color,
      info: `Custom text color for Subheader Tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_subheader_mode: {
      name: `Subheader Background Color`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for Subheader Tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_subheader: {
      name: `Subheader Background Color`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      info: `Custom background color for Subheader Tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
  }

  add_props()
  category = `colors`

  props = {
    colors: {
      name: `Colors`,
      type: `list`,
      value: [
        {_id_: `red`, name: `Red`, value: `rgba(255, 0, 153, 1)`, text: `rgba(255, 255, 255, 1)`},
        {_id_: `green`, name: `Green`, value: `rgba(102, 204, 0, 1)`, text: `rgba(255, 255, 255, 1)`},
        {_id_: `blue`, name: `Blue`, value: `rgba(0, 153, 255, 1)`, text: `rgba(255, 255, 255, 1)`},
        {_id_: `yellow`, name: `Yellow`, value: `rgba(255, 153, 0, 1)`, text: `rgba(255, 255, 255, 1)`},
      ],
      actions: [`theme`, `commands`],
      info: `The list of colors that you can assign to items`,
      version: 2,
    },
    color_mode: {
      name: `Color Mode`,
      type: `menu`,
      value: `icon`,
      info: `How to display the colors (green, red, etc) you assign to tabs`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.color_displays)
      },
    },
    color_icon_side: {
      name: `Color Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Color Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides_2)
      },
    },
    color_icon_show: {
      name: `Color Icon Show`,
      type: `menu`,
      value: `always`,
      info: `When to show the Color Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_show)
      },
    },
    color_icon_click: {
      name: `Color Icon Click`,
      type: `checkbox`,
      value: true,
      separator: true,
      info: `Show the color menu by clicking a color icon`,
      version: 1,
    },
    text_color_active_mode: {
      name: `Active Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for active tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_active: {
      name: `Active Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for active tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_active_mode: {
      name: `Active Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for active tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_active: {
      name: `Active Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom background color for active tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_playing_mode: {
      name: `Playing Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for playing tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_playing: {
      name: `Playing Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for playing tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_playing_mode: {
      name: `Playing Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for playing tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_playing: {
      name: `Playing Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom background color for playing tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_unread_mode: {
      name: `Unread Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for unread tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_unread: {
      name: `Unread Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for unread tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_unread_mode: {
      name: `Unread Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for unread tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_unread: {
      name: `Unread Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom background color for unread tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_unloaded_mode: {
      name: `Unloaded Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for unloaded tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_unloaded: {
      name: `Unloaded Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for unloaded tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_unloaded_mode: {
      name: `Unloaded Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for unloaded tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_unloaded: {
      name: `Unloaded Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom background color for unloaded tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_loaded_mode: {
      name: `Loaded Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for loaded tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_loaded: {
      name: `Loaded Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for loaded tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_loaded_mode: {
      name: `Loaded Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for loaded tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_loaded: {
      name: `Loaded Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom background color for loaded tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_pinned_mode: {
      name: `Pinned Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for pins`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_pinned: {
      name: `Pinned Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for pins`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_pinned_mode: {
      name: `Pinned Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for pins`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_pinned: {
      name: `Pinned Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom background color for pins`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    text_color_normal_mode: {
      name: `Normal Tabs (Text)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom text color for normal tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    text_color_normal: {
      name: `Normal Tabs (Text)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      separator: true,
      info: `Custom text color for normal tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    background_color_normal_mode: {
      name: `Normal Tabs (Background)`,
      type: `menu`,
      value: `none`,
      info: `Use a custom background color for normal tabs`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_modes)
      },
    },
    background_color_normal: {
      name: `Normal Tabs (Background)`,
      hide_name: true,
      type: `color`,
      value: App.default_color,
      info: `Custom background color for normal tabs`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
  }

  add_props()
  category = `filter`

  props = {
    aliases: {
      name: `Aliases`,
      type: `list`,
      value: [
        {a: `planet`, b: `earth`},
      ],
      info: `Aliases to use when filtering items
      Searching for one will return results if the other matches`,
      version: 3,
    },
    custom_filters: {
      name: `Custom Filters`,
      type: `list`,
      value: [
        {filter: `re: (today|$day)`},
        {filter: `re: ($month|$year)`},
      ],
      info: `Pre-made filters to use
      These appear in the Custom section or by using the command`,
      version: 3,
    },
    favorite_filters: {
      name: `Favorite Filters`,
      type: `list`,
      value: [],
      info: `Use these when cycling the Filter Menu with the mousewheel, or right clicking the Filter Menu`,
      version: 1,
    },
    refine_filters: {
      name: `Refine Filters`,
      type: `list`,
      value: [
        {cmd: `filter_media_image`},
        {cmd: `filter_media_video`},
        {cmd: `filter_media_audio`},
      ],
      info: `This list appears when middle clicking the Filter input
      Used to further refine filtered items`,
      version: 1,
    },
    double_click_filter: {
      name: `Double Click Filter`,
      type: `menu`,
      value: `toggle_main_title`,
      info: `What command to run when double clicking the text filter`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    filter_effect: {
      name: `Filter Effect`,
      type: `menu`,
      value: `text`,
      info: `Make it clear there is a filter through contrast
      Either when there is a text filter, a mode filter, or both
      When active, the filter input gets a different color`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Text`, value: `text`},
          {text: `Mode`, value: `mode`},
          {text: `Both`, value: `both`},
        ])
      },
    },
    sticky_filter: {
      name: `Sticky Filter`,
      type: `menu`,
      value: `none`,
      info: `Remember the items that were last selected when switching filter views
      In activate mode it auto activates the items instead of just selecting them`,
      separator: true,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Select`, value: `select`},
          {text: `Activate`, value: `activate`},
        ])
      },
    },
    max_search_items_history: {
      name: `Max Search (History)`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to return on search modes (History)`,
      version: 1,
    },
    deep_max_search_items_history: {
      name: `Deep Search (History)`,
      type: `number`,
      value: 5000,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max search items to return on Deep Search (History)`,
      version: 1,
    },
    history_max_months: {
      name: `History Months`,
      type: `number`,
      value: 18,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many months back to consider when searching History`,
      version: 1,
    },
    deep_history_max_months: {
      name: `Deep History Months`,
      type: `number`,
      value: 54,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `How many months back to consider when searching History in Deep Search`,
      version: 1,
    },
    max_search_items_bookmarks: {
      name: `Max Search (Bookmarks)`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to return on search modes (Bookmarks)`,
      version: 1,
    },
    deep_max_search_items_bookmarks: {
      name: `Deep Search (Bookmarks)`,
      type: `number`,
      value: 5000,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Max search items to return on Deep Search (Bookmarks)`,
      version: 1,
    },
    filter_delay: {
      name: `Filter Delay`,
      type: `number`,
      value: 100,
      actions: [`filters`],
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on instant modes like Tabs and Closed (milliseconds)`,
      version: 1,
    },
    filter_delay_search: {
      name: `Search Delay`,
      type: `number`,
      value: 250,
      actions: [`filters`],
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `The filter delay on search modes like History and Bookmarks (milliseconds)`,
      version: 1,
    },
    max_filter_history: {
      name: `Max Filter History`,
      type: `number`,
      value: 10,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in the Filter History`,
      version: 1,
    },
    header_filter_context: {
      name: `Header Filter Context`,
      type: `number`,
      value: 2,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `How many tabs from each header to show when using the Header filter mode`,
      version: 1,
    },
    case_insensitive: {
      name: `Case Insensitive`,
      type: `checkbox`,
      value: true,
      info: `Make the filter case insensitive`,
      version: 1,
    },
    filter_context_menu: {
      name: `Filter Context`,
      type: `checkbox`,
      value: true,
      info: `Show a special menu when using right click on the Filter input`,
      version: 1,
    },
    filter_colors: {
      name: `Filter Colors`,
      type: `checkbox`,
      value: true,
      info: `Consider colors when using the filter normally, like typing 'red'`,
      version: 1,
    },
    filter_tags: {
      name: `Filter Tags`,
      type: `checkbox`,
      value: true,
      info: `Consider tags when using the filter normally, by typing a tag name`,
      version: 1,
    },
    reuse_filter: {
      name: `Reuse Filter`,
      type: `checkbox`,
      value: true,
      info: `Re-use the filter when moving across modes`,
      version: 1,
    },
    special_quotes: {
      name: `Special Quotes`,
      type: `checkbox`,
      value: true,
      info: `Use quotes to find exact words or phrases
      For example "dat" might match: His name was Dat
      Using them makes the filters 'by title' automatically
      Else use quotes as is`,
      version: 1,
    },
    auto_deep_search_history: {
      name: `Auto Deep History`,
      type: `checkbox`,
      value: false,
      info: `Do a deep search automatically when using a text query (History)`,
      version: 1,
    },
    auto_deep_search_bookmarks: {
      name: `Auto Deep Bookmarks`,
      type: `checkbox`,
      value: false,
      info: `Do a deep search automatically when using a text query (Bookmarks)`,
      version: 1,
    },
    clear_on_all: {
      name: `Clear On All`,
      type: `checkbox`,
      value: false,
      info: `Clear the filter when clicking All`,
      version: 1,
    },
    filter_enter: {
      name: `Filter Enter`,
      type: `checkbox`,
      value: false,
      info: `Require pressing Enter to trigger the filter`,
      version: 1,
    },
    favorite_filters_click: {
      name: `Favorite Filters Click`,
      type: `checkbox`,
      value: false,
      info: `Use the left click to show the Favorite Filters
      Use right click to open the Filter Menu instead`,
      version: 1,
    },
  }

  add_props()
  category = `triggers`

  props = {
    keyboard_shortcuts: {
      name: `Keyboard Shortcuts`,
      type: `list`,
      value: [],
      separator: true,
      info: `Extra keyboard shortcuts
      If these are triggered the default shortcuts get ignored`,
      version: 4,
    },
    double_click_item: {
      name: `Double Click`,
      type: `menu`,
      value: `item_action`,
      info: `What command to run when double clicking an item`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    left_click_press_item: {
      name: `Left Click Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing the left mouse button on an item for a short time`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    middle_click_press_item: {
      name: `Middle Click Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing the middle mouse button on an item for a short time`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    double_click_empty: {
      name: `Double Click Empty`,
      type: `menu`,
      value: `open_new_tab`,
      info: `What command to run when double clicking empty space`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    double_ctrl_command: {
      name: `Double Ctrl`,
      type: `menu`,
      value: `show_palette`,
      info: `What command to run when pressing Ctrl twice quickly`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    double_shift_command: {
      name: `Double Shift`,
      type: `menu`,
      value: `previous_filter`,
      info: `What command to run when pressing Shift twice quickly`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    ctrl_press_command: {
      name: `Ctrl Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing and holding Ctrl for a short time`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    shift_press_command: {
      name: `Shift Press`,
      type: `menu`,
      value: `none`,
      info: `What command to run when pressing and holding Shift for a short time`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_up_shift_items: {
      name: `Shift Wheel Up`,
      type: `menu`,
      value: `page_up`,
      info: `What to do when scrolling the mousewheel up on items while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_down_shift_items: {
      name: `Shift Wheel Down`,
      type: `menu`,
      value: `page_down`,
      info: `What to do when scrolling the mousewheel down on items while holding Shift`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    wheel_hover_item: {
      name: `Wheel Hover Item`,
      type: `checkbox`,
      value: true,
      separator: true,
      info: `Perform actions on the hovered item when using the mousewheel`,
      version: 1,
    },
    double_key_delay: {
      name: `Double Key Delay`,
      type: `number`,
      value: 350,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay to trigger a command when double pressing a key like Ctrl (milliseconds)
      The bigger the delay the easier it is to trigger the command`,
      version: 1,
    },
    key_press_delay: {
      name: `Key Press Delay`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay to trigger a command when long pressing a key like Ctrl (milliseconds)
      This is the amount of time to hold the key down to trigger the command`,
      version: 1,
    },
    click_press_delay: {
      name: `Click Press Delay`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay to trigger action when long pressing a mouse button (milliseconds)
      This is the amount of time to hold the mouse button down to trigger the command`,
      version: 1,
    },
    double_click_delay: {
      name: `Double Click Delay`,
      type: `number`,
      value: 250,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Use this to consider how sensitive double clicks are (milliseconds)`,
      version: 1,
    },
  }

  add_props()
  category = `signals`

  props = {
    signals: {
      name: `Signals`,
      type: `list`,
      value: [],
      actions: [`commands`],
      info: `The list of signal items to use with the Signals command`,
      version: 1,
    },
    signal_title_icon: {
      name: `Signal Title Icon`,
      type: `checkbox`,
      value: false,
      info: `Show the icon of the signal in the Title`,
      version: 1,
    },
    show_signal_errors: {
      name: `Signal Errors`,
      type: `checkbox`,
      value: false,
      info: `Show an alert popup on signal errors`,
      version: 1,
    },
  }

  add_props()
  category = `lock`

  props = {
    lock_screen_password: {
      name: `Lock Screen Password`,
      type: `password`,
      value: ``,
      placeholder: `Password`,
      info: `Require this password when unlocking the screen`,
      version: 1,
    },
    lock_screen_image: {
      name: `Lock Screen Image`,
      type: `text`,
      value: ``,
      placeholder: `Image URL`,
      info: `Image to use for the lock screen`,
      version: 1,
    },
    lock_screen_command: {
      name: `On Lock Screen`,
      type: `menu`,
      value: `none`,
      info: `Run this command when locking the screen`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    unlock_screen_command: {
      name: `On Unlock Screen`,
      type: `menu`,
      value: `none`,
      info: `Run this command when unlocking the screen`,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    empty_lock_screen: {
      name: `Empty Lock Screen`,
      type: `checkbox`,
      value: false,
      info: `Don't show an image on the lock screen`,
      version: 1,
    },
  }

  add_props()
  category = `browser`
  props = App.setting_browser_commands()

  add_props()
  category = `more`

  props = {
    max_recent_tabs: {
      name: `Max Recent Tabs`,
      type: `number`,
      value: 12,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to show in Recent Tabs`,
      version: 1,
    },
    recent_tabs_delay: {
      name: `Recent Tabs Delay`,
      type: `number`,
      value: 2000,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Empty the recent tabs list these milliseconds after its last use`,
      version: 1,
    },
    command_combo_delay: {
      name: `Command Combo Delay`,
      type: `number`,
      value: 100,
      placeholder: `Number`,
      min: 0,
      max: App.number_max,
      info: `Delay in milliseconds between Command Combo commands`,
      version: 1,
    },
    close_on_focus: {
      name: `Close On Focus`,
      type: `checkbox`,
      value: true,
      info: `Close the popup when focusing a tab`,
      version: 1,
    },
    close_on_open: {
      name: `Close On Open`,
      type: `checkbox`,
      value: true,
      info: `Close the popup when opening a tab`,
      version: 1,
    },
    mute_click: {
      name: `Mute Click`,
      type: `checkbox`,
      value: true,
      info: `Un-Mute tabs when clicking on the mute icon`,
      version: 1,
    },
    rounded_corners: {
      name: `Rounded Corners`,
      type: `checkbox`,
      value: true,
      actions: [`theme`],
      info: `Allow rounded corners in some parts of the interface`,
      version: 1,
    },
    sort_commands: {
      name: `Sort Commands`,
      type: `checkbox`,
      value: true,
      info: `Sort commands in the Palette by recent use`,
      version: 1,
    },
    check_commands: {
      name: `Check Commands`,
      type: `checkbox`,
      value: true,
      info: `Make commands context aware to avoid clutter`,
      version: 1,
    },
    recent_active: {
      name: `Recent Active`,
      type: `checkbox`,
      value: true,
      info: `Show the active tab at the top when showing Recent Tabs`,
      version: 1,
    },
    mirror_settings: {
      name: `Mirror Settings`,
      type: `checkbox`,
      value: true,
      info: `Sync / mirror settings between instances
      For example, changing a setting in the popup triggers a reload in the sidebar`,
      version: 1,
    },
    mirror_edits: {
      name: `Mirror Edits`,
      type: `checkbox`,
      value: true,
      info: `Sync / mirror edits between instances
      For example, making a color change in the popup triggers an item update in the sidebar`,
      version: 1,
    },
    context_titles: {
      name: `Context Titles`,
      type: `checkbox`,
      value: true,
      info: `Show titles at the top of some context menus`,
      version: 1,
    },
    edit_title_auto: {
      name: `Edit Title Auto`,
      type: `checkbox`,
      value: true,
      info: `Auto-fill the title on edit`,
      version: 1,
    },
    page_scrolls: {
      name: `Page Scrolls`,
      type: `checkbox`,
      value: true,
      info: `PageUp and PageDown do full page scrolls`,
      version: 1,
    },
    wrap_items: {
      name: `Wrap Items`,
      type: `checkbox`,
      value: true,
      info: `Wrap first/last when selecting items`,
      version: 1,
    },
    smart_tab_switch: {
      name: `Smart Tab Switch`,
      type: `checkbox`,
      value: true,
      info: `Pick the next normal loaded tab when closing the active tab instead of letting the browser decide`,
      version: 1,
    },
    addlist_append: {
      name: `Append To Lists`,
      type: `checkbox`,
      value: true,
      info: `When adding items to settings lists, append at the bottom instead of prepending at the top`,
      version: 1,
    },
    popup_command_close: {
      name: `Popup Cmd Close`,
      type: `checkbox`,
      value: true,
      info: `Auto-close after hiding the prompt or input on a Popup Command`,
      version: 1,
    },
    clear_on_close: {
      name: `Clear On Close`,
      type: `checkbox`,
      value: true,
      info: `Auto-clear after no items remain when closing tabs`,
      version: 1,
    },
    auto_tag_picker: {
      name: `Auto Tag Picker`,
      type: `checkbox`,
      value: false,
      info: `Add tags quickly with the auto picker`,
      version: 1,
    },
    autohide_context: {
      name: `Autohide Context`,
      type: `checkbox`,
      value: false,
      info: `Autohide context menus when the mouse moves away from the window`,
      version: 1,
    },
    jump_unfold: {
      name: `Jump Unfold`,
      type: `checkbox`,
      value: false,
      info: `Show all items when jumping`,
      version: 1,
    },
    jump_unloaded: {
      name: `Jump Unloaded`,
      type: `checkbox`,
      value: false,
      info: `Consider unloaded tabs when jumping`,
      version: 1,
    },
    item_pointer: {
      name: `Item Pointer`,
      type: `checkbox`,
      value: false,
      info: `Use the pointer cursor on items when hovering them`,
      version: 1,
    },
    direct_settings: {
      name: `Direct Settings`,
      type: `checkbox`,
      value: false,
      info: `Go straight to General when clicking Settings
      Else show a menu to pick a category`,
      version: 1,
    },
    show_protocol: {
      name: `Show Protocol`,
      type: `checkbox`,
      value: false,
      info: `Show the protocol (like https://) when URLs are displayed`,
      version: 1,
    },
    short_commands: {
      name: `Short Commands`,
      type: `checkbox`,
      value: false,
      info: `Prefer short command name versions when displaying them
      Like 'Red' instead of 'Color Red'`,
      version: 1,
    },
    short_bookmarks: {
      name: `Short Bookmarks`,
      type: `checkbox`,
      value: false,
      info: `Reduce 'Bookmarks' to 'Bmarks' in some places`,
      version: 1,
    },
    step_back_recent: {
      name: `Step Back Recent`,
      type: `checkbox`,
      value: false,
      info: `Show Recent Tabs when using Step Back instead of jumping to previous tabs`,
      version: 1,
    },
    all_caps: {
      name: `All Caps`,
      type: `checkbox`,
      value: false,
      info: `ALL CAPS when you spell the tab name`,
      version: 1,
    },
    item_menu_select: {
      name: `Item Menu Select`,
      type: `checkbox`,
      value: false,
      info: `Select items when right clicking them to show the Item Menu`,
      version: 1,
    },
    tab_close_pins: {
      name: `Tab Close Pins`,
      type: `checkbox`,
      value: false,
      info: `Auto-pick 'Pins' when on the Close Tab Dialog`,
      version: 1,
    },
    tab_close_unloaded: {
      name: `Tab Close Unloaded`,
      type: `checkbox`,
      value: false,
      info: `Auto-pick 'Unloaded' when on the Close Tab Dialog`,
      version: 1,
    },
    debug_mode: {
      name: `Debug Mode`,
      type: `checkbox`,
      value: false,
      info: `Enable some features for developers`,
      version: 1,
    },
  }

  add_props()

  let theme_pickers = []

  for (let num = 1; num <= App.themes.length; num++) {
    let obj = {
      text: num,
      action: () => {
        App.set_theme(num)
      },
    }

    theme_pickers.push(obj)
  }

  // Category Properties
  App.setting_catprops = {
    general: {
      info: `This is the main settings window with some general settings
      There are various categories
      Clicking the labels shows menus
      Use the top buttons to navigate and save/load data`,
    },
    theme: {
      info: `Change the appearance`,
      buttons: [
        [
          {
            text: `Light Colors`,
            action: () => {
              App.set_light_colors()
            },
          },
          {
            text: `Dark Colors`,
            action: () => {
              App.set_dark_colors()
            },
          },
        ],
        [
          {
            text: `Random Light`,
            action: () => {
              App.random_colors(`light`)
            },
          },
          {
            text: `Random Dark`,
            action: () => {
              App.random_colors(`dark`)
            },
          },
        ],
        theme_pickers,
      ],
    },
    bookmarks: {
      info: `Configure the Bookmarks`,
    },
    colors: {
      info: `Set the colors for different kinds of items
      This includes the edit colors and tab colors`,
    },
    show: {
      info: `Hide or show interface components
      Set component behavior and their menus`,
    },
    menus: {
      info: `Configure the Actions Menu for each mode like Tabs, and more`,
    },
    icons: {
      info: `Customize the icons used by items
      These are the icons used for various states
      You can leave them empty to not show anything`,
    },
    title: {
      info: `Configure the Title
      The title is text that appears at the top`,
    },
    taglist: {
      info: `Configure the Taglist
      This is a component that shows item tags in various ways`,
    },
    favorites: {
      info: `Configure favorite commands
      Show them as a bar in different places
      Or as a button on the top right`,
    },
    tab_box: {
      info: `Configure the Tab Box
      This is a component that appears below or above the tabs
      It shows different kinds of tabs so you can jump around`,
    },
    close: {
      info: `Configure the Close Button
      This is used to close the tabs
      It also has a menu on right click`,
    },
    hover: {
      info: `Configure the Hover Button
      This is a button that appears when you hover over the edges of items
      Clicking the button presents a menu with commands`,
    },
    footer: {
      info: `Configure the Footer
      This is a component that appears at the bottom and shows some information`,
    },
    zones: {
      info: `Customize headers and splits`,
    },
    filter: {
      info: `Adjust the filter and search`,
    },
    media: {
      info: `How to view media items
      An icon appears to the left of items
      You can make it view media when clicking the icons, the whole item, or never
      Some files, like local files and others, won't be able to load`,
    },
    triggers: {
      info: `Run commands on certain keyboard and mouse actions`,
    },
    signals: {
      info: `Signals are network requests the extension does
      You can configure them to use GET, or POST, etc
      You can define what arguments are sent
      Signals are able to show feedback in a popup message
      or update the Title on response. They can also run automatically
      at a specified time interval, measured in seconds`,
    },
    gestures: {
      info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button
      Each gesture runs a specified command
      You can also set the sensitivity of the gestures`,
    },
    auxclick: {
      info: `Run commands when middle clicking various components`,
    },
    browser: {
      info: `Browser Commands are shortcuts that you configure on the browser
      Click 'Manage Extension', then click the cog on the top right
      Then click 'Manage Extension Shortcuts' and add the shortcuts you need
      Popup Commands open the popup first before running the command`,
    },
    warns: {
      info: `When to show the confirmation dialog on certain actions
      'Special' forces a confirm depending if tabs have a certain state like pinned, playing, or colored
      'Multiple' forces a confirm if multiple items are selected`,
    },
    lock: {
      info: `Configure the Lock Screen`,
    },
    more: {
      info: `Even more settings`,
    },
  }

  App.check_settings_dups(App.setting_props)
  App.check_settings_dups(App.setting_catprops)
}

App.check_settings_dups = (obj) => {
  let infos = []

  for (let key in obj) {
    let sett = obj[key]

    if (infos.includes(sett.info)) {
      App.error(`Duplicate Setting: ${sett.info}`)
    }

    infos.push(sett.info)
  }

  return infos
}