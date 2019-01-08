workflow "Lint" {
  on = "push"
  resolves = ["Lint Code"]
}

action "Install Dependencies" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  runs = "npm ci"
}

action "Lint Code" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["Install Dependencies"]
  runs = "npm run lint"
}
