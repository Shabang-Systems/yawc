import { graphql }  from 'react-relay';

export default EntitiesQuery = graphql`
    query EntitiesQuery {
        viewer {
            teams {
                edges {
                    node { name }
                }
            }
        }
    }
`
