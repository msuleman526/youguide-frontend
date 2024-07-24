import React from 'react';
import { Input } from 'antd';
import { useRecoilState } from 'recoil';
import { themeState } from '../atom';

const CustomInput = ({...props}) => {
  const theme = useRecoilState(themeState)
  return (
    <Input
        className={
            theme === 'light' || (theme.length > 0 && theme[0] == "light")
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