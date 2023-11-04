import { useMutation } from '@apollo/client'
import { FormEvent, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import bg from '~/assets/auth_bg.png'
import { useAuthContext } from '~/context/AuthContext'
import { graphql } from '~/gql/gql'
import { setJwtToken } from '~/utils/jwt'
import './styles.scss'
import spinner from '~/assets/spinner.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const Login = () => {
  const [passwordType, setPasswordType] = useState('password')

  const navigate = useNavigate()
  const { setIsAuthenticated, isAuthenticated } = useAuthContext()

  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(8).max(32).required()
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const watchPassword = watch('password')
  const watchUsername = watch('username')

  useEffect(() => {
    reset()
  }, [watchUsername, watchPassword])

  const LOGIN = graphql(/* GraphQL */
  `
    mutation login($loginRequest: LoginRequest!) {
      login(loginRequest: $loginRequest) {
        accessToken
      }
    }
  `)

  const [login, { error, loading, reset }] = useMutation(LOGIN)

  const onSubmitHandler = async (data: any) => {
    const response = await login({ variables: { loginRequest: { username: data.username, password: data.password } } })
    const token = response.data?.login?.accessToken
    if (token) {
      setJwtToken(token)
      setIsAuthenticated(true)
      navigate('/')
    }
  }

  if (isAuthenticated) {
    return <Navigate to='..' />
  }

  return (
    <div className='login__container'>
      <div className='login__left'>
        <div className='login__section'>
          <h2 className='login__title'>Welcome Back 👋</h2>
          <h4 className='login__desc'>Enter your credentials to access your account</h4>
          <form action='' className='login__form' onSubmit={handleSubmit(onSubmitHandler)}>
            <div className='login__form-field'>
              <label htmlFor='username'>Username</label>
              <div className='input__container input__container--xl'>
                <input type='text' placeholder='Enter your username' {...register('username')} required />
              </div>
              <p className='login__input-message'>{errors.username?.message}</p>
            </div>
            <div className='login__form-field'>
              <label htmlFor='password'>Password</label>
              <div className='input__container input__container--xl'>
                <input type={passwordType} placeholder='min 8 chars' {...register('password')} required />
                {watchPassword && (
                  <>
                    {passwordType === 'password' ? (
                      <FontAwesomeIcon
                        onClick={() => setPasswordType('text')}
                        icon={faEyeSlash}
                        className='icon icon--action'
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => setPasswordType('password')}
                        icon={faEye}
                        className='icon icon--action'
                      />
                    )}
                  </>
                )}
              </div>
              <p className='login__input-message'>{errors.password?.message}</p>
            </div>
            <div className='login__form-action'>
              <button type='submit' className='login__form-submit-btn btn btn--blue btn--xl'>
                {loading ? <img src={spinner} alt='' /> : 'Login'}
              </button>
            </div>
            {error && (
              <div className='login__errors'>
                <p className='login__error'>{error.message}</p>
              </div>
            )}
            <div className='login__form-more-action'>
              <span>
                Don't have an account? <a>Create an account</a>
              </span>
            </div>
          </form>
        </div>
      </div>
      <div className='login__right'>
        <img className='login__bg' src={bg} alt='' />
      </div>
    </div>
  )
}

export default Login
