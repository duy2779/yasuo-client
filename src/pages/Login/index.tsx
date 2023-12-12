import { useMutation } from '@apollo/client'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import bg from '~/assets/auth_bg.png'
import spinner from '~/assets/spinner.svg'
import { useAuthContext } from '~/context/AuthContext'
import { graphql } from '~/gql/gql'
import { setJwtToken } from '~/utils/jwt'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  AppShell,
  Center
} from '@mantine/core'
import classes from './Login.module.scss'

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
    // <div className='login__container'>
    //   <div className='login__left'>
    //     <div className='login__section'>
    //       <h2 className='login__title'>Welcome Back 👋</h2>
    //       <h4 className='login__desc'>Enter your credentials to access your account</h4>
    //       <form action='' className='login__form' onSubmit={handleSubmit(onSubmitHandler)}>
    //         <div className='login__form-field'>
    //           <label htmlFor='username'>Username</label>
    //           <div className='input__container input__container--xl'>
    //             <input type='text' placeholder='Enter your username' {...register('username')} required />
    //           </div>
    //           <p className='login__input-message'>{errors.username?.message}</p>
    //         </div>
    //         <div className='login__form-field'>
    //           <label htmlFor='password'>Password</label>
    //           <div className='input__container input__container--xl'>
    //             <input type={passwordType} placeholder='min 8 chars' {...register('password')} required />
    //             {watchPassword && (
    //               <>
    //                 {passwordType === 'password' ? (
    //                   <FontAwesomeIcon
    //                     onClick={() => setPasswordType('text')}
    //                     icon={faEyeSlash}
    //                     className='icon icon--action'
    //                   />
    //                 ) : (
    //                   <FontAwesomeIcon
    //                     onClick={() => setPasswordType('password')}
    //                     icon={faEye}
    //                     className='icon icon--action'
    //                   />
    //                 )}
    //               </>
    //             )}
    //           </div>
    //           <p className='login__input-message'>{errors.password?.message}</p>
    //         </div>
    //         <div className='login__form-action'>
    //           <button type='submit' className='login__form-submit-btn btn btn--blue btn--xl'>
    //             {loading ? <img src={spinner} alt='' /> : 'Login'}
    //           </button>
    //         </div>
    //         {error && (
    //           <div className='login__errors'>
    //             <p className='login__error'>{error.message}</p>
    //           </div>
    //         )}
    //         <div className='login__form-more-action'>
    //           <span>
    //             Don't have an account? <a>Create an account</a>
    //           </span>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    //   <div className='login__right'>
    //     <img className='login__bg' src={bg} alt='' />
    //   </div>
    // </div>
    <div className={classes.wrapper}>
      <Container size={420} mt={40}>
        <Title ta='center' className={classes.title}>
          Welcome back!
        </Title>
        <Text c='dimmed' size='sm' ta='center' mt={5}>
          Do not have an account yet?{' '}
          <Anchor size='sm' component='button'>
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <TextInput label='Email' placeholder='you@mantine.dev' required />
          <PasswordInput label='Password' placeholder='Your password' required mt='md' />
          <Group justify='space-between' mt='lg'>
            <Checkbox label='Remember me' />
            <Anchor component='button' size='sm'>
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt='xl'>
            Sign in
          </Button>
        </Paper>
      </Container>
    </div>
  )
}

export default Login
