import json
import requests
import sys
from datetime import datetime

TODAY = datetime.now()

METRICS_SONAR = [
    'files',
    'functions',
    'complexity',
    'comment_lines_density',
    'duplicated_lines_density',
    'coverage',
    'ncloc',
    'tests',
    'test_errors',
    'test_failures',
    'test_execution_time',
    'security_rating',
    'test_success_density',
    'reliability_rating',
]

BASE_URL = 'https://sonarcloud.io/api/measures/component_tree'

if __name__ == '__main__':
    # Get the repository and release version from the command-line arguments
    REPO = sys.argv[1]
    RELEASE_VERSION = sys.argv[2]

    # Make the API request and parse the JSON data
    try:
        response = requests.get(f'{BASE_URL}?component=fga-eps-mds_{REPO}&metricKeys={",".join(METRICS_SONAR)}&ps=500')
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error making API request: {e}')
        sys.exit(1)

    # Create a file with the JSON data
    file_path = f'./analytics-raw-data/fga-eps-mds-{REPO}-{TODAY:%m-%d-%Y-%H-%M-%S}-{RELEASE_VERSION}.json'
    with open(file_path, 'w') as fp:
        json.dump(data, fp)

    print(f'JSON data saved to {file_path}')
