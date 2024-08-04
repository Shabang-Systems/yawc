import { graphql }  from 'react-relay';

const RunsQueryFragment = graphql`
    fragment RunsQueryFragment on Query
        @refetchable(queryName: "RunsQueryPaginationQuery")
        @argumentDefinitions(
            cursor: { type: "String" }
            entity: { type: "String" }
            name: { type: "String" }
            count: { type: "Int", defaultValue: 20 }
        ) {
            project(name: $name, entityName: $entity) {
                runs(after: $cursor, first: $count) 
                    @connection(key: "RunQueryFragment__runs")
                {
                    edges {
                        node {
                            id
                            name
                            displayName
                            heartbeatAt
                            historyKeys
                            state
                        }
                    }
                    pageInfo {
                        hasNextPage
                    }
                }
            }
        }
`


// yes this is empty b/c we got no filters
const RunsQuery = graphql`
    query RunsQuery($entity: String, $name: String) {
        ...RunsQueryFragment @arguments (entity: $entity, name: $name)
    } 
`

export { RunsQuery, RunsQueryFragment };
