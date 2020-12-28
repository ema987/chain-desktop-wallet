import React from 'react';
import { Form, Input } from 'antd';
import './PasswordForm.less';

interface PasswordFormProps {
  className?: string;
  children?: React.ReactNode;

  // Control form visibility
  visible: boolean;

  // Display extra input field to confirm password
  confirmPassword?: boolean;

  // TODO: use secure-string
  onOk: (password: string) => void;
  onErr: (errMsg: string) => void;
  onChange: () => void;

  shouldValidate?: boolean;
}

const PasswordForm: React.FC<PasswordFormProps> = props => {
  const [form] = Form.useForm();
  const onFormFinish = ({ password, passwordConfirm }) => {
    if (props.confirmPassword && password !== passwordConfirm) {
      props.onErr('Password Mismatch');
      return;
    }
    props.onOk(password);
  };

  if (!props.visible) {
    return <div />;
  }
  return (
    <div className={`password-form${props.className ? props.className : ''}`}>
      <Form
        layout="vertical"
        form={form}
        name="control-ref"
        onChange={props.onChange}
        onFinish={onFormFinish}
      >
        <Form.Item
          name="password"
          label="App Password"
          rules={[
            { required: true, message: 'Password is required' },
            props.shouldValidate
              ? {
                  pattern: /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                  message:
                    'The password should be at least 8 character containing a letter, a number and a special character',
                }
              : {},
          ]}
        >
          <Input.Password placeholder="Enter your app password" />
        </Form.Item>
        {props.confirmPassword && (
          <Form.Item
            name="passwordConfirm"
            label="Confirm App Password"
            rules={[
              { required: true, message: 'Password confirmation is required' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('The password confirmation should match');
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm app password" />
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>{props.children}</Form.Item>
      </Form>
    </div>
  );
};

export default PasswordForm;