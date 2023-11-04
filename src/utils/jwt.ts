import { APP_CONSTANT } from '~/types/constant'

export const getJwtToken = () => sessionStorage.getItem(APP_CONSTANT.JWT)

export const setJwtToken = (token: string) => sessionStorage.setItem(APP_CONSTANT.JWT, token)
