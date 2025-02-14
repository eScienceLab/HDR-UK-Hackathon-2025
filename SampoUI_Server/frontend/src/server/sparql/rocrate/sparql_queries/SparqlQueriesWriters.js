const perspectiveID = 'writers'

export const writerProperties = `
    {
      ?id rdfs:label ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
	{
		?id dbo:genre ?genre__id .
		?genre__id rdfs:label ?genre__prefLabel .
		FILTER(LANG(?genre__prefLabel) = 'en')
	}
	UNION
	{
		?id dbo:occupation ?occupation__id .
		?occupation__id rdfs:label ?occupation__prefLabel .
		FILTER(LANG(?occupation__prefLabel) = 'en')
	}
	UNION
	{
		?id dbo:almaMater ?almaMater__id .
		?almaMater__id rdfs:label ?almaMater__prefLabel .
		FILTER(LANG(?almaMater__prefLabel) = 'en')
	}
`

export const knowledgeGraphMetadataQuery = `
  SELECT * 
  WHERE {
    ?id a sd:Dataset ;
        dct:title ?title ;
        dct:publisher ?publisher ;
        dct:rightsHolder ?rightsHolder ;
        dct:modified ?modified ;
        dct:source ?databaseDump__id .
    ?databaseDump__id skos:prefLabel ?databaseDump__prefLabel ;
                      mmm-schema:data_provider_url ?databaseDump__dataProviderUrl ;
                      dct:modified ?databaseDump__modified .
  }
`
export const writersByOccupationQuery = `
	SELECT ?category ?prefLabel (COUNT(DISTINCT ?writer) as ?instanceCount)
	WHERE {
		<FILTER>
		{
			?writer a dbo:Writer ;
				dbo:occupation ?category .
			?category rdfs:label ?prefLabel .
			FILTER(LANG(?prefLabel) = 'en')
		}
		UNION
		{
			?writer a dbo:Writer .
			FILTER NOT EXISTS {
				?writer dbo:occupation [] .
			}
			BIND("Unknown" as ?category)
			BIND("Unknown" as ?prefLabel)
		}
	}
	GROUP BY ?category ?prefLabel
	ORDER BY DESC(?instanceCount)
`