# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :oura_dashboard,
  ecto_repos: [OuraDashboard.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :oura_dashboard, OuraDashboardWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: OuraDashboardWeb.ErrorHTML, json: OuraDashboardWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: OuraDashboard.PubSub,
  live_view: [signing_salt: "KRjDIY4t"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :oura_dashboard, OuraDashboard.Mailer, adapter: Swoosh.Adapters.Local

# config :oura_dashboard, zin_personal_token: "PERSONAL TOKEN 1"
# config :oura_dashboard, balen_personal_token: "PERSON TOKEN 2"

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.0",
  oura_dashboard: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
