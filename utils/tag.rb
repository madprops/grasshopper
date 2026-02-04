#!/usr/bin/env ruby
require "git"
require "json"

file = File.read("manifest.json")
manifest = JSON.parse(file)
version = manifest["version"]
name = "v#{version}"

repo = Git.open(".")

# Check if the tag already exists in the local repository
existing_tags = repo.tags.map { |t| t.name }

if existing_tags.include?(name)
  puts "Tag #{name} already exists locally. Skipping creation..."
else
  repo.add_tag(name)
  puts "Created tag: #{name}"
end

# Attempt to push the tag to origin
# Added a rescue block in case the tag already exists on the remote too
begin
  repo.push("origin", name)
  puts "Pushed tag #{name} to origin"
rescue Git::GitExecuteError => e
  if e.message.include?("already exists")
    puts "Tag #{name} already exists on remote origin."
  else
    raise e
  end
end