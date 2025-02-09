# HDR-UK-Hackathon-2025

This repository contains RO-Crate examples and tooling for the HDR-UK Hackathon 2025.

## RO-Crates

Example RO-Crates are provided, in the `bin` directory:
- **ro-crates**: example RO-Crates, for different standards
- **ttl**: turtle file containing a collection of RO-Crates from WorkflowHub 


## Jena-Fuseki & Sampo-UI Server

Two services are provided:
- Jena-Fuseki graph database server
- Sampo-UI front end webserver


### Setting Up Server

#### Requirements

- [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Docker](https://www.docker.com/)

Git submodules are used to provide the Sampo-UI code, after cloning this repository you can download this code using:
- `git submodule init`
- `git submodule update`

#### Starting Server

Within the `SampoUI_Server` directory use the docker compose file to start the server:
```
docker compose -f docker-compose.dev.yml up -d --build
```

#### Building RO-Crate graph database

Access the Jena-Fuseki server at `https://localhost:3030` from your web browser.

The username and password for the server is `admin`.

To add a new dataset:
- Select the **manage** tab from the top bar
- Select the **new dataset** tab
 - Name dataset: `WFH`
 - Select `Persistent` dataset option
 - Click **create dataset** button
- Select the **existing datasets** tab and, for the `WFH` database:
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

#### Stopping Server

To stop the server you can use:
```
docker compose -f docker-compose.dev.yml down
```

### Working with Sampo-UI web frontend.