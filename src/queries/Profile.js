import { graphql }  from 'react-relay';

export default ProfileQuery = graphql`
    query ProfileQuery {
        viewer { username }
    }
`
