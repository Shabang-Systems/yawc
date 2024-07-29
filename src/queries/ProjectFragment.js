var graphql = require('babel-plugin-relay/macro');

export default ProjectFragment = graphql`
    fragment ProjectFragment on Project {
        id
        name
        entityName
        createdAt
        isBenchmark
    }
`
