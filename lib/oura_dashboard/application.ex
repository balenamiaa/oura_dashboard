defmodule OuraDashboard.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {NodeJS.Supervisor, [path: LiveSvelte.SSR.NodeJS.server_path(), pool_size: 4]},
      {Ecto.Migrator, repos: Application.fetch_env!(:oura_dashboard, :ecto_repos), skip: skip_migrations?()},
      OuraDashboard.Repo,
      OuraDashboardWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:oura_dashboard, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: OuraDashboard.PubSub},
      # Start a worker by calling: OuraDashboard.Worker.start_link(arg)
      # {OuraDashboard.Worker, arg},
      # Start to serve requests, typically the last entry
      OuraDashboard.DataFetcher,
      OuraDashboardWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: OuraDashboard.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    OuraDashboardWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp skip_migrations?() do
    # By default, sqlite migrations are run when using a release
    System.get_env("RELEASE_NAME") != nil
  end
end
