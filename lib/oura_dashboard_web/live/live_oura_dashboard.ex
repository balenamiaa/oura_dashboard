defmodule OuraDashboardWeb.LiveOuraDashboard do
  use OuraDashboardWeb, :live_view_no_pad
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
    <.Dashboard chartItemsTrends={@chart_items_trends} chartItemsComposition={@chart_items_composition} chartsData={@charts_data} startDateStr={@start_date_str} endDateStr={@end_date_str} />
    """
  end

  def mount(_params, _session, socket) do
    current_date = Date.utc_today()
    current_date_month_start = Date.beginning_of_month(current_date)
    start_date_str = Date.to_iso8601(current_date_month_start)
    end_date_str = Date.to_iso8601(Date.end_of_month(current_date_month_start))

    socket =
      assign(socket,
        chart_items_trends: @chart_items_trends,
        chart_items_composition: @chart_items_composition,
        start_date_str: start_date_str,
        end_date_str: end_date_str,
        charts_data: nil
      )

    self_pid = self()

    Task.start(fn ->
      oura_data = get_oura_data(start_date_str, end_date_str)
      charts_data = OuraDashboard.ChartsData.generate_charts_data(oura_data)
      send(self_pid, {:update_charts_data, charts_data})
    end)

    {:ok, socket}
  end

  def handle_event("date_changed", %{"start_date_str" => start_date_str, "end_date_str" => end_date_str}, socket) do
    oura_data = get_oura_data(start_date_str, end_date_str)
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
