import { useMutation } from '@apollo/client'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bg from '~/assets/auth_bg.jpg'
import { graphql } from '~/gql/gql'
import { setJwtToken } from '~/utils/jwt'
import './styles.scss'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const LOGIN = graphql(/* GraphQL */
  `
    mutation login($loginRequest: LoginRequest!) {
      login(loginRequest: $loginRequest) {
        accessToken
        refreshToken
      }
    }
  `)

  const [login] = useMutation(LOGIN)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await login({ variables: { loginRequest: { username, password } } })
      const token = response.data?.login?.accessToken
      if (token) {
        setJwtToken(token)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Some Error')
    }
  }

  return (
    <div className='login__container'>
      <div className='login__left'>
        <div className='login__section'>
          <h2 className='login__title'>Welcome Back</h2>
          <h4 className='login__desc'>Enter your credentials to access your account</h4>
          <form action='' className='login__form' onSubmit={onSubmit}>
            <div className='login__form-field'>
              <label htmlFor='email'>Email</label>
              <input
                name='email'
                type='text'
                placeholder='email@gmail.com'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='login__form-field'>
              <label htmlFor='password'>Password</label>
              <input
                name='password'
                type='password'
                placeholder='min 8 chars'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='login__form-action'>
              <button type='submit' className='login__form-submit-btn btn btn--blue'>
                Login
              </button>
            </div>
            <div className='login__form-more-action'>
              <span>
                Don't have an account? <a>Create an account</a>
              </span>
            </div>
          </form>
          {errorMessage && (
            <div className='login__errors'>
              <p className='login__error'>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
      <div className='login__right'>
        <img className='login__bg' src={bg} alt='' />
      </div>
    </div>
  )
}

export default Login
