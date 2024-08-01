import { graphql }  from 'react-relay';

export default ProjectsQueryFragment = graphql`
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
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
`
