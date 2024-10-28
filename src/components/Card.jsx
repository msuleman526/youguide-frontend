import React from 'react';
import { Card } from 'antd';
import { useRecoilState } from 'recoil';
import { themeState } from '../atom';

const CustomCard = ({ title, extra, children, height, ...props}) => {
  const theme = useRecoilState(themeState)
  return (
    <Card title={title} extra={extra} {...props} style={{height: (height) ? height : 'auto', boxShadow: theme === 'dark' || (theme.length > 0 && theme[0] == "dark")  && '0px 1px 6px 1px #31608A4D' }} className={
      theme === 'light' || (theme.length > 0 && theme[0] == "light") ? 'theme-light-card' : 'theme-dark-card'
    }>
      {children}
    </Card>
  );
};

export default CustomCard;