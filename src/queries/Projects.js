var graphql = require('babel-plugin-relay/macro');

export default ProjectsQuery = graphql`
    query ProjectsQuery {
        models(first: 10, entityName: "jemoka") {
            edges {
                node {
                    ...ProjectFragment
                }
            }
            pageInfo {
                hasNextPage
            }
        }
    }
`
