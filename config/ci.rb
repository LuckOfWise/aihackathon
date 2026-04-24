# Run using bin/ci

CI.run do
  step "Setup", "bin/setup --skip-server"

  step "Lint", "bin/lint"
  step "Test", "bin/test"

  step "Security: Gem audit", "bin/bundler-audit"
  step "Security: Brakeman", "bin/brakeman --quiet --no-pager --exit-on-warn --exit-on-error"
end
