# -*- encoding: utf-8 -*-
require File.expand_path('../lib/hydrant-engage/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = ["phuongdh"]
  gem.email         = ["phuongdh@gmail.com"]
  gem.description   = %q{Matterhorn Engage player}
  gem.summary       = %q{This is a Flash/HTML5 player forked from Matterhorn}
  gem.homepage      = "http://github.com/variations-on-video/hydrant-engage"

  #gem.files         = Dir["{lib}/**/*", "{app}/**/*", "{public}/**/**", "{config}/**/*"]
  gem.files = Dir["lib/**/*"] + Dir["vendor/**/*"] + Dir["app/**/*"] + Dir["public/**"] + ["Rakefile", "README.md"]

  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.name          = "hydrant-engage"
  gem.require_paths = ["lib"]
  gem.version       = Hydrant::Engage::VERSION

  gem.add_runtime_dependency     'less-rails', '~> 2.2.3'
  gem.add_development_dependency 'rails'
end
