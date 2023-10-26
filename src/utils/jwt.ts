import { APP_CONSTANT } from '~/types/constant'

export const getJwtToken = () => sessionStorage.getItem(APP_CONSTANT.JWT)

export const setJwtToken = (token: string) => sessionStorage.setItem(APP_CONSTANT.JWT, token)

export const getRefreshToken = () => sessionStorage.getItem(APP_CONSTANT.REFRESH_TOKEN)

export const setRefreshToken = (token: string) => sessionStorage.setItem(APP_CONSTANT.REFRESH_TOKEN, token)
