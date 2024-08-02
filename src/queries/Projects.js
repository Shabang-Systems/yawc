import { graphql }  from 'react-relay';

const ProjectsQueryFragment = graphql`
    fragment ProjectsQueryFragment on Query
        @refetchable(queryName: "ProjectsQueryPaginationQuery")
        @argumentDefinitions(
            entity: { type: "String" }
            cursor: { type: "String" }
            count: { type: "Int", defaultValue: 20 }
        ) {
            models(entityName: $entity, after: $cursor, first: $count) 
                @connection(key: "ProjectsQueryFragment_models")
        {
                edges {
                    node {
                        id
                        name
                        public
                        updatedAt
                        runCount
                        runActiveCount
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
`

// yes this is empty b/c we got no filters
const ProjectsQuery = graphql`
    query ProjectsQuery($entity: String) { ...ProjectsQueryFragment @arguments(entity: $entity) } 
`

export { ProjectsQuery, ProjectsQueryFragment };
