defmodule OuraDashboard.OuraDataStore do
  defstruct daily_sleep_data_zin: [],
            daily_sleep_data_balen: [],
            sleep_data_zin: [],
            sleep_data_balen: [],
            daily_activity_data_zin: [],
            daily_activity_data_balen: [],
            heartrate_data_zin: [],
            heartrate_data_balen: [],
            daily_readiness_data_zin: [],
            daily_readiness_data_balen: []

  defp client_zin,
    do:
      Tesla.client([
        {Tesla.Middleware.BaseUrl, "https://api.ouraring.com"},
        {Tesla.Middleware.Headers, [{"Authorization", "Bearer #{Application.get_env(:oura_dashboard, :zin_personal_token)}"}]}
      ])

  defp client_balen,
    do:
      Tesla.client([
        {Tesla.Middleware.BaseUrl, "https://api.ouraring.com"},
        {Tesla.Middleware.Headers, [{"Authorization", "Bearer #{Application.get_env(:oura_dashboard, :balen_personal_token)}"}]}
      ])

  def fetch_data(start_date, end_date) do
    {:ok, %{data: daily_sleep_data_zin}} = OuraApi.Api.DailySleepRoutes.multiple_daily_sleep_documents_v2_usercollection_daily_sleep_get(client_zin(), start_date: start_date, end_date: end_date)
    {:ok, %{data: daily_sleep_data_balen}} = OuraApi.Api.DailySleepRoutes.multiple_daily_sleep_documents_v2_usercollection_daily_sleep_get(client_balen(), start_date: start_date, end_date: end_date)

    {:ok, %{data: sleep_data_zin}} = OuraApi.Api.SleepRoutes.multiple_sleep_documents_v2_usercollection_sleep_get(client_zin(), start_date: start_date, end_date: end_date)
    {:ok, %{data: sleep_data_balen}} = OuraApi.Api.SleepRoutes.multiple_sleep_documents_v2_usercollection_sleep_get(client_balen(), start_date: start_date, end_date: end_date)

    {:ok, %{data: daily_activity_data_zin}} = OuraApi.Api.DailyActivityRoutes.multiple_daily_activity_documents_v2_usercollection_daily_activity_get(client_zin(), start_date: start_date, end_date: end_date)
    {:ok, %{data: daily_activity_data_balen}} = OuraApi.Api.DailyActivityRoutes.multiple_daily_activity_documents_v2_usercollection_daily_activity_get(client_balen(), start_date: start_date, end_date: end_date)

    {:ok, %{data: heartrate_data_zin}} = OuraApi.Api.HeartRateRoutes.multiple_heart_rate_documents_v2_usercollection_heartrate_get(client_zin(), start_datetime: start_date, end_datetime: end_date)
    {:ok, %{data: heartrate_data_balen}} = OuraApi.Api.HeartRateRoutes.multiple_heart_rate_documents_v2_usercollection_heartrate_get(client_balen(), start_datetime: start_date, end_datetime: end_date)

    {:ok, %{data: daily_readiness_data_zin}} = OuraApi.Api.DailyReadinessRoutes.multiple_daily_readiness_documents_v2_usercollection_daily_readiness_get(client_zin(), start_date: start_date, end_date: end_date)
    {:ok, %{data: daily_readiness_data_balen}} = OuraApi.Api.DailyReadinessRoutes.multiple_daily_readiness_documents_v2_usercollection_daily_readiness_get(client_balen(), start_date: start_date, end_date: end_date)

    %OuraDashboard.OuraDataStore{
      daily_sleep_data_zin: daily_sleep_data_zin,
      daily_sleep_data_balen: daily_sleep_data_balen,
      sleep_data_zin: sleep_data_zin,
      sleep_data_balen: sleep_data_balen,
      daily_activity_data_zin: daily_activity_data_zin,
      daily_activity_data_balen: daily_activity_data_balen,
      heartrate_data_zin: heartrate_data_zin,
      heartrate_data_balen: heartrate_data_balen,
      daily_readiness_data_zin: daily_readiness_data_zin,
      daily_readiness_data_balen: daily_readiness_data_balen
    }
  end
end
