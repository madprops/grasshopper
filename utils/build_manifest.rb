#!/usr/bin/env ruby
require "json"

base_file = "manifest_base.json"
output_file = "manifest.json"

raw_data = File.read(base_file)
manifest = JSON.parse(raw_data)

target = ARGV[0]

# Clean the base state
manifest["optional_permissions"]&.delete("<all_urls>")
manifest.delete("optional_host_permissions")

if target == "chrome"
  manifest["background"] = {
    "service_worker" => "background/background.js",
    "type" => "module"
  }

  manifest["optional_host_permissions"] = ["<all_urls>"]

  # 1. Remove Firefox-only permissions
  manifest["permissions"]&.delete("contextualIdentities")
  manifest["permissions"]&.delete("cookies")

  # 2. Strip Firefox-specific settings (Gecko ID)
  # Chrome will throw an "Unrecognized manifest key" warning if this is left in.
  manifest.delete("browser_specific_settings")
else
  manifest["background"] = {
    "scripts" => ["background/background.js"],
    "type" => "module"
  }

  # Ensure the array exists before pushing
  manifest["optional_permissions"] ||= []
  manifest["optional_permissions"].push("<all_urls>")
end

File.write(output_file, JSON.pretty_generate(manifest))
puts "Generated manifest for #{target}"