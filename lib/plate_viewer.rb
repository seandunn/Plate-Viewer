require 'sinatra'
require 'erb'
require 'sass'

get '/' do
  erb :index
end