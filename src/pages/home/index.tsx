import { useQuery } from '@apollo/client'
import { graphql } from '~/gql'

const Home = () => {
  const GET_ALL_EVENT = graphql(/* GraphQL */
  `
    query eventDetails {
      findAll {
        id
        name
        content
        createdDate
      }
    }
  `)

  const { data, loading, error } = useQuery(GET_ALL_EVENT)

  return (
    <div className='page-content'>
      {loading && <p>Loading...</p>}
      {data?.findAll?.length && (
        <ul>
          {error && <p>{error.message}</p>}
          {data?.findAll?.map((event) => <li key={event?.id}>{event?.name}</li>)}
        </ul>
      )}
    </div>
  )
}

export default Home
