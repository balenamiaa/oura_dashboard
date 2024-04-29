defmodule OuraDashboard.ChartsData.SleepDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :value]
end

defmodule OuraDashboard.ChartsData.SleepDebtDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :cumulative_debt]
end

defmodule OuraDashboard.ChartsData.SleepPhaseDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :light, :deep, :rem]
end

defmodule OuraDashboard.ChartsData.HeartRateDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :bpm]
end

defmodule OuraDashboard.ChartsData.HRVDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :ms]
end

defmodule OuraDashboard.ChartsData.CalorieDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :calories]
end

defmodule OuraDashboard.ChartsData.ReadinessDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :score]
end

defmodule OuraDashboard.ChartsData.ReadinessContributorDataPoint do
  @derive Jason.Encoder
  defstruct [
    :timestamp,
    :activity_balance,
    :body_temperature,
    :hrv_balance,
    :previous_day_activity,
    :previous_night,
    :recovery_index,
    :sleep_balance,
    :resting_heart_rate
  ]
end

defmodule OuraDashboard.ChartsData.HeartRateZone do
  @type t :: :resting_heart_rate | :light | :moderate | :vigorous | :maximum
end

defmodule OuraDashboard.ChartsData.HeartRateSource do
  @type t :: :oura_ring | :oura_unknown | :polar_chest_strap | :unknown
end

defmodule OuraDashboard.ChartsData.HeartRateDurations do
  @derive Jason.Encoder
  defstruct durations: List.duplicate(List.duplicate(0, 6), 5)
end

defmodule OuraDashboard.ChartsData.HeartRateZoneDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :durations]
end

defmodule OuraDashboard.ChartsData.METDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :met_value]
end

defmodule OuraDashboard.ChartsData.ActivityContributorDataPoint do
  @derive Jason.Encoder
  defstruct [
    :timestamp,
    :meet_daily_targets,
    :move_every_hour,
    :recovery_time,
    :stay_active,
    :training_frequency,
    :training_volume
  ]
end

defmodule OuraDashboard.ChartsData.ActivityTimeDataPoint do
  @derive Jason.Encoder
  defstruct [:timestamp, :high, :medium, :low, :sedentary]
end

