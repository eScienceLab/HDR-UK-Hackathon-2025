const perspectiveID = 'persons'

export const personProperties = `
{
?id schema:name ?prefLabel ;
    a schema:Person .
BIND(?id as ?uri__id)
BIND(?id as ?uri__dataProviderUrl)
BIND(?id as ?uri__prefLabel)
}
`
