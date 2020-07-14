import os
import json
import requests
from elasticsearch import Elasticsearch, RequestsHttpConnection, helpers, exceptions


HOST = os.environ.get('ES_ENDPOINT')
INDEX = os.environ.get('ES_INDEX')

mapping_file = './mappings.json'

headers = {"Content-Type": "application/json"}


def main():
    try:
        es = Elasticsearch(
            hosts=[{
                "host": HOST.split('//')[1],
                "port": 443
            }],
            use_ssl=True,
            verify_certs=True,
            connection_class=RequestsHttpConnection,
        )
        with open(mapping_file) as file:
            index_mapping = json.load(file)

        print(f"Creating index {INDEX} with mapping {index_mapping}")
        response = es.indices.create(index=INDEX, body=index_mapping)
        print("ElasticSearchService: Index creation response: ", response)
    except Exception as exception:
        # print some context about this error
        print(exception)
        raise exception

if __name__ == "__main__":
    main()
