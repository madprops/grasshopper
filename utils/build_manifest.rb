#!/usr/bin/env ruby
require "json"

base_file = "manifest_base.json"
output_file = "manifest.json"

raw_data = File.read(base_file)
manifest = JSON.parse(raw_data)

target = ARGV[0]

# Clean the base state
manifest["optional_permissions"].delete("<all_urls>")
manifest.delete("optional_host_permissions")

if target == "chrome"
  manifest["background"] = {
    "service_worker" => "background/background.js",
    "type" => "module"
  }
  manifest["optional_host_permissions"] = ["<all_urls>"]
else
  manifest["background"] = {
    "scripts" => ["background/background.js"],
    "type" => "module"
  }
  manifest["optional_permissions"].push("<all_urls>")
end

File.write(output_file, JSON.pretty_generate(manifest))

puts "Generated manifest for #{target}"