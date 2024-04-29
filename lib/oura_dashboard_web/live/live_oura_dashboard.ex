defmodule OuraDashboardWeb.LiveOuraDashboard do
  use OuraDashboardWeb, :live_view
  use LiveSvelte.Components

  @chart_items_trends [
    "Heart Rate",
    "MET",
    "Sleep Score",
    "Sleep Debt",
    "HRV",
    "Calories",
    "Readiness"
  ]

  @chart_items_composition [
    "Sleep Phases",
    "Activity Contributors",
    "Readiness Contributors",
    "Heart Rate Zones",
    "Activity Time Proportions",
    "Sleep Type Proportions"
  ]

  def render(assigns) do
    ~H"""
    <.Dashboard chartItemsTrends={@chart_items_trends} chartItemsComposition={@chart_items_composition} chartsData={@charts_data} startDate={@start_date} />
    """
  end

  def mount(_params, _session, socket) do
    current_date = Date.utc_today()
    current_date_month_start = Date.beginning_of_month(current_date)
    start_date_str = Date.to_iso8601(current_date_month_start)

    socket =
      assign(socket,
        chart_items_trends: @chart_items_trends,
        chart_items_composition: @chart_items_composition,
        start_date: start_date_str,
        charts_data: nil
      )

    self_pid = self()

    Task.start(fn ->
      date_month_end = Date.end_of_month(current_date_month_start)
      oura_data = get_oura_data(start_date_str, Date.to_iso8601(date_month_end))
      charts_data = OuraDashboard.ChartsData.generate_charts_data(oura_data)
      send(self_pid, {:update_charts_data, charts_data})
    end)

    {:ok, socket}
  end

  def handle_event("dateChanged", %{"month" => month, "year" => year}, socket) do
    {:ok, start_date} = Date.new(year, month + 1, 1)
    end_date = Date.end_of_month(start_date)
    oura_data = get_oura_data(Date.to_iso8601(start_date), Date.to_iso8601(end_date))
    charts_data = OuraDashboard.ChartsData.generate_charts_data(oura_data)
    {:noreply, assign(socket, :charts_data, charts_data)}
  end

  def handle_info({:update_charts_data, charts_data}, socket) do
    {:noreply, assign(socket, :charts_data, charts_data)}
  end

  defp get_oura_data(start_date, end_date) do
    {:ok, data} = GenServer.call(OuraDashboard.DataFetcher, {:fetch_data, start_date, end_date}, :infinity)
    data
  end
end
