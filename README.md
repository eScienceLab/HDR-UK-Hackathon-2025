# HDR-UK-Hackathon-2025

Welcome to our HDR-UK Hackathon 2025 repository! This project focuses on building Knowledge Graphs (KGs) (or other data representations!) from Research Object (RO) Crates and visualising potential insights. This could be with Sampo UI, Streamlit, or something else. The goal is to produce meaningful visualisations and enhance data interoperability and reusability in health data research.

## 📌 Getting Started

This README provides guidance on:

- Understanding RO-Crates and their role in research data management.
- Transforming RO-Crates into Knowledge Graphs (KGs) with TTL files.
- Visualising the KG data using Sampo UI and Streamlit Dashboards.

### 🖥️ What are TREs? 

[Trusted Research Environments (TREs)](https://satre-specification.readthedocs.io/en/stable/faqs.html#what-tre) are secure environments designed to provide researchers with controlled access to sensitive data, whilst maintaining privacy and security measures.

### 🗂 What are RO-Crates? 

[RO-Crates](https://www.researchobject.org/ro-crate/about_ro_crate) are a community-driven format for packaging research data with machine-readable metadata to enhance Findability, Accessibility, Interoperability, and Reusability (FAIR principles) of research outputs. 

RO-Crates are: 
- Self-contained: bundling datasets, metadata, and provenance in a structured format.
- Based on JSON-LD based metadata.
- Portable and interoperable: they work across different systems with a growing ecosystem of tooling. 

Example RO-Crate structure:
```
📦 ro-crate.zip
 ├── 📜 ro-crate-metadata.json  # Machine-readable metadata
 ├── 📜 ro-crate-preview.html   # Human-readable summary
 ├── 📂 data/                   # Containing research datasets
 ├── 📂 workflows/              # Associated workflows (e.g., scripts)
 └── 📂 metadata/               # Additional structured metadata
```

Example RO-Crates are provided in the `bin` directory:
- `ro-crates` contains example RO-Crates for different profiles. 

### 📝 What are TTL (Turtle) Files?

[TTL (Terse RDF Triple Language)](https://www.w3.org/TR/turtle/) is a serialisation format for RDF (Resource Description Framework), used to express structured data in a machine-readable way. 

TTL represents triples in the form of:
```
<subject> <predicate> <object> .
```

Example TTL representation:
```
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<http://example.org/ro-crate#dataset1>
    a dcterms:Dataset ;
    dcterms:title "Genomic Data Study 2025" ;
    dcterms:creator [
        foaf:name "Dr. Jane Doe" ;
        foaf:mbox <mailto:jane.doe@example.org>
    ] .
```
We can use TTL to convert RO-Crate metadata into structured RDF for Knowledge Graphs to enables semantic search, interoperability, and linked data integration.

An example TTL file is provided in the `bin` directory:
- `ttl` contains a collection of RO-Crates from WorkflowHub.


### 🌐 Knowledge Graphs

A [Knowledge Graph (KG)](https://www.turing.ac.uk/research/interest-groups/knowledge-graphs) is a structured representation of entities, relationships, and metadata in a way that enables semantic reasoning and linked data integration.

KGs can:
- Enhance data interoperability across different systems.
- Improve data discoverability through semantic search.
- Enables complex queries using SPARQL, Gremlin, GraphQL.
- Links research outputs for better context and reuse.
- Support Machine Learning approaches, e.g.,
    - Graph Representation Learning
    - Graph Neural Networks (GNNs):
    - KG-Augmented NLP (e.g., BERT)
    - Graph-Based Clustering (e.g., Spectral Clustering)


### 🏗️ Creating KGs from RO-Crates

The general idea is as follows:

1. Extract Metadata from RO-Crate (ro-crate-metadata.json).
2. Convert JSON-LD metadata into RDF triples using a script.
3. Store RDF triples in TTL format.
4. Load TTL files into a Triplestore (e.g., Fuseki).
5. Query and visualise the KG using SPARQL.

There are several ways to do this. In Python, we can use RDFLib:

```python
# General idea, adapted from https://github.com/workflowhub-eu/workflowhub-graph merge.py and absolutize.py

import rdflib
import json
import glob
import os
import re
import argparse

BASE_URL = "http://example.org/ro-crate/"

def make_paths_absolute(json_data, base_url, w_id, w_version):
    """Modify JSON-LD to include absolute URLs for identifiers."""
    json_data["@id"] = f"{base_url}{w_id}/v{w_version}"
    return json_data

def merge_all_files(pattern="data/*.json", base_url=BASE_URL) -> rdflib.Graph:
    """
    Merges all JSON-LD files matching a pattern into a single RDF graph.
    :param pattern: File pattern to match JSON-LD files.
    :param base_url: Base URL for identifiers.
    :return: Merged RDF graph.
    """

    graph = rdflib.Graph()
    filenames = glob.glob(pattern)

    for i, fn in enumerate(filenames):
        with open(fn, "r", encoding="utf-8") as f:

            basename = os.path.basename(fn)

            # Extract workflow ID and version from filenames
            if matched := re.match(r"([0-9]+)_ro-crate-metadata.json", basename):
                w_id, w_version = int(matched.group(1)), 1
            elif matched := re.match(r"([0-9]+)_([0-9]+)_ro-crate-metadata.json", basename):
                w_id, w_version = int(matched.group(1)), int(matched.group(2))
            else:
                raise ValueError(f"Invalid filename format: {basename}")

            # Convert JSON-LD to absolute paths
            json_data = make_paths_absolute(json.load(f), base_url, w_id, w_version)

            # Parse JSON-LD into RDF
            graph.parse(data=json_data, format="json-ld")

    print("\nMerging completed!")
    return graph

def main():
    parser = argparse.ArgumentParser(description="Merge RO-Crate JSON-LD files into RDF")
    parser.add_argument("output_filename", help="Output TTL filename", default="merged.ttl")
    parser.add_argument("-p", "--pattern", help="File pattern to match JSON files", default="data/*.json")
    args = parser.parse_args()

    graph = merge_all_files(pattern=args.pattern)
    graph.serialize(args.output_filename, format="ttl")

    print(f"\nKnowledge Graph saved as: {args.output_filename}")

if __name__ == "__main__":
    main()
```

## 📊 Dashboards & Visualisation Tools

### 🖥️ Setting up Jena-Fuseki & Sampo UI

Two services are provided:
- [Jena-Fuseki](https://jena.apache.org/documentation/fuseki2/) (SPARQL server)
- [Sampo-UI](https://github.com/SemanticComputing/sampo-ui) (front end webserver)
  - Sampo-UI is a linked data visual exploration tool for KGs. It enables:
    - Interactive data exploration.
    - SPARQL-based visualisations.

#### 📋 Requirements

- [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Docker](https://www.docker.com/)

Git submodules are used to provide the Sampo-UI code, after cloning this repository you can download this code using:
- `git submodule init`
- `git submodule update`

#### 🚀 Starting Server

Within the `SampoUI_Server` directory use the docker compose file to start the server:
```
docker compose -f docker-compose.dev.yml up -d --build
```

#### 🗂️ Building RO-Crate graph database

Access the Jena-Fuseki server at `https://localhost:3030` from your web browser.

The username and password for the server is `admin`.

To add a new dataset:
1. Select the **manage** tab from the top bar
2. Select the **new dataset** tab
   - Name dataset: `WFH`
   - Select `Persistent` dataset option
   - Click **create dataset** button
3. Select the **existing datasets** tab and, for the `WFH` database:
   - Click **add data** button
   - Leave `Dataset graph name` blank
   - Click **select files**
   - Select `bin/ttl/merged.ttl` file
   - Click **upload now** button
 
To test that your upload was successful:
- Select the **datasets** tab from the top bar
- Click **info** button for the `WFH` dataset
- Click **count triples in all graphs** button, this should give the following information:
 - `default graph`, triples = 155947

#### 🛑 Stopping Server

To stop the server you can use:
```
docker compose -f docker-compose.dev.yml down
```

### 🌐 Working with Sampo-UI web frontend.

...

### 📈 Streamlit
[Streamlit](https://streamlit.io) is a Python-based web framework for building interactive dashboards. Use it to:
- Display KG insights dynamically.
- Implement custom visualisations from SPARQL queries.
- Create user-friendly interfaces for non-technical users.
