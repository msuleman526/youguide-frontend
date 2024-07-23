import React from 'react';
import { Input } from 'antd';
import { useRecoilState } from 'recoil';
import { themeState } from '../atom';

const CustomInput = ({...props}) => {
  const theme = useRecoilState(themeState)
  return (
    <Input
        className={
            theme === 'light'
                ? 'header-search-input-light'
                : 'header-search-input-dark'
        }
        style={{width: '100%'}}
        size="large"
        placeholder="Bank Name"
        {...props}
    />
  );
};

export default CustomInput;