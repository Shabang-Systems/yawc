var graphql = require('babel-plugin-relay/macro');

export default ProfileQuery = graphql`
    query ProfileQuery {
        viewer { username }
    }
`
