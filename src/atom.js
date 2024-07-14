import { atom } from 'recoil'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  return savedTheme ? JSON.parse(savedTheme) : 'dark'
}

export const themeState = atom({
  key: 'themeState',
  default: getInitialTheme(),
})
