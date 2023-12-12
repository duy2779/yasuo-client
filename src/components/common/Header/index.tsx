import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import logo from '~/assets/tornado.svg'
import { useAuthContext } from '~/context/AuthContext'
import { graphql } from '~/gql'

type Props = {}

export default function Header({}: Props) {
  const LOG_OUT = graphql(/* GraphQL */
  `
    mutation logout {
      logout {
        code
        success
        message
      }
    }
  `)

  const [logout, _] = useMutation(LOG_OUT)

  const { logoutClient } = useAuthContext()
  const navigate = useNavigate()

  const onLogout = async () => {
    const response = await logout()
    if (response.data?.logout?.success) {
      logoutClient()
    }
  }

  const onClickLogo = () => {
    navigate('/')
  }

  return (
    <div className='header'>
      <div className='container'>
        <div className='header__container'>
          <div className='header__left'>
            <div className='header__logo'>
              <img onClick={onClickLogo} onKeyDown={onClickLogo} src={logo} alt='logo' className='header__logo-img' />
            </div>
            <div onClick={onClickLogo} onKeyDown={onClickLogo} className='header__title'>
              Yasuo
            </div>
          </div>
          <div className='header__right'>
            <Link to='register'>Register</Link>
            <Link to='login'>Login</Link>
            <Link to='profile'>Profile</Link>
            <button onClick={onLogout} className='btn btn--red'>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
