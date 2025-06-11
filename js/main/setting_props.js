App.build_settings = () => {
  // Setting Properties
  App.setting_props = {}
  let category, props

  // Add category props to main object
  function add_props() {
    for (let key in props) {
      props[key].category = category
      App.setting_props[key] = props[key]
    }
  }

  let bkmarks = App.bkmarks
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
      value: `below`,
      info: `Where to open a new tab
      Normal means whatever the browser decides`,
      separator: true,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Normal`, value: `normal`},
          {text: App.separator_string},
          {text: `At The Top`, value: `top`},
          {text: `At The Bottom`, value: `bottom`},
          {text: App.separator_string},
          {text: `Above Current`, value: `above`},
          {text: `Below Current`, value: `below`},
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
        App.settings_make_menu(key, App.sizes_3)
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
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
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
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.get_size_options())
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
    hover_effect_2: {
      name: `Hover Effect 2`,
      type: `menu`,
      value: `none`,
      info: `Second effect to use when hovering items`,
      separator: true,
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
    selected_effect_2: {
      name: `Selected Effect 2`,
      type: `menu`,
      value: `none`,
      info: `Second effect to use on selected items`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.effects)
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
    loading_effect: {
      name: `Loading Effect`,
      type: `menu`,
      value: `icon`,
      info: `Which effect to show on loading tabs`,
      separator: true,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.loading_effects)
      },
    },
    unloaded_opacity: {
      name: `Unloaded Opacity`,
      type: `menu`,
      value: 100,
      placeholder: `Opacity`,
      info: `The opacity of unloaded tabs. 100 means fully visible`,
      version: 3,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(0, 100, 5, `%`))
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
    command_palette_sort: {
      name: `Command Palette Sort`,
      type: `menu`,
      value: `recent`,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: `Recent`, value: `recent`},
          {text: `Alpha`, value: `alpha`},
        ])
      },
      actions: [`commands`],
      info: `How to sort the command palette`,
      version: 1,
    },
    command_menu_sort: {
      name: `Command Menu Sort`,
      type: `menu`,
      value: `none`,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: `Recent`, value: `recent`},
          {text: `Alpha`, value: `alpha`},
        ])
      },
      actions: [`commands`],
      info: `How to sort the command menus`,
      version: 1,
    },
    tooltips_mode: {
      name: `Tooltips Mode`,
      type: `menu`,
      value: `full`,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Full`, value: `full`},
          {text: `Simple`, value: `simple`},
          {text: `Minimal`, value: `minimal`},
          {text: `Space`, value: `space`},
          {text: `Angle`, value: `angle`},
          {text: `Brackets`, value: `brackets`},
          {text: `Arrows`, value: `arrows`},
        ])
      },
      actions: [`commands`],
      info: `How to present the tooltips of items`,
      version: 1,
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
    scroll_amount: {
      name: `Scroll Amount`,
      type: `number`,
      value: 100,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `How many pixels to scroll up or down on lists when using the mousewheel or commands`,
      version: 1,
    },
    templates: {
      name: `Templates`,
      type: `list`,
      value: [],
      actions: [`commands`],
      info: `Apply edits to a group of selected tabs`,
      version: 1,
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
    keyboard_shortcuts: {
      name: `Keyboard Shortcuts`,
      type: `list`,
      value: App.keyboard_shortcuts_value(),
      info: `Extra keyboard shortcuts
      If these are triggered the default shortcuts get ignored`,
      separator: true,
      version: 4,
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
    auto_scroll: {
      name: `Auto Scroll`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Enable auto-scrolling when clicking items`,
      version: 1,
    },
    smooth_scroll: {
      name: `Smooth Scroll`,
      type: `checkbox`,
      value: true,
      info: `Enable smooth list scrolling in some cases`,
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
    lock_drag: {
      name: `Lock Drag`,
      type: `checkbox`,
      value: false,
      info: `Require holding Ctrl to drag Tab Items vertically
      This is to avoid accidental re-ordering`,
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
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(0, 100, 5, `%`))
      },
    },
    background_zoom: {
      name: `Background Zoom`,
      type: `menu`,
      value: 1.0,
      actions: [`theme`],
      info: `Zoom level of the background image`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `No Zoom`, value: 1.0},
          {text: App.separator_string},
          {text: `10%`, value: 1.1},
          {text: `20%`, value: 1.2},
          {text: `30%`, value: 1.3},
          {text: `40%`, value: 1.4},
          {text: `50%`, value: 1.5},
          {text: `60%`, value: 1.6},
          {text: `70%`, value: 1.7},
          {text: `80%`, value: 1.8},
          {text: `90%`, value: 1.9},
          {text: `100%`, value: 2.0},
        ])
      },
    },
    font: {
      name: `Font`,
      type: `text`,
      actions: [`theme`],
      value: App.default_font,
      placeholder: `Font Name`,
      btns: [`pick`],
      no_empty: true,
      info: `Font to use for the text
      Pick from the list, or enter a Google Font name, or enter a font URL`,
      version: 1,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_font(e, `font`)
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
        App.settings_make_menu(key, App.setting_steps(...App.font_sizes, `px`))
      },
    },
    window_border_width: {
      name: `Border Width`,
      type: `menu`,
      value: 0,
      placeholder: `Px`,
      info: `Width in pixels for the window border`,
      actions: [`theme`],
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.border_widths, `px`))
      },
    },
    window_border_color: {
      name: `Border Color`,
      type: `color`,
      value: `rgba(40, 40, 232, 1)`,
      actions: [`theme`],
      info: `Color to use for the window border`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
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
    include_bookmark_folders: {
      name: `Bookmark Folders`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Whether to show bookmark folders in the Bookmarks mode results`,
      version: 1,
    },
    bookmark_folders_above: {
      name: `Bookmark Folders Above`,
      type: `checkbox`,
      value: true,
      info: `Show bookmark folders at the top of the Bookmarks mode results`,
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
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Media icon for images`,
      version: 1,
    },
    image_icon_side: {
      name: `Image Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Image Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    show_image_icon: {
      name: `Show Image Icon`,
      type: `menu`,
      value: `always`,
      info: `When to show the Image Icon`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    image_icon_weight: {
      name: `Image Icon Weight`,
      type: `menu`,
      value: 1,
      separator: true,
      info: `How much to the right should the Image Icon be`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_weight)
      },
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
      name: `View Image (${bkmarks})`,
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
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Media icon for videos`,
      version: 1,
    },
    video_icon_side: {
      name: `Video Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Video Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    show_video_icon: {
      name: `Show Video Icon`,
      type: `menu`,
      value: `always`,
      info: `When to show the Video Icon`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    video_icon_weight: {
      name: `Video Icon Weight`,
      type: `menu`,
      value: 1,
      separator: true,
      info: `How much to the right should the Video Icon be`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_weight)
      },
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
      name: `View Video (${bkmarks})`,
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
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Media icon for audio`,
      version: 1,
    },
    audio_icon_side: {
      name: `Audio Icon Side`,
      type: `menu`,
      value: `left`,
      info: `Show the Audio Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    show_audio_icon: {
      name: `Show Audio Icon`,
      type: `menu`,
      value: `always`,
      info: `When to show the Audio Icon`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    audio_icon_weight: {
      name: `Audio Icon Weight`,
      type: `menu`,
      value: 1,
      separator: true,
      info: `How much to the right should the Audio Icon be`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_weight)
      },
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
      name: `View Audio (${bkmarks})`,
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
    tabs_mode_icon: {
      name: `Tabs Icon`,
      type: `text_smaller`,
      value: `📚`,
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Icon for the Tabs mode`,
      version: 1,
    },
    history_mode_icon: {
      name: `History Icon`,
      type: `text_smaller`,
      value: `🧭`,
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Icon for the History mode`,
      version: 1,
    },
    bookmarks_mode_icon: {
      name: `Bookmarks Icon`,
      type: `text_smaller`,
      value: `⭐`,
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Icon for the Bookmarks mode`,
      version: 1,
    },
    closed_mode_icon: {
      name: `Closed Icon`,
      type: `text_smaller`,
      value: `🔃`,
      no_empty: true,
      separator: true,
      placeholder: App.icon_placeholder,
      info: `Icon for the Closed mode`,
      version: 1,
    },

    ...App.make_icon_settings({
      what: `active`,
      name: `Active`,
      icon: `😀`,
      info: `Icon for active tabs
      Active means the current visible tab in the browser`,
      side: `right`,
      show: `never`,
      cmd: `show_same_domain`,
    }),

    ...App.make_icon_settings({
      what: `pin`,
      name: `Pin`,
      icon: `📌`,
      info: `Icon for pinned tabs`,
      side: `right`,
      show: `never`,
      cmd: `toggle_pin_tabs`,
    }),

    ...App.make_icon_settings({
      what: `normal`,
      name: `Normal`,
      icon: `📚`,
      info: `Icon for normal tabs`,
      side: `right`,
      show: `never`,
      cmd: `toggle_pin_tabs`,
    }),

    ...App.make_icon_settings({
      what: `playing`,
      name: `Playing`,
      icon: `🔊`,
      info: `Icons for tabs emitting sound`,
      side: `left`,
      show: `always`,
      cmd: `toggle_mute_tabs`,
    }),

    ...App.make_icon_settings({
      what: `muted`,
      name: `Muted`,
      icon: `🔇`,
      info: `Icons for muted tabs`,
      side: `left`,
      show: `always`,
      cmd: `toggle_mute_tabs`,
    }),

    ...App.make_icon_settings({
      what: `unloaded`,
      name: `Unloaded`,
      icon: `💤`,
      info: `Icons for unloaded tabs`,
      side: `left`,
      show: `always`,
      cmd: `load_tabs`,
    }),

    ...App.make_icon_settings({
      what: `loading`,
      name: `Loading`,
      icon: `⏳`,
      info: `Icon for tabs that are still loading`,
      side: `left`,
      show: `always`,
      cmd: `browser_reload`,
    }),

    ...App.make_icon_settings({
      what: `loaded`,
      name: `Loaded`,
      icon: `🚛`,
      info: `Icons for loaded tabs`,
      side: `right`,
      show: `never`,
      cmd: `unload_tabs`,
    }),

    ...App.make_icon_settings({
      what: `unread`,
      name: `Unread`,
      icon: `⭕`,
      info: `Icons for unread tabs`,
      side: `left`,
      show: `always`,
      cmd: `add_tag_later`,
    }),

    ...App.make_icon_settings({
      what: `title`,
      name: `Title`,
      icon: `✏️`,
      info: `Icon for tabs with a custom title`,
      side: `right`,
      show: `never`,
      cmd: `edit_title`,
    }),

    ...App.make_icon_settings({
      what: `notes`,
      name: `Notes`,
      icon: `📝`,
      info: `Icon for tabs with notes`,
      side: `right`,
      show: `always`,
      cmd: `edit_notes`,
    }),

    ...App.make_icon_settings({
      what: `edited`,
      name: `Edited`,
      icon: `🪬`,
      info: `Icon for edited tabs
      Edits include color, tags, notes, etc`,
      side: `right`,
      show: `never`,
      cmd: `show_edits_info`,
    }),

    ...App.make_icon_settings({
      what: `obfuscated`,
      name: `Obfuscated`,
      icon: `👻`,
      info: `Icons for obfuscated tabs`,
      side: `right`,
      show: `always`,
      cmd: `deobfuscate_tabs`,
    }),

    ...App.make_icon_settings({
      what: `parent`,
      name: `Parent`,
      icon: `🤿`,
      info: `Icon for tabs that are parents`,
      side: `right`,
      show: `never`,
      cmd: `show_node_tabs`,
    }),

    ...App.make_icon_settings({
      what: `node`,
      name: `Node`,
      icon: `🦠`,
      info: `Icon for tabs that are nodes`,
      side: `right`,
      show: `never`,
      cmd: `show_parent_tab`,
    }),

    ...App.make_icon_settings({
      what: `root`,
      name: `Root`,
      icon: `🌀`,
      info: `Icon for tabs with a root`,
      side: `right`,
      show: `focus`,
      cmd: `go_to_root_url`,
      separator: false,
    }),
    auto_root_icon: {
      name: `Auto Root Icon`,
      type: `checkbox`,
      value: true,
      separator: true,
      info: `Show the root icon only when not at the root already`,
      version: 1,
    },

    ...App.make_icon_settings({
      what: `container`,
      name: `Container`,
      icon: `🛍️`,
      info: `Icon for containers`,
      side: `right`,
      show: `always`,
      cmd: `none`,
      separator: false,
    }),
    container_icon_text: {
      name: `Container Icon Text`,
      type: `checkbox`,
      value: false,
      info: `Show the container name next to the icon`,
      separator: true,
      version: 1,
    },

    ...App.make_icon_settings({
      what: `custom`,
      name: `Custom`,
      side: `right`,
      show: `always`,
      separator: false,
    }),
    custom_icon_commands: {
      name: `Custom Icon Commands`,
      type: `list`,
      value: [],
      info: `Define the action when clicking specific custom icons`,
      version: 1,
    },
    auto_icon_picker: {
      name: `Auto Icon Picker`,
      type: `checkbox`,
      value: false,
      separator: true,
      info: `Add icons quickly with the auto picker`,
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
    icons_click: {
      name: `Icons Click`,
      type: `checkbox`,
      value: true,
      info: `Enable click actions for item icons`,
      version: 1,
    },
    icons_middle_click: {
      name: `Icons Middle Click`,
      type: `checkbox`,
      value: true,
      info: `Enable middle click actions for item icons`,
      version: 1,
    },
  }

  add_props()
  category = `show`

  props = {
    show_top_panel: {
      name: `Show Top Panel`,
      type: `checkbox`,
      value: true,
      separator: true,
      no_mirror: true,
      info: `Show or hide the whole top panel`,
      version: 1,
    },
    show_main_button: {
      name: `Show Main Btn`,
      type: `checkbox`,
      value: true,
      info: `Show the Main Button`,
      version: 1,
    },
    show_filter_button: {
      name: `Show Filter Btn`,
      type: `checkbox`,
      value: true,
      info: `Show the Filter Button`,
      version: 1,
    },
    show_playing_button: {
      name: `Show Playing Btn`,
      type: `checkbox`,
      value: true,
      info: `Show the Playing Button`,
      version: 1,
    },
    show_step_back_button: {
      name: `Show Step Back Btn`,
      type: `checkbox`,
      value: true,
      info: `Show the Step Back Button`,
      version: 1,
    },
    show_actions_button: {
      name: `Show Actions Btn`,
      type: `checkbox`,
      value: true,
      separator: true,
      info: `Show the Actions Button`,
      version: 1,
    },
    show_pinned_tabs: {
      name: `Show Pins`,
      type: `checkbox`,
      value: true,
      info: `Show pinned tabs`,
      version: 1,
    },
    show_unloaded_tabs: {
      name: `Show Unloaded`,
      type: `checkbox`,
      value: true,
      info: `Show unloaded tabs`,
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
    show_scroller_info: {
      name: `Show Scroller Info`,
      type: `checkbox`,
      value: true,
      info: `Show the scroll percentage on the Scroller`,
      version: 1,
    },
    show_settings_info: {
      name: `Show Settings Info`,
      type: `checkbox`,
      value: true,
      actions: [`theme`],
      info: `Show the description info at the top of setting categories`,
      version: 1,
    },
    show_feedback: {
      name: `Show Feedback`,
      type: `checkbox`,
      value: true,
      info: `Show feedback messages on certain actions`,
      version: 1,
    },
    tab_blink: {
      name: `Tab Blink`,
      type: `checkbox`,
      value: true,
      info: `Blink when focusing tabs through certain actions when not directly clicking them`,
      version: 1,
    },
    show_scrollbars: {
      name: `Show Scrollbars`,
      type: `checkbox`,
      value: false,
      info: `Show the item scrollbars
      Else scrollbars are disabled`,
      version: 1,
    },
    show_protocol: {
      name: `Show Protocol`,
      type: `checkbox`,
      value: false,
      info: `Show the protocol (like https://) when URLs are displayed`,
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
    auto_blur: {
      name: `Auto Blur`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Blur the sidebar automatically then the mouse moves out, for privacy`,
      version: 1,
    },
  }

  add_props()
  category = `close`

  props = {
    close_button_side: {
      name: `Close Button Side`,
      type: `menu`,
      value: `right`,
      info: `On which side to show the Close Button`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    show_close_button: {
      name: `Show Close Button`,
      type: `menu`,
      value: `global`,
      info: `How to show the Close Buttons`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    close_button_size: {
      name: `Close Button Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Close Button`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    close_button_border_width: {
      name: `Close Button Border`,
      type: `menu`,
      value: 1,
      placeholder: `Px`,
      info: `Border width of Close Buttons`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.border_widths, `px`))
      },
    },
    close_button_menu: {
      name: `Close Button Menu`,
      type: `list`,
      value: [
        {cmd: `select_item`},
        {cmd: `select_item_range`},
        {cmd: App.separator_string},
        {cmd: `open_new_tab`},
        {cmd: `filter_title`},
        {cmd: `filter_domain`},
        {cmd: `filter_node_tabs`},
        {cmd: `duplicate_tabs`},
        {cmd: `obfuscate_tabs`},
        {cmd: `unload_tabs`},
        {cmd: App.separator_string},
        {cmd: `settings_category_close`},
      ],
      separator: true,
      info: `Menu to show when clicking the Close Button`,
      version: 1,
    },
    close_button_side_tab_box: {
      name: `Close Button Tab Box Side`,
      type: `menu`,
      value: `right`,
      info: `On which side to show the Close Button in the Tab Box`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    show_close_button_tab_box: {
      name: `Show Close Button Tab Box`,
      type: `menu`,
      value: `global`,
      info: `How to show the Close Buttons in the Tab Box`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    close_button_size_tab_box: {
      name: `Close Button Tab Box Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Close Button in the Tab Box`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    close_button_border_width_tab_box: {
      name: `Close Button Tab Box Border`,
      type: `menu`,
      value: 1,
      placeholder: `Px`,
      separator: true,
      info: `Border width of Close Buttons in the Tab Box`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.border_widths, `px`))
      },
    },

    ...App.make_mouse_settings({
      what: `close_button`,
      title: `Close Btn`,
      click: `close_tabs`,
      double_click: `none`,
      middle_click: `unload_tabs`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

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
    close_button_icon: {
      name: `Close Icon`,
      type: `text_smaller`,
      value: `x`,
      no_empty: true,
      separator: true,
      placeholder: App.icon_placeholder,
      info: `Icon for the close buttons`,
      version: 1,
    },
    close_button_colors: {
      name: `Close Button Colors`,
      type: `checkbox`,
      value: false,
      info: `Enable custom colors for the Close Buttons`,
      version: 1,
    },
    close_button_text_color: {
      name: `Close Button Text Color`,
      type: `color`,
      value: App.default_color,
      info: `Text color for the Close Buttons`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    close_button_background_color: {
      name: `Close Button Background Color`,
      type: `color`,
      value: App.default_color,
      info: `Background color for the Close Buttons`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    close_button_pick: {
      name: `Close Button Pick`,
      type: `checkbox`,
      value: false,
      info: `Pick items when right clicking the Close Button`,
      version: 1,
    },
  }

  add_props()
  category = `hover`

  props = {
    show_hover_button: {
      name: `Show Hover Button`,
      type: `checkbox`,
      value: false,
      no_mirror: true,
      info: `Enable or disable the Hover Button`,
      version: 1,
    },
    hover_button_side: {
      name: `Hover Button Side`,
      type: `menu`,
      value: `left`,
      info: `Where to show the Hover Button`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides_2)
      },
    },
    hover_button_size: {
      name: `Hover Button Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Hover Button`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    hover_button_menu: {
      name: `Hover Button Menu`,
      type: `list`,
      value: [
        {cmd: `select_item`},
        {cmd: `select_item_range`},
        {cmd: App.separator_string},
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
    hover_button_menu_tabs: {
      name: `Hover Button Menu (Tabs)`,
      type: `list`,
      value: [],
      info: `Menu to show when clicking the Hover Button (Tabs)`,
      version: 1,
    },
    hover_button_menu_history: {
      name: `Hover Button Menu (History)`,
      type: `list`,
      value: [],
      info: `Menu to show when clicking the Hover Button (History)`,
      version: 1,
    },
    hover_button_menu_bookmarks: {
      name: `Hover Button Menu (${bkmarks})`,
      type: `list`,
      value: [],
      info: `Menu to show when clicking the Hover Button (Bookmarks)`,
      version: 1,
    },
    hover_button_menu_closed: {
      name: `Hover Button Menu (Closed)`,
      type: `list`,
      value: [],
      separator: true,
      info: `Menu to show when clicking the Hover Button (Closed)`,
      version: 1,
    },

    ...App.make_mouse_settings({
      what: `hover_button`,
      title: `Hover Btn`,
      middle_click: `close_tabs`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    hover_button_icon: {
      name: `Hover Button Icon`,
      type: `text_smaller`,
      value: `🔆`,
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Icon for the hover buttons`,
      version: 1,
    },
    hover_button_pick: {
      name: `Hover Button Pick`,
      type: `checkbox`,
      value: false,
      info: `Pick items when right clicking the Hover Button`,
      version: 1,
    },
  }

  add_props()
  category = `menus`

  props = {
    item_menu: {
      name: `Item Menu`,
      type: `list`,
      value: [],
      data_group: `normal_menus`,
      info: `Make this the item menu for all modes that don't have an Item Menu set`,
      version: 1,
    },
    item_menu_tabs: {
      name: `Item Menu (Tabs)`,
      type: `list`,
      value: [],
      data_group: `normal_menus`,
      info: `Menu to show when using the Tabs Item Menu`,
      version: 1,
    },
    item_menu_history: {
      name: `Item Menu (History)`,
      type: `list`,
      value: [],
      data_group: `normal_menus`,
      info: `Menu to show when using the History Item Menu`,
      version: 1,
    },
    item_menu_bookmarks: {
      name: `Item Menu (${bkmarks})`,
      type: `list`,
      value: [],
      data_group: `normal_menus`,
      info: `Menu to show when using the Bookmarks Item Menu`,
      version: 1,
    },
    item_menu_closed: {
      name: `Item Menu (Closed)`,
      type: `list`,
      value: [],
      separator: true,
      data_group: `normal_menus`,
      info: `Menu to show when using the Closed Item Menu`,
      version: 1,
    },
    actions_menu: {
      name: `Actions Menu`,
      type: `list`,
      value: [],
      data_group: `normal_menus`,
      info: `Make this the actions menu for all modes that don't have an actions menu set`,
      version: 1,
    },
    actions_menu_tabs: {
      name: `Actions Menu (Tabs)`,
      type: `list`,
      value: [
        {cmd: `open_new_tab`},
        {cmd: `reopen_tab`},
        {cmd: App.separator_string},
        {cmd: `show_tab_info`},
        {cmd: `sort_tabs`},
        {cmd: `open_tab_urls`},
        {cmd: `show_tab_urls`},
        {cmd: App.separator_string},
        {cmd: `export_tabs`},
        {cmd: `import_tabs`},
        {cmd: App.separator_string},
        {cmd: `show_close_tabs_menu`},
      ],
      data_group: `normal_menus`,
      info: `Menu to show when clicking the tabs actions menu`,
      version: 1,
    },
    actions_menu_history: {
      name: `Actions Menu (History)`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `show_search_media_menu`},
        {cmd: `save_history_pick`},
      ],
      data_group: `normal_menus`,
      info: `Menu to show when clicking the History Actions Menu`,
      version: 1,
    },
    actions_menu_bookmarks: {
      name: `Actions Menu (${bkmarks})`,
      type: `list`,
      value: [
        {cmd: `deep_search`},
        {cmd: `show_search_media_menu`},
        {cmd: `bookmark_page`},
        {cmd: `pick_bookmarks_folder`},
        {cmd: `create_bookmarks_folder`},
        {cmd: `save_bookmarks_folder_pick`},
      ],
      data_group: `normal_menus`,
      info: `Menu to show when clicking the Bookmarks Actions Menu`,
      version: 1,
    },
    actions_menu_closed: {
      name: `Actions Menu (Closed)`,
      type: `list`,
      value: [
        {cmd: `forget_closed`},
      ],
      separator: true,
      data_group: `normal_menus`,
      info: `Menu to show when clicking the Closed Actions Menu`,
      version: 1,
    },
    empty_menu: {
      name: `Empty Menu`,
      type: `list`,
      value: [],
      data_group: `normal_menus`,
      info: `Use this empty menu when the specific mode is not specified`,
      version: 1,
    },
    empty_menu_tabs: {
      name: `Empty Menu (Tabs)`,
      type: `list`,
      value: [
        {cmd: `open_new_tab_bottom`},
        {cmd: `reopen_tab`},
        {cmd: `select_all_items`},
      ],
      data_group: `normal_menus`,
      info: `Menu to show when right clicking empty space in Tabs mode`,
      version: 1,
    },
    empty_menu_history: {
      name: `Empty Menu (History)`,
      type: `list`,
      value: [
        {cmd: `save_history_pick`},
        {cmd: `select_all_items`},
      ],
      data_group: `normal_menus`,
      info: `Menu to show when right clicking empty space in History mode`,
      version: 1,
    },
    empty_menu_bookmarks: {
      name: `Empty Menu (${bkmarks})`,
      type: `list`,
      value: [
        {cmd: `pick_bookmarks_folder`},
        {cmd: `create_bookmarks_folder`},
        {cmd: `select_all_items`},
      ],
      data_group: `normal_menus`,
      info: `Menu to show when right clicking empty space in Bookmarks mode`,
      version: 1,
    },
    empty_menu_closed: {
      name: `Empty Menu (Closed)`,
      type: `list`,
      value: [
        {cmd: `reopen_tab`},
        {cmd: `forget_closed`},
        {cmd: `select_all_items`},
      ],
      separator: true,
      data_group: `normal_menus`,
      info: `Menu to show when right clicking empty space in Closed mode`,
      version: 1,
    },
    extra_menu_mode: {
      name: `Extra Menu Mode`,
      type: `menu`,
      value: `flat`,
      info: `How to show the Extra Menu on right click
      Either on its own submenu, flat at the root level`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Normal`, value: `normal`},
          {text: `Flat`, value: `flat`},
        ])
      },
    },
    extra_menu: {
      name: `Extra Menu`,
      type: `list`,
      data_group: `normal_menus`,
      value: [],
      separator: true,
      info: `Extra menu to show when right clicking items`,
      version: 4,
    },
    stuff_menu: {
      name: `Stuff Menu`,
      type: `list`,
      data_group: `normal_menus`,
      value: [
        {cmd: `show_flashlight`},
        {cmd: `generate_password`},
        {cmd: `breathe_effect`},
        {cmd: `locust_swarm`},
        {cmd: App.separator_string},
        {cmd: `toggle_main_title`},
        {cmd: `toggle_taglist`},
        {cmd: `toggle_favorites`},
        {cmd: `toggle_favorites_autohide`},
        {cmd: `toggle_tab_box`},
        {cmd: `toggle_footer`},
        {cmd: App.separator_string},
        {cmd: `toggle_show_pins`},
        {cmd: `toggle_show_unloaded`},
        {cmd: `toggle_tab_sort`},
        {cmd: App.separator_string},
        {cmd: `toggle_wrap_text`},
        {cmd: `toggle_auto_blur`},
        {cmd: App.separator_string},
        {cmd: `set_next_theme`},
        {cmd: `increase_background_opacity`},
        {cmd: `decrease_background_opacity`},
      ],
      info: `Items for the Stuff Menu`,
      version: 1,
    },
    scroller_menu: {
      name: `Scroller Menu`,
      type: `list`,
      data_group: `normal_menus`,
      value: [
        {cmd: `go_to_top`},
        {cmd: `select_items_above`},
        {cmd: `move_tabs_to_top`},
        {cmd: `select_item_up`},
        {cmd: `scroll_up`},
        {cmd: `page_up`},
        {cmd: `jump_tabs_all_up`},
      ],
      separator: true,
      info: `Items for the Scroller Menu`,
      version: 1,
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
      value: `special`,
      no_mirror: true,
      info: `What to show in the Tab Box`,
      version: 4,
      setup: (key) => {
        App.settings_make_menu(key, App.get_setting_tab_box_modes())
      },
    },
    tab_box_menu: {
      name: `Tab Box Menu`,
      type: `list`,
      value: [
        {cmd: `tab_box_go_to_top`},
        {cmd: `tab_box_go_to_bottom`},
        {cmd: App.separator_string},
        {cmd: `tab_box_select`},
        {cmd: `tab_box_close`},
        {cmd: `toggle_tab_box`},
        {cmd: App.separator_string},
        {cmd: `settings_category_tab_box`},
      ],
      separator: true,
      info: `Menu to show when right clicking the Tab Box`,
      version: 1,
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
    tab_box_hover_effect_2: {
      name: `Tab Box Hover Effect 2`,
      type: `menu`,
      value: `none`,
      info: `Second effect to show on hovered items in the Tab Box`,
      separator: true,
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
    tab_box_active_effect_2: {
      name: `Tab Box Active Effect 2`,
      type: `menu`,
      value: `none`,
      info: `Second effect to show on active items in the Tab Box`,
      separator: true,
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
      value: `compact`,
      info: `Shrink the Tab Box automatically when it has no items`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Compact`, value: `compact`},
          {text: `Tiny`, value: `tiny`},
          {text: `Small`, value: `small`},
          {text: `Normal`, value: `normal`},
        ])
      },
    },
    tab_box_font_enabled: {
      name: `Tab Box Font Enabled`,
      type: `checkbox`,
      value: false,
      info: `Override the main font for the Tab Box`,
      version: 1,
    },
    tab_box_font: {
      name: `Tab Box Font`,
      type: `text`,
      value: App.default_font,
      placeholder: `Font Name`,
      btns: [`pick`],
      no_empty: true,
      info: `Font to use for the Tab Box
      Pick from the list, or enter a Google Font name, or enter a font URL`,
      version: 1,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_font(e, `tab_box_font`)
        })
      },
    },
    tab_box_font_size: {
      name: `Tab Box Font Size`,
      type: `menu`,
      value: App.default_font_size,
      placeholder: `Px`,
      info: `Font size for the Tab Box`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.font_sizes, `px`))
      },
    },
    tab_box_color_mode: {
      name: `Tab Box Color Mode`,
      type: `menu`,
      value: `icon`,
      info: `The color mode inside the Tab Box
      For colors like green, red, etc`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.color_displays)
      },
    },
    tab_box_scroll: {
      name: `Tab Box Scroll`,
      type: `menu`,
      value: `top`,
      info: `How to scroll the Tab Box`,
      separator: true,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.scroll_modes)
      },
    },

    ...App.make_mouse_settings({
      what: `tab_box_title`,
      title: `Tab Box Title`,
      middle_click: `toggle_tab_box`,
      click_press: `tab_box_select`,
      middle_click_press: `tab_box_close`,
      wheel_up: `tab_box_previous_mode`,
      wheel_down: `tab_box_next_mode`,
    }),

    ...App.make_mouse_settings({
      what: `tab_box`,
      title: `Tab Box`,
      wheel_up: `tab_box_scroll_up`,
      wheel_down: `tab_box_scroll_down`,
      wheel_up_shift: `tab_box_previous_mode`,
      wheel_down_shift: `tab_box_next_mode`,
    }),

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
    hide_popup_tab_box: {
      name: `Hide Popup Tab Box`,
      type: `checkbox`,
      value: true,
      info: `Don't auto-show the Tab Box when in popup mode`,
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
    tab_box_reveal: {
      name: `Tab Box Reveal`,
      type: `checkbox`,
      value: true,
      info: `Scroll to the clicked item within the Tab Box`,
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
    tab_box_scroll_info: {
      name: `Tab Box Scroll Info`,
      type: `checkbox`,
      value: true,
      info: `Show the scroll percentange on the Tab Box title`,
      version: 1,
    },
    tab_box_buttons: {
      name: `Tab Box Buttons`,
      type: `checkbox`,
      value: true,
      info: `Show the left and right buttons in the Tab Box`,
      version: 1,
    },
    tab_box_auto_history: {
      name: `Tab Box Auto History`,
      type: `checkbox`,
      value: true,
      info: `Set History mode when entering History mode`,
      version: 1,
    },
    tab_box_auto_folders: {
      name: `Tab Box Auto Folders`,
      type: `checkbox`,
      value: true,
      info: `Set Folders mode when entering Bookmarks mode`,
      version: 1,
    },
    tab_box_follow: {
      name: `Tab Box Follow`,
      type: `checkbox`,
      value: true,
      info: `When a tab gets activated scroll to it in the Tab Box`,
      version: 1,
    },
    tab_box_auto_playing: {
      name: `Tab Box Auto Playing`,
      type: `checkbox`,
      value: false,
      info: `Auto show the Tab Box when a tab is playing`,
      version: 1,
    },
    tab_box_reverse: {
      name: `Tab Box Reverse`,
      type: `checkbox`,
      value: false,
      info: `Reverse the order of items in the Tab Box`,
      version: 1,
    },
    tab_box_headers: {
      name: `Tab Box Headers`,
      type: `checkbox`,
      value: false,
      info: `Show headers in the Tab Box on all modes`,
      version: 1,
    },
    tab_box_scrollbars: {
      name: `Tab Box Scrollbars`,
      type: `checkbox`,
      value: false,
      info: `Show the scrollbars in the Tab Box`,
      version: 1,
    },
  }

  add_props()
  category = `pinline`

  props = {
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
    pinline_align: {
      name: `Pinline Align`,
      type: `menu`,
      value: `center`,
      info: `How to align the text in the Pinline`,
      setup: (key) => {
        App.settings_make_menu(key, App.aligns)
      },
      version: 1,
    },
    pinline_border_width: {
      name: `Pinline Border`,
      type: `menu`,
      value: 1,
      placeholder: `Px`,
      info: `Width in pixels for the Pinline`,
      actions: [`theme`],
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.border_widths, `px`))
      },
    },
    pinline_margin: {
      name: `Pinline Margin`,
      type: `menu`,
      value: 0,
      placeholder: `Px`,
      info: `Left/Right margin of the Pinline from the edges`,
      actions: [`theme`],
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(0, 28, 2, `px`))
      },
    },
    pinline_menu: {
      name: `Pinline Menu`,
      type: `list`,
      value: [
        {cmd: `new_pinned_tab`},
        {cmd: `new_normal_tab`},
        {cmd: App.separator_string},
        {cmd: `select_pinned_tabs`},
        {cmd: `select_normal_tabs`},
        {cmd: `select_unloaded_tabs`},
        {cmd: `select_all_items`},
        {cmd: App.separator_string},
        {cmd: `settings_category_pinline`},
      ],
      info: `Menu to show when clicking the Pinline`,
      separator: true,
      version: 1,
    },

    ...App.make_mouse_settings({
      what: `pinline`,
      title: `Pinline`,
      click: `show_pinline_menu`,
      double_click: `none`,
      middle_click: `show_close_tabs_menu`,
      click_press: `edit_global_notes`,
      middle_click_press: `lock_screen`,
      wheel_up: `scroll_up`,
      wheel_down: `scroll_down`,
    }),

    pinline_colors: {
      name: `Pinline Colors`,
      type: `checkbox`,
      value: false,
      info: `Enable custom colors for the Pinline`,
      version: 1,
    },
    pinline_text_color: {
      name: `Pinline Text Color`,
      type: `color`,
      value: App.semi_white_color,
      info: `Text color of the Pinline`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    pinline_background_color: {
      name: `Pinline Background Color`,
      type: `color`,
      value: App.default_color,
      info: `Background color of the Pinline`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    pinline_drag: {
      name: `Pinline Drag`,
      type: `checkbox`,
      value: true,
      info: `Allow dragging the Pinline to pin and unpin tabs`,
      version: 1,
    },
    pinline_icons: {
      name: `Pinline Icons`,
      type: `checkbox`,
      value: false,
      info: `Show icons in the Pinline`,
      version: 1,
    },
    rounded_pinline: {
      name: `Rounded Pinline`,
      type: `checkbox`,
      value: false,
      info: `Make the Pinline more rounded`,
      version: 1,
    },
    small_pinline: {
      name: `Small Pinline`,
      type: `checkbox`,
      value: false,
      info: `Make the Pinline smaller`,
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
    footer_align: {
      name: `Footer Align`,
      type: `menu`,
      value: `left`,
      info: `How to align the Footer text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.aligns)
      },
    },
    footer_size: {
      name: `Footer Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Footer`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    footer_menu: {
      name: `Footer Menu`,
      type: `list`,
      value: [
        {cmd: `open_new_tab_bottom`},
        {cmd: `copy_item_url`},
        {cmd: `copy_item_title`},
        {cmd: App.separator_string},
        {cmd: `settings_category_footer`},
      ],
      separator: true,
      info: `Menu to show when right clicking the Footer`,
      version: 1,
    },

    ...App.make_mouse_settings({
      what: `footer`,
      title: `Footer`,
      click: `go_to_bottom`,
      double_click: `open_new_tab_bottom`,
      middle_click: `copy_item_url`,
      click_press: `toggle_tab_box`,
      middle_click_press: `copy_item_title`,
      wheel_up: `scroll_up`,
      wheel_down: `scroll_down`,
      wheel_up_shift: `page_up`,
      wheel_down_shift: `page_down`,
    }),

    footer_font_enabled: {
      name: `Footer Font Enabled`,
      type: `checkbox`,
      value: false,
      info: `Override the main font for the Footer`,
      version: 1,
    },
    footer_font: {
      name: `Footer Font`,
      type: `text`,
      value: App.default_font,
      placeholder: `Font Name`,
      btns: [`pick`],
      no_empty: true,
      info: `Font to use for the Footer
      Pick from the list, or enter a Google Font name, or enter a font URL`,
      version: 1,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_font(e, `footer_font`)
        })
      },
    },
    footer_font_size: {
      name: `Footer Font Size`,
      type: `menu`,
      value: App.default_font_size,
      placeholder: `Px`,
      info: `Font size for the Footer`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.font_sizes, `px`))
      },
    },
    footer_colors: {
      name: `Footer Colors`,
      type: `checkbox`,
      value: false,
      info: `Enable custom colors for the Footer`,
      version: 1,
    },
    footer_text_color: {
      name: `Footer Text Color`,
      type: `color`,
      value: App.semi_white_color,
      info: `Text color of the Footer`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    footer_background_color: {
      name: `Footer Background Color`,
      type: `color`,
      value: App.default_color,
      info: `Background color of the Footer`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    show_footer_tab_box: {
      name: `Tab Box In Footer`,
      type: `checkbox`,
      value: true,
      info: `Show Tab Box toggle on the Footer`,
      version: 1,
    },
    show_footer_count: {
      name: `Count In Footer`,
      type: `checkbox`,
      value: true,
      info: `Show the item count on the Footer`,
      version: 1,
    },
    show_footer_buttons: {
      name: `Buttons In Footer`,
      type: `checkbox`,
      value: true,
      info: `Show buttons on the right side of the Footer`,
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
    favorites_position: {
      name: `Favorites Position`,
      type: `menu`,
      value: `left`,
      no_mirror: true,
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
    favorites_size: {
      name: `Favorites Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Favorites panel`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    favorites_gap: {
      name: `Favorites Gap`,
      type: `menu`,
      value: `normal`,
      info: `How close the items are to each other in the Favorites Bar`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    favorites_gravity: {
      name: `Favorites Gravity`,
      type: `menu`,
      value: `center`,
      separator: true,
      info: `Gravity of the items in side modes of the favorites bar
      Either make them stick to the top, center, or bottom`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.aligns_2)
      },
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
        {cmd: `set_random_dark_colors`, middle: `set_random_light_colors`, shift: `set_next_theme`, ctrl: `set_previous_theme`},
        {cmd: `edit_notes`, middle: `edit_global_notes`},
        {cmd: `open_new_tab`},
      ],
      data_group: `favorite_menus`,
      info: `List of commands that can appear in various forms`,
      version: 1,
    },
    favorites_menu_tabs: {
      name: `Favorites Menu (Tabs)`,
      type: `list`,
      value: [],
      data_group: `favorite_menus`,
      info: `The favorites menu for Tabs mode`,
      version: 1,
    },
    favorites_menu_history: {
      name: `Favorites Menu (History)`,
      type: `list`,
      value: [],
      data_group: `favorite_menus`,
      info: `The favorites menu for History mode`,
      version: 1,
    },
    favorites_menu_bookmarks: {
      name: `Favorites Menu (${bkmarks})`,
      type: `list`,
      value: [],
      data_group: `favorite_menus`,
      info: `The favorites menu for Bookmarks mode`,
      version: 1,
    },
    favorites_menu_closed: {
      name: `Favorites Menu (Closed)`,
      type: `list`,
      value: [],
      data_group: `favorite_menus`,
      info: `The favorites menu for Closed mode`,
      separator: true,
      version: 1,
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

    ...App.make_mouse_settings({
      what: `favorites_top`,
      title: `Fav Top`,
      click: `none`,
      double_click: `open_new_tab`,
      middle_click: `close_tabs`,
      click_press: `select_pinned_tabs`,
      middle_click_press: `close_pinned_tabs`,
      wheel_up: `scroll_up`,
      wheel_down: `scroll_down`,
      wheel_up_shift: `page_up`,
      wheel_down_shift: `page_down`,
    }),

    ...App.make_mouse_settings({
      what: `favorites_center`,
      title: `Fav Center`,
      wheel_up: `scroll_up`,
      wheel_down: `scroll_down`,
      wheel_up_shift: `page_up`,
      wheel_down_shift: `page_down`,
    }),

    ...App.make_mouse_settings({
      what: `favorites_bottom`,
      title: `Fav Bottom`,
      click: `none`,
      double_click: `open_new_tab_bottom`,
      middle_click: `close_tabs`,
      click_press: `select_normal_tabs`,
      middle_click_press: `close_normal_tabs`,
      wheel_up: `scroll_up`,
      wheel_down: `scroll_down`,
      wheel_up_shift: `page_up`,
      wheel_down_shift: `page_down`,
    }),

    ...App.make_mouse_settings({
      what: `favorites_button`,
      title: `Fav Btn`,
      middle_click: `settings_category_favorites`,
      click_press: `none`,
      middle_click_press: `none`,
      wheel_up: `jump_tabs_all_up`,
      wheel_down: `jump_tabs_all_down`,
    }),

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
      name: `Show Title`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Show the Title at the top`,
      version: 1,
    },
    main_title: {
      name: `Title`,
      type: `text`,
      value: ``,
      no_mirror: true,
      placeholder: `Text to show`,
      info: `The text to show in the Title`,
      version: 1,
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
    main_title_size: {
      name: `Title Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Title`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    main_title_menu: {
      name: `Title Menu`,
      type: `list`,
      value: [
        {cmd: `edit_main_title`},
        {cmd: App.separator_string},
        {cmd: `copy_main_title`},
        {cmd: `toggle_main_title_date`},
        {cmd: `toggle_main_title`},
        {cmd: App.separator_string},
        {cmd: `color_main_title_red`},
        {cmd: `color_main_title_green`},
        {cmd: `color_main_title_blue`},
        {cmd: App.separator_string},
        {cmd: `color_main_title_dark`},
        {cmd: `color_main_title_light`},
        {cmd: `uncolor_main_title`},
        {cmd: App.separator_string},
        {cmd: `settings_category_title`},
      ],
      separator: true,
      info: `Menu to show when right clicking the Title`,
      version: 1,
    },
    show_main_title_left_button: {
      name: `Title Left Button`,
      type: `menu`,
      value: `hover`,
      setup: (key) => {
        App.settings_make_menu(key, App.title_buttons)
      },
      info: `How to show the Title Left Button`,
      version: 1,
    },
    main_title_left_button_size: {
      name: `Title Left Btn Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Title Left Button`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },
    show_main_title_right_button: {
      name: `Title Right Button`,
      type: `menu`,
      value: `hover`,
      setup: (key) => {
        App.settings_make_menu(key, App.title_buttons)
      },
      info: `How to show the Title Right Button`,
      version: 1,
    },
    main_title_right_button_size: {
      name: `Title Right Btn Size`,
      type: `menu`,
      value: `normal`,
      info: `The size of the Title Right Button`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sizes_3)
      },
    },

    ...App.make_mouse_settings({
      what: `main_title`,
      title: `Title`,
      click: `none`,
      double_click: `edit_main_title`,
      middle_click: `toggle_main_title_date`,
      click_press: `edit_global_notes`,
      middle_click_press: `lock_screen`,
      wheel_up: `scroll_main_title_left`,
      wheel_down: `scroll_main_title_right`,
      wheel_up_shift: `previous_main_title_color`,
      wheel_down_shift: `next_main_title_color`,
    }),

    ...App.make_mouse_settings({
      what: `main_title_left_button`,
      title: `Title Left`,
      click: `show_main_title_left_button_menu`,
      double_click: `none`,
      middle_click: `none`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    ...App.make_mouse_settings({
      what: `main_title_right_button`,
      title: `Title Right`,
      click: `show_main_title_right_button_menu`,
      double_click: `none`,
      middle_click: `none`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    main_title_left_button_menu: {
      name: `Title Left Menu`,
      type: `list`,
      value: [
        {cmd: `previous_main_title_color`},
        {cmd: `set_previous_theme`},
        {cmd: `show_previous_mode`},
        {cmd: `browser_back`},
      ],
      info: `Menu to show when clicking the Title Left Button`,
      version: 1,
    },
    main_title_right_button_menu: {
      name: `Title Right Menu`,
      type: `list`,
      value: [
        {cmd: `next_main_title_color`},
        {cmd: `set_next_theme`},
        {cmd: `show_next_mode`},
        {cmd: `browser_forward`},
      ],
      separator: true,
      info: `Menu to show when clicking the Title Right Button`,
      version: 1,
    },
    main_title_font_enabled: {
      name: `Title Font Enabled`,
      type: `checkbox`,
      value: false,
      info: `Override the main font for the Title`,
      version: 1,
    },
    main_title_font: {
      name: `Title Font`,
      type: `text`,
      value: App.default_font,
      placeholder: `Font Name`,
      btns: [`pick`],
      no_empty: true,
      info: `Font to use for the Title
      Pick from the list, or enter a Google Font name, or enter a font URL`,
      version: 1,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_font(e, `main_title_font`)
        })
      },
    },
    main_title_font_size: {
      name: `Title Font Size`,
      type: `menu`,
      value: App.default_font_size,
      placeholder: `Px`,
      info: `Font size for the Title`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(...App.font_sizes, `px`))
      },
    },
    main_title_colors: {
      name: `Title Colors`,
      type: `checkbox`,
      value: true,
      info: `Use custom colors on the Title`,
      version: 2,
    },
    main_title_text_color: {
      name: `Title Text Color`,
      type: `color`,
      value: App.semi_white_color,
      info: `Text color of the Title`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    main_title_background_color: {
      name: `Title Background Color`,
      type: `color`,
      value: `rgba(88, 132, 118, 1)`,
      info: `Background color of the Title`,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    main_title_button_color: {
      name: `Title Button Color`,
      type: `color`,
      value: `rgba(88, 132, 118, 1)`,
      info: `Background color of the Title Buttons`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.start_color_picker(key, true)
      },
    },
    main_title_date: {
      name: `Title Date`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Show the current date or time as the Title.`,
      version: 2,
    },
    main_title_date_format: {
      name: `Title Date Format`,
      type: `text`,
      value: `dddd dS mmmm yyyy`,
      placeholder: `Date Format`,
      separator: true,
      info: `Format to use when showing the date as the Title. ${App.date_format_info}`,
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
    wrap_main_title: {
      name: `Wrap Title`,
      type: `checkbox`,
      value: false,
      info: `Make the title text wrap on long titles`,
      version: 1,
    },
    main_title_border_top: {
      name: `Title Border Top`,
      type: `checkbox`,
      value: false,
      info: `Add a border to the top of the Title`,
      version: 1,
    },
    main_title_border_bottom: {
      name: `Title Border Bottom`,
      type: `checkbox`,
      value: false,
      info: `Add a border to the bottom of the Title`,
      version: 1,
    },
  }

  add_props()
  category = `tags`

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
          {text: App.separator_string},
          {text: `Left`, value: `left`},
          {text: `Right`, value: `right`},
        ])
      },
    },
    taglist_mode: {
      name: `Taglist Mode`,
      type: `menu`,
      value: `show`,
      info: `What to do when clicking the Taglist items`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `None`, value: `none`},
          {text: App.separator_string},
          {text: `Menu`, value: `menu`},
          {text: `Edit`, value: `edit`},
          {text: `Show`, value: `show`},
          {text: `Filter`, value: `filter`},
          {text: `Remove`, value: `remove`},
        ])
      },
    },
    tags_icon: {
      name: `Tags Icon`,
      type: `text_smaller`,
      value: `✝️`,
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: `Icon for tagged tabs`,
      version: 1,
    },
    tags_icon_side: {
      name: `Tags Icon Side`,
      type: `menu`,
      value: `right`,
      info: `Show the Tags Icon on the left or right of text`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.sides)
      },
    },
    show_tags_icon: {
      name: `Show Tags Icon`,
      type: `menu`,
      value: `never`,
      info: `When to show the Tags Icon`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    tags_icon_weight: {
      name: `Tags Icon Weight`,
      type: `menu`,
      value: 1,
      info: `How much to the left or right should the Tags Icon be`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_weight)
      },
    },
    tags_icon_command: {
      name: `Tags Icon Command`,
      type: `menu`,
      value: `edit_tags`,
      info: `Command to run when clicking the Tags Icon`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    },
    custom_tags: {
      name: `Custom Tags`,
      type: `list`,
      value: [
        {tag: `work`},
        {tag: `personal`},
        {tag: `shopping`},
        {tag: `research`},
        {tag: `travel`},
        {tag: `later`},
      ],
      separator: true,
      actions: [`commands`],
      info: `Tag commands to assign to tabs`,
      version: 1,
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
    auto_tag_picker: {
      name: `Auto Tag Picker`,
      type: `checkbox`,
      value: false,
      info: `Add tags quickly with the auto picker`,
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
  category = `triggers`

  props = {
    ...App.make_mouse_settings({
      what: `item_tabs`,
      title: `Item (Tabs)`,
      click: `item_action`,
      double_click: `item_action`,
      middle_click: `close_tabs`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    ...App.make_mouse_settings({
      what: `item_history`,
      title: `Item (History)`,
      click: `item_action`,
      double_click: `item_action`,
      middle_click: `open_items`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    ...App.make_mouse_settings({
      what: `item_bookmarks`,
      title: `Item (${bkmarks})`,
      click: `item_action`,
      double_click: `item_action`,
      middle_click: `open_items`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    ...App.make_mouse_settings({
      what: `item_closed`,
      title: `Item (Closed)`,
      click: `item_action`,
      double_click: `item_action`,
      middle_click: `open_items`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

    ...App.make_mouse_settings({
      what: `items`,
      title: `Items`,
      wheel_up: `scroll_up`,
      wheel_down: `scroll_down`,
      wheel_up_shift: `page_up`,
      wheel_down_shift: `page_down`,
    }),

    ...App.make_mouse_settings({
      what: `main_button`,
      title: `Main Btn`,
      middle_click: `show_main_mode`,
      click_press: `toggle_tab_sort`,
      middle_click_press: `none`,
      wheel_up: `show_previous_mode`,
      wheel_down: `show_next_mode`,
    }),

    ...App.make_mouse_settings({
      what: `playing_button`,
      title: `Playing Btn`,
      click: `jump_tabs_playing_down`,
      middle_click: `toggle_mute_tabs`,
      click_press: `none`,
      middle_click_press: `lock_screen`,
      wheel_up: `jump_tabs_playing_down`,
      wheel_down: `jump_tabs_playing_up`,
    }),

    ...App.make_mouse_settings({
      what: `step_back_button`,
      title: `Step Back Btn`,
      click: `step_back`,
      middle_click: `recent_tabs_forwards`,
      click_press: `none`,
      middle_click_press: `none`,
      wheel_up: `recent_tabs_forwards`,
      wheel_down: `recent_tabs_backwards`,
    }),

    ...App.make_mouse_settings({
      what: `actions_button`,
      title: `Actions Btn`,
      middle_click: `browser_reload`,
      click_press: `edit_global_notes`,
      middle_click_press: `lock_screen`,
      wheel_up: `jump_tabs_all_up`,
      wheel_down: `jump_tabs_all_down`,
    }),

    ...App.make_mouse_settings({
      what: `empty_tabs`,
      title: `Empty (Tabs)`,
      double_click: `open_new_tab_bottom`,
      separator: false,
    }),

    ...App.make_mouse_settings({
      what: `empty_history`,
      title: `Empty (History)`,
      double_click: `show_empty_menu`,
      separator: false,
    }),

    ...App.make_mouse_settings({
      what: `empty_bookmarks`,
      title: `Empty (${bkmarks})`,
      double_click: `show_empty_menu`,
      separator: false,
    }),

    ...App.make_mouse_settings({
      what: `empty_closed`,
      title: `Empty (Closed)`,
      double_click: `show_empty_menu`,
    }),

    ...App.make_mouse_settings({
      what: `unloaded_tab`,
      title: `Unloaded Tab`,
      click: `none`,
      double_click: `none`,
      middle_click: `none`,
      click_press: `none`,
      middle_click_press: `none`,
    }),

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
      separator: true,
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
    wheel_hover_item: {
      name: `Wheel Hover Item`,
      type: `checkbox`,
      value: true,
      info: `Perform actions on the hovered item when using the mousewheel`,
      version: 1,
    },
  }

  add_props()
  category = `warns`

  props = {
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
    warn_on_obfuscate_tabs: {
      name: `Warn On Obfuscate Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when obfuscating tab text`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, App.warn_modes)
      },
    },
    warn_on_deobfuscate_tabs: {
      name: `Warn On Deobfuscate Tabs`,
      type: `menu`,
      value: `multiple`,
      info: `Warn when deobfuscating tab text`,
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
    warn_special_unloaded: {
      name: `Unloaded Special`,
      type: `checkbox`,
      value: false,
      info: `Treat unloaded tabs as special`,
      version: 1,
    },
    warn_special_obfuscated: {
      name: `Obfuscated Special`,
      type: `checkbox`,
      value: false,
      info: `Treat obfuscated tabs as special`,
      version: 1,
    },
    warn_on_empty_tabs: {
      name: `Warn On Empty Tabs`,
      type: `checkbox`,
      value: false,
      info: `Warn on empty tabs`,
      version: 1,
    },
  }

  add_props()
  category = `zones`

  props = {
    split_width: {
      name: `Split Width`,
      type: `menu`,
      value: 2,
      placeholder: `Number`,
      info: `The width of the split borders`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.setting_steps(1, 20, 1, `px`))
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
    header_action: {
      name: `Header Action`,
      type: `menu`,
      value: `activate`,
      info: `What to do when clicking a header`,
      separator: true,
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

    ...App.make_mouse_settings({
      what: `header`,
      title: `Header`,
      double_click: `select_group`,
      middle_click: `normal`,
      click_press: `select_group`,
      middle_click_press: `close_group`,
      setup: (key) => {
        App.settings_make_menu(key, App.header_actions)
      },
    }),

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
    split_padding: {
      name: `Split Padding`,
      type: `checkbox`,
      value: true,
      info: `Add padding above or below splits`,
      version: 1,
    },
    header_icon_pick: {
      name: `Header Icon Pick`,
      type: `checkbox`,
      value: true,
      info: `Enable the header icon pick to select the items below`,
      version: 1,
    },
    hide_zones_on_recent: {
      name: `Hide Zones On Recent`,
      type: `checkbox`,
      value: true,
      info: `Don't show zones like headers or splits when on recent tabs sort`,
      version: 1,
    },
    hide_splits_on_filter: {
      name: `Hide Splits On Filter`,
      type: `checkbox`,
      value: false,
      separator: true,
      info: `Don't show splits top/bottom when on a filtered view`,
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
        App.settings_make_menu(key, App.sides)
      },
    },
    show_color_icon: {
      name: `Show Color Icon`,
      type: `menu`,
      value: `always`,
      info: `When to show the Color Icon`,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.show_icon)
      },
    },
    color_icon_weight: {
      name: `Color Icon Weight`,
      type: `menu`,
      value: 1,
      info: `How much to the right should the Color Icon be`,
      separator: true,
      version: 1,
      setup: (key) => {
        App.settings_make_menu(key, App.icon_weight)
      },
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
        {filter: `today | $day`},
        {filter: `$month | $year`},
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
      separator: true,
      info: `This list appears when middle clicking the Filter
      Used to further refine filtered items`,
      version: 1,
    },

    ...App.make_mouse_settings({
      what: `filter`,
      title: `Filter`,
      double_click: `toggle_main_title`,
      middle_click: `show_refine_filters`,
      click_press: `edit_global_notes`,
      middle_click_press: `lock_screen`,
    }),

    ...App.make_mouse_settings({
      what: `filter_button`,
      title: `Filter Btn`,
      middle_click: `previous_filter`,
      click_press: `none`,
      middle_click_press: `none`,
      wheel_up: `do_prev_filter`,
      wheel_down: `do_next_filter`,
    }),

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
    filter_enter: {
      name: `Filter Enter`,
      type: `menu`,
      value: `never`,
      info: `When to require enter when using the Filter`,
      version: 2,
      setup: (key) => {
        App.settings_make_menu(key, [
          {text: `Never`, value: `never`},
          {text: App.separator_string},
          {text: `Always`, value: `always`},
          {text: `On Normal`, value: `normal`, info: `Modes like Tabs and Closed`},
          {text: `On Search`, value: `search`, info: `Modes like History and Bookmarks`},
        ])
      },
    },
    clock_format: {
      name: `Clock Format`,
      type: `text`,
      value: `h:MM tt Z`,
      placeholder: `Format`,
      btns: [`pick`],
      info: `Clock time format to use in the filter input. Leave empty to disable. ${App.date_format_info}`,
      setup: (key) => {
        DOM.ev(`#settings_${key}_pick`, `click`, (e) => {
          App.pick_clock_format(e)
        })
      },
      version: 1,
    },
    clock_enabled: {
      name: `Clock Enabled`,
      type: `checkbox`,
      value: false,
      info: `Enable the clock in the filter input`,
      separator: true,
      version: 1,
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
      name: `Max Search (${bkmarks})`,
      type: `number`,
      value: 500,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Max items to return on search modes (Bookmarks)`,
      version: 1,
    },
    deep_max_search_items_bookmarks: {
      name: `Deep Search (${bkmarks})`,
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
    filter_containers: {
      name: `Filter Containers`,
      type: `checkbox`,
      value: true,
      info: `Consider containers when using the filter normally, like typing 'work'`,
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
    filter_keep_selected: {
      name: `Filter Keep Selected`,
      type: `checkbox`,
      value: true,
      info: `Keep the selected item on filters instead of selecting the first item`,
      version: 1,
    },
    filter_focus_effect: {
      name: `Filter Focus Effect`,
      type: `checkbox`,
      value: true,
      info: `Show an effect on focused filter inputs`,
      version: 1,
    },
    auto_deep_search_history: {
      name: `Auto Deep (History)`,
      type: `checkbox`,
      value: false,
      info: `Do a deep search automatically when using a text query (History)`,
      version: 1,
    },
    auto_deep_search_bookmarks: {
      name: `Auto Deep (${bkmarks})`,
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
    signals_enabled: {
      name: `Signals Enabled`,
      type: `checkbox`,
      value: true,
      no_mirror: true,
      info: `Enable or disable automatic signals`,
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
    lock_screen_block_signals: {
      name: `Lock Screen Block Signals`,
      type: `checkbox`,
      value: true,
      info: `Block signals when the screen is locked`,
      version: 1,
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
  category = `autoclick`

  props = {
    autoclick_enabled: {
      name: `Autoclick Enabled`,
      type: `checkbox`,
      value: false,
      separator: true,
      no_mirror: true,
      info: `Enable or disable autoclick globally`,
      version: 1,
    },
    item_autoclick: {
      name: `Item Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on items`,
      version: 1,
    },
    item_autoclick_delay: {
      name: `Item Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Item Autoclick`,
      version: 1,
    },
    unloaded_tab_autoclick: {
      name: `Unloaded Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on unloaded tabs`,
      version: 1,
    },
    unloaded_tab_autoclick_delay: {
      name: `Unloaded Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Unloaded Autoclick`,
      version: 1,
    },
    tab_box_autoclick: {
      name: `Tab Box Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on Tab Box items`,
      version: 1,
    },
    tab_box_autoclick_delay: {
      name: `Tab Box Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Tab Box Autoclick`,
      version: 1,
    },
    hover_button_autoclick: {
      name: `Hover Btn Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click the menu when hovering the Hover Button`,
      version: 1,
    },
    hover_button_autoclick_delay: {
      name: `Hover Btn Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Hover Button Autoclick`,
      version: 1,
    },
    close_button_autoclick: {
      name: `Close Btn Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click the menu when hovering the Close Button`,
      version: 1,
    },
    close_button_autoclick_delay: {
      name: `Close Btn Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Close Button Autoclick`,
      version: 1,
    },
    main_button_autoclick: {
      name: `Main Btn Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Main Button`,
      version: 1,
    },
    main_button_autoclick_delay: {
      name: `Main Btn Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Main Button Autoclick`,
      version: 1,
    },
    filter_button_autoclick: {
      name: `Filter Btn Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Filter Button`,
      version: 1,
    },
    filter_button_autoclick_delay: {
      name: `Filter Btn Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Filter Button Autoclick`,
      version: 1,
    },
    actions_button_autoclick: {
      name: `Actions Btn Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Actions Button`,
      version: 1,
    },
    actions_button_autoclick_delay: {
      name: `Actions Btn Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Actions Button Autoclick`,
      version: 1,
    },
    favorites_autoclick: {
      name: `Favorites Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Favorites items`,
      version: 1,
    },
    favorites_autoclick_delay: {
      name: `Favorites Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Favorites Button Autoclick`,
      version: 1,
    },
    main_title_autoclick: {
      name: `Title Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click the menu when hovering the Title Button`,
      version: 1,
    },
    main_title_autoclick_delay: {
      name: `Title Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Title Autoclick`,
      version: 1,
    },
    settings_autoclick: {
      name: `Settings Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click the menu when hovering the Settings buttons`,
      version: 1,
    },
    settings_autoclick_delay: {
      name: `Settings Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Settings Autoclick`,
      version: 1,
    },
    palette_autoclick: {
      name: `Palette Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Command Palette`,
      version: 1,
    },
    palette_autoclick_delay: {
      name: `Palette Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Palette Autoclick`,
      version: 1,
    },
    pinline_autoclick: {
      name: `Pinline Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Command Pinline`,
      version: 1,
    },
    pinline_autoclick_delay: {
      name: `Pinline Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Pinline Autoclick`,
      version: 1,
    },
    footer_autoclick: {
      name: `Footer Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on the Command Footer`,
      version: 1,
    },
    footer_autoclick_delay: {
      name: `Footer Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      separator: true,
      info: `Delay in milliseconds for Footer Autoclick`,
      version: 1,
    },
    context_autoclick: {
      name: `Context Autoclick`,
      type: `checkbox`,
      value: false,
      info: `Auto-click on context menus`,
      version: 1,
    },
    context_autoclick_delay: {
      name: `Context Autoclick Delay`,
      type: `number`,
      value: App.autoclick_delay,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay in milliseconds for Context Autoclick`,
      version: 1,
    },
  }

  add_props()
  category = `compact`

  props = {
    compact_extra_menu: {
      name: `Compact Extra Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Extra Button Menu`,
      version: 1,
    },
    compact_favorites_menu: {
      name: `Compact Favorites Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Favorites Menu`,
      version: 1,
    },
    compact_pinline_menu: {
      name: `Compact Pinline Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Pinline Menu`,
      version: 1,
    },
    compact_main_title_menu: {
      name: `Compact Title Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Title Menu`,
      version: 1,
    },
    compact_main_title_left_button_menu: {
      name: `Compact Title Left Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Title Left Menu`,
      version: 1,
    },
    compact_main_title_right_button_menu: {
      name: `Compact Title Right Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Title Right Menu`,
      version: 1,
    },
    compact_footer_menu: {
      name: `Compact Footer Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Footer Menu`,
      version: 1,
    },
    compact_hover_button_menu: {
      name: `Compact Hover Button Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Hover Button Menu`,
      version: 1,
    },
    compact_close_button_menu: {
      name: `Compact Close Button Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Close Button Menu`,
      version: 1,
    },
    compact_color_menu: {
      name: `Compact Color Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Color Menu`,
      version: 1,
    },
    compact_filter_menu: {
      name: `Compact Filter Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Filter Menu`,
      version: 1,
    },
    compact_item_menu: {
      name: `Compact Item Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Item Menu`,
      version: 1,
    },
    compact_actions_menu: {
      name: `Compact Actions Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Actions Menu`,
      version: 1,
    },
    compact_empty_menu: {
      name: `Compact Empty Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Empty Menu`,
      version: 1,
    },
    compact_stuff_menu: {
      name: `Compact Stuff Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Stuff Menu`,
      version: 1,
    },
    compact_container_menu: {
      name: `Compact Container Menu`,
      type: `checkbox`,
      value: false,
      info: `Only show icons in the Container Menu`,
      version: 1,
    },
  }

  add_props()
  category = `more`

  props = {
    max_recent_tabs: {
      name: `Max Recent Tabs`,
      type: `number`,
      value: 15,
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
      min: App.number_min,
      max: App.number_max,
      info: `Delay in milliseconds between Command Combo commands`,
      version: 1,
    },
    mouse_inside_delay: {
      name: `Mouse Inside Delay`,
      type: `number`,
      value: 300,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay in milliseconds for effects like Global when the mouse enters`,
      version: 1,
    },
    mouse_outside_delay: {
      name: `Mouse Outside Delay`,
      type: `number`,
      value: 800,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay in milliseconds for effects like Global when the mouse leaves`,
      version: 1,
    },
    context_autohide_delay: {
      name: `Context Autohide Delay`,
      type: `number`,
      value: 800,
      placeholder: `Number`,
      min: App.number_min,
      max: App.number_max,
      info: `Delay in milliseconds for Context Autohide`,
      version: 1,
    },
    obfuscate_symbol: {
      name: `Obfuscate Symbol`,
      type: `text_smaller`,
      value: `x`,
      no_empty: true,
      character: true,
      placeholder: `Symbol`,
      info: `Symbol to use on obfuscated text`,
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
    obfuscate_text: {
      name: `Obfuscate Text`,
      type: `checkbox`,
      value: true,
      info: `Obfuscate the text when the tab is obfuscated`,
      version: 1,
    },
    obfuscate_icons: {
      name: `Obfuscate Icons`,
      type: `checkbox`,
      value: true,
      info: `Obfuscate the icons when the tab is obfuscated`,
      version: 1,
    },
    fill_elements: {
      name: `Fill Elements`,
      type: `checkbox`,
      value: false,
      info: `Fill item elements immediately instead of using the observer`,
      version: 1,
    },
    context_autohide: {
      name: `Context Autohide`,
      type: `checkbox`,
      value: false,
      info: `Autohide context menus when the mouse moves away from them`,
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
    short_commands: {
      name: `Short Commands`,
      type: `checkbox`,
      value: false,
      info: `Prefer short command name versions when displaying them
      Like 'Red' instead of 'Color Red'`,
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
    instant_recent: {
      name: `Instant Recent`,
      type: `checkbox`,
      value: false,
      info: `Move focused items to the top on Recent tabs mode instantly`,
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
      info: `Show or hide some components`,
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
    tags: {
      info: `Configure Tags and the Taglist`,
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
    pinline: {
      info: `Configure the Pinline
      This is a component that separates pinned tabs from normal tabs`,
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
      info: `Run commands on certain mouse and keyboard actions`,
    },
    gestures: {
      info: `You perform gestures by holding the middle mouse button, moving in a direction, and releasing the button
      Each gesture runs a specified command
      You can also set the sensitivity of the gestures`,
    },
    signals: {
      info: `Signals are network requests the extension does
      You can configure them to use GET, or POST, etc
      You can define what arguments are sent
      Signals are able to show feedback in a popup message
      or update the Title on response. They can also run automatically
      at a specified time interval, measured in seconds`,
    },
    browser: {
      info: `Browser Commands are shortcuts that you configure on the browser
      Click 'Manage Extension', then click the cog on the top right
      Then click 'Manage Extension Shortcuts' and add the shortcuts you need
      Popup Commands open the popup first before running the command`,
    },
    autoclick: {
      info: `Enable auto-click actions on some components`,
    },
    compact: {
      info: `Compact some menus to only show icons in a row`,
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
  App.sort_catprops()
  App.check_setting_overrides()
}

App.sort_catprops = () => {
  let sorted_props = {}
  let keys = Object.keys(App.setting_catprops)
  let general = keys.splice(keys.indexOf(`general`), 1)[0]
  let more = keys.splice(keys.indexOf(`more`), 1)[0]

  keys.sort()

  sorted_props[general] = App.setting_catprops[general]

  for (let key of keys) {
    sorted_props[key] = App.setting_catprops[key]
  }

  sorted_props[more] = App.setting_catprops[more]
  App.setting_catprops = sorted_props
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