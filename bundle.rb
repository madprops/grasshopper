#!/usr/bin/env ruby
require "fileutils"

def bundle(what)
  directory = "js/#{what}"
  content = []

  Dir.glob(File.join(directory, "*.js")).each do |file|
    content << File.read(file)
  end

  bundle = content.join("\n")
  output = File.join("js", "bundle.#{what}.js")
  File.open(output, 'w') { |file| file.write(bundle) }
  puts "Bundled #{what} to #{output}"
end

bundle("libs")
bundle("main")