#!/usr/bin/env ruby
require "json"
require "fileutils"

# Read the manifest
file = File.read("manifest.json")
manifest = JSON.parse(file)
version = manifest["version"].gsub(".", "_")
name = manifest["name"].downcase.split.join("_")
bname = ARGV[0] or "generic"

# Delete the old zip file
old_name = Dir.glob("#{name}_#{bname}*.zip").first

if old_name
  if File.exist?(old_name)
    File.delete(old_name)
    puts "Removed #{old_name}"
  end
end

new_name = "#{name}_#{bname}_v#{version}.zip"

`zip -r #{new_name} * -x "*.zip" "node_modules/*" "package-lock.json" ".eslintcache" ".directory"`
puts "Created #{new_name}"