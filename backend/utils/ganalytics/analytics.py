"""Hello Analytics Reporting API V4."""

from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
import os


SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
KEY_FILE_LOCATION = os.path.join(os.path.dirname(__file__),'./mirvarim-ga.json')
VIEW_ID = '229225926'


def initialize_analyticsreporting():
  """Initializes an Analytics Reporting API V4 service object.

  Returns:
    An authorized Analytics Reporting API V4 service object.
  """
  credentials = ServiceAccountCredentials.from_json_keyfile_name(
      KEY_FILE_LOCATION, SCOPES)

  # Build the service object.
  analytics = build('analyticsreporting', 'v4', credentials=credentials)

  return analytics


def get_report(analytics, PAGE_FILTER):
  """Queries the Analytics Reporting API V4.

  Args:
    analytics: An authorized Analytics Reporting API V4 service object.
  Returns:
    The Analytics Reporting API V4 response.
  """
  return analytics.reports().batchGet(
      body={
        'reportRequests': [
        {
          'viewId': VIEW_ID,
          'dateRanges': [{'startDate': '7daysAgo', 'endDate': 'today'}],
          # 'metrics': [{'expression': 'ga:sessions'}],
          'metrics': [{'expression': 'ga:pageviews'}],
          'dimensions': [{'name': 'ga:pagePath'}],
          'dimensionFilterClauses': [{
              'filters': [{
                'dimensionName':'ga:pagePath',
                'expressions': PAGE_FILTER,
                'operator': 'EXACT'
              }]
          }]
        }]
      }
  ).execute()

def page_view_count(id):
  PAGE_FILTER = '/salon/'+str(id)
  analytics = initialize_analyticsreporting()
  response = get_report(analytics, PAGE_FILTER)
  
  for report in response.get('reports', []):
    for row in report.get('data', {}).get('rows', []):
      values = row.get('metrics', [])[0]
      return values.get('values')[0]


# def print_response(response):
#   """Parses and prints the Analytics Reporting API V4 response.

#   Args:
#     response: An Analytics Reporting API V4 response.
#   """
#   for report in response.get('reports', []):
#     columnHeader = report.get('columnHeader', {})
#     dimensionHeaders = columnHeader.get('dimensions', [])
#     metricHeaders = columnHeader.get('metricHeader', {}).get('metricHeaderEntries', [])

#     for row in report.get('data', {}).get('rows', []):
#       dimensions = row.get('dimensions', [])
#       dateRangeValues = row.get('metrics', [])

#       for header, dimension in zip(dimensionHeaders, dimensions):
#         print(header + ': ', dimension)

#       for i, values in enumerate(dateRangeValues):
#         # print('Date range:', str(i))
#         for metricHeader, value in zip(metricHeaders, values.get('values')):
#           print(metricHeader.get('name') + ':', value)


# def main():
#   analytics = initialize_analyticsreporting()
#   response = get_report(analytics)
#   print_response(response)
#   # print(response)

# if __name__ == '__main__':
#   main()