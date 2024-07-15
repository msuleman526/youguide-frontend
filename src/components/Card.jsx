import React from 'react';
import { Card } from 'antd';
import { useRecoilState } from 'recoil';
import { themeState } from '../atom';

const CustomCard = ({ title, extra, children, ...props }) => {
  const theme = useRecoilState(themeState)
  return (
    <Card title={title} extra={extra} {...props} className={
      theme === 'light' || (theme.length > 0 && theme[0] == "light") ? 'theme-light-card' : 'theme-dark-card'
    }>
      {children}
    </Card>
  );
};

export default CustomCard;