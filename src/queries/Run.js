import { graphql }  from 'react-relay';

const RunQuery = graphql`
    query RunQuery($entity: String, $project: String, $run: String!) {
        project(name: $project, entityName: $entity) {
            run(name: $run) {
                id
                tags
                displayName
                createdAt
                state
                heartbeatAt
                description
                host
                computeSeconds
                config
            }
        } 
    } 
`

export { RunQuery };
