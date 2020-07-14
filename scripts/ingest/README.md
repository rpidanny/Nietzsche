# ingest

Ingest quotes dump from DynamoDB into ElasticSearch.

## Usage

- Install dependencies with `pip install -r requirements.txt`.
- Export these environment variable:
  - `ES_ENDPOINT`: ElasticSearch endpoint (including https://).
  - `ES_INDEX`: ElasticSearch Index Name.
  - `QUOTES_DUMP`: Path to the Quotes Dump JSON File.
- Create index using `python index.py`.
- Ingest quotes into ES using `python main.py`
