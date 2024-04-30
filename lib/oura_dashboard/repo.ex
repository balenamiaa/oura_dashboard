defmodule OuraDashboard.Repo do
  use Ecto.Repo,
    otp_app: :oura_dashboard,
    adapter: Ecto.Adapters.SQLite3
end
