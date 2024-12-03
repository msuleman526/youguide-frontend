import { atom } from 'recoil'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  return savedTheme ? JSON.parse(savedTheme) : 'light'
}

export const themeState = atom({
  key: 'themeState',
  default: getInitialTheme(),
})
