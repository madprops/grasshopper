#!/usr/bin/env ruby
ans_1 = `cd js/main && goldie "console.log" && goldie '/(?<!\\\\)"/'`
ans_2 = `cd js/main && find . -type f -exec awk 'BEGIN { prev = "" } NR > 1 && prev == "" && $0 == "" { print FILENAME ":" NR - 1 } { prev = $0 }' {} \\;`
ans_1 = ans_1.gsub(/^\s*$/, "").strip
ans_2 = ans_2.gsub(/^\s*$/, "").strip

if ans_1.length > 0
  puts "--- Unwanted Code ---"
  puts ans_1
end

if ans_2.length > 0
  if ans_1.length > 0
    puts ""
  end

  puts "--- Multiple Lines ---"
  puts ans_2
end

if ans_1.length == 0 && ans_2.length == 0
  puts "\e[32mAll good!\e[0m"
end