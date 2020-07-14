import os
import json
import requests
from elasticsearch import Elasticsearch, RequestsHttpConnection, helpers, exceptions

HOST = os.environ.get('ES_ENDPOINT')
INDEX = os.environ.get('ES_INDEX')
QUOTES_DUMP = os.environ.get('QUOTES_DUMP')

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
        with open(QUOTES_DUMP) as file:
            quotes = json.load(file)
        print(f"Ingesting {len(quotes)} quotes into {INDEX} index.")
        for quote in quotes:
            response = es.index(index=INDEX,
                                doc_type='_doc',
                                id=quote['id'],
                                body=quote,
                                request_timeout=60)
            print("ElasticSearchService: Index creation response: ", response)
    except Exception as exception:
        # print some context about this error
        print(exception)
        raise exception


if __name__ == "__main__":
    main()
