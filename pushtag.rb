#!/usr/bin/env ruby
require "git"
require "json"
file = File.read("manifest.json")
manifest = JSON.parse(file)
version = manifest["version"]
name = "v#{version}"
repo = Git.open(".")
repo.add_tag(name)
repo.push("origin", name)
puts "Created tag: #{name}"