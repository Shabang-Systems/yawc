import { graphql }  from 'react-relay';

// yes this is empty b/c we got no filters
export default ProjectsQuery = graphql`
    query ProjectsQuery($entity: String) { ...ProjectsQueryFragment @arguments(entity: $entity) } 
`
