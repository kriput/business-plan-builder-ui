import { Button, Result } from 'antd';
import React from 'react';

interface IProps {
  errorMessage: string;
  buttonMessage: string;
  onClick: () => void;
}

const ErrorResult = (props: IProps) => {
  return (
      <div>
        <Result
            status="error"
            title="Viga päringu tegemisel"
            subTitle={props.errorMessage}
            extra={[<Button onClick={props.onClick}>{props.buttonMessage}</Button>]}
        />
      </div>
  );
};

export default ErrorResult;