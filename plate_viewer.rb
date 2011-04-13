require 'compass'
require 'erb'
require 'sinatra'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"

configure do
  Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
end

get "/stylesheets/:name.css" do
  content_type 'text/css', :charset => 'utf-8'
  
  # Use views/stylesheets & blueprint's stylesheet dirs in the Sass load path
  scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
end

def empty_well_hash
  plate_cols = 12
  well_hash  = {}
  
  ('A'..'H').each do |row_label|
    well_hash[row_label]  = Array.new(plate_cols)
  end
  
  well_hash
end

get '/' do
  @well_hash = empty_well_hash
  erb :index
end