defmodule OuraDashboard.ChartsData do
  @derive Jason.Encoder
  defstruct sleep_score_data_zin: [],
            sleep_score_data_balen: [],
            sleep_debt_data_zin: [],
            sleep_debt_data_balen: [],
            sleep_phases_data_zin: [],
            sleep_phases_data_balen: [],
            heart_rate_data_zin: [],
            heart_rate_data_balen: [],
            hrv_data_zin: [],
            hrv_data_balen: [],
            calorie_data_zin: [],
            calorie_data_balen: [],
            readiness_data_zin: [],
            readiness_data_balen: [],
            sleep_type_proportion_zin: %{},
            sleep_type_proportion_balen: %{},
            readiness_contributors_data_zin: [],
            readiness_contributors_data_balen: [],
            heart_rate_zones_data_zin: [],
            heart_rate_zones_data_balen: [],
            met_data_zin: [],
            met_data_balen: [],
            activity_contributors_data_zin: [],
            activity_contributors_data_balen: [],
            activity_time_data_zin: [],
            activity_time_data_balen: []

  alias OuraDashboard.ChartsData.{
    SleepDataPoint,
    SleepDebtDataPoint,
    SleepPhaseDataPoint,
    HeartRateDataPoint,
    HRVDataPoint,
    CalorieDataPoint,
    ReadinessDataPoint,
    ReadinessContributorDataPoint,
    HeartRateZone,
    HeartRateSource,
    HeartRateDurations,
    HeartRateZoneDataPoint,
    METDataPoint,
    ActivityContributorDataPoint,
    ActivityTimeDataPoint
  }

  @sleep_debt_baseline 28_800

  defp to_datetime(date, end_of_day \\ false) do
    date
    |> DateTime.new(~T[00:00:00])
    |> elem(1)
    |> DateTime.add(if(end_of_day, do: 86_400, else: 0), :second)
  end

  defp to_date_only(datetime) do
    datetime
    |> DateTime.to_naive()
    |> NaiveDateTime.to_date()
  end

  defp bpm_to_zone(bpm) do
    cond do
      bpm < 80 -> 0
      bpm >= 90 and bpm <= 119 -> 1
      bpm <= 150 -> 2
      bpm <= 179 -> 3
      true -> 4
    end
  end

  defp calculate_zones(models) do
    models
    |> Enum.group_by(&to_date_only(DateTime.from_iso8601(&1.timestamp) |> elem(1)))
    |> Enum.map(fn {day, daily_models} ->
      timestamp = to_datetime(day) |> DateTime.to_unix()

      durations =
        Enum.reduce(daily_models, %HeartRateDurations{}, fn model, acc ->
          zone = bpm_to_zone(model.bpm)
          source_index = heart_rate_source_to_index(model.source)

          update_in(
            acc,
            [Access.key!(:durations), Access.at(zone), Access.at(source_index)],
            &(&1 + 300)
          )
        end)

      %HeartRateZoneDataPoint{timestamp: timestamp, durations: durations}
    end)
  end

  defp heart_rate_source_to_index("awake"), do: 0
  defp heart_rate_source_to_index("rest"), do: 1
  defp heart_rate_source_to_index("sleep"), do: 2
  defp heart_rate_source_to_index("session"), do: 3
  defp heart_rate_source_to_index("live"), do: 4
  defp heart_rate_source_to_index("workout"), do: 5

  @spec generate_charts_data(
          atom()
          | %{
              :daily_activity_data_balen => any(),
              :daily_activity_data_zin => any(),
              :daily_readiness_data_balen => any(),
              :daily_readiness_data_zin => any(),
              :daily_sleep_data_balen => any(),
              :daily_sleep_data_zin => any(),
              :heartrate_data_balen => any(),
              :heartrate_data_zin => any(),
              :sleep_data_balen => any(),
              :sleep_data_zin => any(),
              optional(any()) => any()
            }
        ) :: any()
  def generate_charts_data(oura_data_store) do
    charts_data =
      %OuraDashboard.ChartsData{}
      |> process_data(
        oura_data_store.sleep_data_zin,
        oura_data_store.daily_sleep_data_zin,
        oura_data_store.heartrate_data_zin,
        oura_data_store.daily_activity_data_zin,
        oura_data_store.daily_readiness_data_zin,
        &Kernel.+/2,
        :zin
      )
      |> process_data(
        oura_data_store.sleep_data_balen,
        oura_data_store.daily_sleep_data_balen,
        oura_data_store.heartrate_data_balen,
        oura_data_store.daily_activity_data_balen,
        oura_data_store.daily_readiness_data_balen,
        &Kernel.+/2,
        :balen
      )

    charts_data
  end

  defp process_data(
         charts_data,
         sleep_models,
         daily_sleep_models,
         heart_rate_models,
         daily_activity_models,
         daily_readiness_models,
         sleep_debt_func,
         user
       ) do
    sleep_score_data_key = String.to_atom("sleep_score_data_#{user}")
    sleep_debt_data_key = String.to_atom("sleep_debt_data_#{user}")
    sleep_phases_data_key = String.to_atom("sleep_phases_data_#{user}")
    heart_rate_data_key = String.to_atom("heart_rate_data_#{user}")
    hrv_data_key = String.to_atom("hrv_data_#{user}")
    calorie_data_key = String.to_atom("calorie_data_#{user}")
    readiness_data_key = String.to_atom("readiness_data_#{user}")
    activity_contributors_data_key = String.to_atom("activity_contributors_data_#{user}")
    heart_rate_zones_data_key = String.to_atom("heart_rate_zones_data_#{user}")
    sleep_type_proportion_key = String.to_atom("sleep_type_proportion_#{user}")
    met_data_key = String.to_atom("met_data_#{user}")
    activity_time_data_key = String.to_atom("activity_time_data_#{user}")
    readiness_contributors_data_key = String.to_atom("readiness_contributors_data_#{user}")

    {charts_data, _} =
      Enum.reduce(
        sleep_models |> Enum.group_by(& &1.day),
        {charts_data, 0},
        fn {day, daily_models}, {acc_charts_data, acc_sleep_debt} ->
          timestamp = to_datetime(day) |> DateTime.to_unix()

          light = daily_models |> sum_fun(&(&1.light_sleep_duration || 0)) |> div(3600)
          deep = daily_models |> sum_fun(&(&1.deep_sleep_duration || 0)) |> div(3600)
          rem = daily_models |> sum_fun(&(&1.rem_sleep_duration || 0)) |> div(3600)

          charts_data =
            if(light + deep + rem > 0) do
              update_in(
                acc_charts_data,
                [Access.key!(sleep_phases_data_key)],
                &[%SleepPhaseDataPoint{timestamp: timestamp, light: light, deep: deep, rem: rem} | &1]
              )
            else
              acc_charts_data
            end

          hrv =
            daily_models
            |> Enum.reject(&is_nil(&1.hrv))
            |> Enum.map(fn model ->
              model.hrv.items
              |> Enum.reject(&is_nil/1)
              |> Enum.sum()
              |> Kernel./(Enum.count(model.hrv.items))
            end)
            |> Enum.sum()
            |> Kernel./(Enum.count(daily_models))

          charts_data =
            if hrv != :infinity do
              update_in(
                charts_data,
                [Access.key!(hrv_data_key)],
                &[%HRVDataPoint{timestamp: timestamp, ms: hrv} | &1]
              )
            else
              charts_data
            end

          total_sleep = daily_models |> sum_fun(&(&1.total_sleep_duration || 0))
          sleep_debt = sleep_debt_func.(acc_sleep_debt, @sleep_debt_baseline - total_sleep)

          charts_data =
            update_in(
              charts_data,
              [Access.key!(sleep_debt_data_key)],
              &[%SleepDebtDataPoint{timestamp: timestamp, cumulative_debt: sleep_debt / 3600} | &1]
            )

          {charts_data, sleep_debt}
        end
      )

    charts_data =
      Enum.reduce(daily_sleep_models, charts_data, fn model, acc_charts_data ->
        update_in(
          acc_charts_data,
          [Access.key!(sleep_score_data_key)],
          &[%SleepDataPoint{timestamp: to_datetime(model.day) |> DateTime.to_unix(), value: model.score} | &1]
        )
      end)

    charts_data =
      Enum.reduce(heart_rate_models, charts_data, fn model, acc_charts_data ->
        update_in(
          acc_charts_data,
          [Access.key!(heart_rate_data_key)],
          &[
            %HeartRateDataPoint{
              timestamp: DateTime.from_iso8601(model.timestamp) |> elem(1) |> DateTime.to_unix(),
              bpm: model.bpm
            }
            | &1
          ]
        )
      end)

    charts_data =
      Enum.reduce(daily_activity_models, charts_data, fn model, acc_charts_data ->
        charts_data =
          update_in(
            acc_charts_data,
            [Access.key!(calorie_data_key)],
            &[%CalorieDataPoint{timestamp: to_datetime(model.day) |> DateTime.to_unix(), calories: model.active_calories} | &1]
          )

        met =
          model.met.items
          |> Enum.reject(&is_nil/1)
          |> Enum.sum()
          |> Kernel./(Enum.count(model.met.items))

        charts_data =
          if met != :infinity do
            update_in(
              charts_data,
              [Access.key!(met_data_key)],
              &[%METDataPoint{timestamp: to_datetime(model.day) |> DateTime.to_unix(), met_value: met} | &1]
            )
          else
            charts_data
          end

        charts_data =
          update_in(
            charts_data,
            [Access.key!(activity_contributors_data_key)],
            &[
              %ActivityContributorDataPoint{
                timestamp: to_datetime(model.day) |> DateTime.to_unix(),
                meet_daily_targets: model.contributors.meet_daily_targets,
                move_every_hour: model.contributors.move_every_hour,
                recovery_time: model.contributors.recovery_time,
                stay_active: model.contributors.stay_active,
                training_frequency: model.contributors.training_frequency,
                training_volume: model.contributors.training_volume
              }
              | &1
            ]
          )

        update_in(
          charts_data,
          [Access.key!(activity_time_data_key)],
          &[
            %ActivityTimeDataPoint{
              timestamp: to_datetime(model.day) |> DateTime.to_unix(),
              high: model.high_activity_time,
              medium: model.medium_activity_time,
              low: model.low_activity_time,
              sedentary: model.sedentary_time
            }
            | &1
          ]
        )
      end)

    charts_data =
      Enum.reduce(daily_readiness_models, charts_data, fn model, acc_charts_data ->
        charts_data =
          update_in(
            acc_charts_data,
            [Access.key!(readiness_data_key)],
            &[%ReadinessDataPoint{timestamp: to_datetime(model.day) |> DateTime.to_unix(), score: model.score || 0.0} | &1]
          )

        update_in(
          charts_data,
          [Access.key!(readiness_contributors_data_key)],
          &[
            %ReadinessContributorDataPoint{
              timestamp: to_datetime(model.day) |> DateTime.to_unix(),
              activity_balance: model.contributors.activity_balance,
              body_temperature: model.contributors.body_temperature,
              hrv_balance: model.contributors.hrv_balance,
              previous_day_activity: model.contributors.previous_day_activity,
              previous_night: model.contributors.previous_night,
              recovery_index: model.contributors.recovery_index,
              sleep_balance: model.contributors.sleep_balance,
              resting_heart_rate: model.contributors.resting_heart_rate
            }
            | &1
          ]
        )
      end)

    charts_data =
      Enum.reduce(sleep_models |> Enum.group_by(& &1.type), charts_data, fn {type, models}, acc_charts_data ->
        count = Enum.count(models)
        type = String.to_atom(type)

        update_in(acc_charts_data, [Access.key!(sleep_type_proportion_key)], fn sleep_type_proportion ->
          Map.update(sleep_type_proportion, type, count, &(&1 + count))
        end)
      end)

    update_in(
      charts_data,
      [Access.key!(heart_rate_zones_data_key)],
      &(calculate_zones(heart_rate_models) ++ &1)
    )
  end

  defp sum_fun(list, fun) do
    Enum.reduce(list, 0, &(fun.(&1) + &2))
  end
end
