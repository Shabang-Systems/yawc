import { graphql }  from 'react-relay';

const HistoryQuery = graphql`
    query HistoryQuery($entity: String, $project: String, $run: String!, $specs: [JSONString!]!) {
        project(name: $project, entityName: $entity) {
            run(name: $run) {
                sampledHistory(specs: $specs) 
            }
        } 
    } 
`

export { HistoryQuery };
