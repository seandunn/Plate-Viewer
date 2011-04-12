# Generated by cucumber-sinatra. (2011-04-07 14:57:28 +0100)

ENV['RACK_ENV'] = 'test'

require File.join(File.dirname(__FILE__), '..', '..', 'lib/plate_viewer.rb')

require 'capybara'
require 'capybara/cucumber'
require 'rspec'

Capybara.app = PlateViewer

class PlateViewerWorld
  include Capybara
  include RSpec::Expectations
  include RSpec::Matchers
end

World do
  PlateViewerWorld.new
end