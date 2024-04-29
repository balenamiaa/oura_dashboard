defmodule OuraDashboard.DataFetcher do
  use GenServer

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ets.new(:oura_cache, [:named_table, :public, write_concurrency: true]), name: __MODULE__)
  end

  def init(cache) do
    {:ok, %{oura_cache: cache}}
  end

  def handle_call({:fetch_data, start_date, end_date}, _from, %{oura_cache: cache} = state) do
    case Process.get(:fetching) do
      true ->
        {:reply, :busy, state}

      _ ->
        Process.put(:fetching, true)

        cache_key = "data_#{start_date}_#{end_date}"

        case :ets.lookup(cache, cache_key) do
          [{^cache_key, data}] ->
            Process.put(:fetching, false)
            {:reply, {:ok, data}, state}

          [] ->
            data = OuraDashboard.OuraDataStore.fetch_data(start_date, end_date)

            :ets.insert(cache, {cache_key, data})

            Process.put(:fetching, false)
            {:reply, {:ok, data}, state}
        end
    end
  end
end
