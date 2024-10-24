# -*- encoding: utf-8 -*-
# stub: jekyll-category-pages 1.1.2 ruby lib

Gem::Specification.new do |s|
  s.name = "jekyll-category-pages".freeze
  s.version = "1.1.2".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Dr. Wolfram Schroers".freeze]
  s.date = "2021-10-18"
  s.description = "This plugin is for all authors that tag their pages using categories. It generates\ncategory overview pages with a custom layout. Optionally, it also adds proper\npagination for these pages.\n\nPlease refer to the README.md file on the project homepage at\nhttps://github.com/field-theory/jekyll-category-pages\n".freeze
  s.email = "Wolfram.Schroers@field-theory.org".freeze
  s.homepage = "https://github.com/field-theory/jekyll-category-pages".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.1.4".freeze
  s.summary = "Add category index pages with and without pagination.".freeze

  s.installed_by_version = "3.5.22".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<jekyll>.freeze, ["~> 4.0".freeze])
  s.add_runtime_dependency(%q<jekyll-paginate>.freeze, ["~> 1.1".freeze, ">= 1.0.0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, ["~> 3.0".freeze])
end
