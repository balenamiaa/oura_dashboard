defmodule OuraDashboardWeb.Components.TopbarLive do
  use Phoenix.LiveComponent
  use LiveSvelte.Components

  def render(assigns) do
    ~H"""
    <div>
      <.Topbar />
    </div>
    """
  end
end
