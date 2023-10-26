import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to='.'>Home</Link>
      <Link to='register'>Register</Link>
      <Link to='login'>Login</Link>
    </div>
  )
}

export default Home
