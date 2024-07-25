import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';
import { toast } from "sonner";

export default function LoginPage() {
  const [form] = Form.useForm();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(login(values)).then(({payload}) => {
      if(payload?.error){
        toast.error(payload.error);
      }
    });
    form.resetFields();
  };
  return (
    <div>
      {
        isAuthenticated 
        ? <Navigate to="/" />
        : (
          <>
            <h1 className='text-center mb-5 font-bold'>Connexion</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Ce champs est obligatoire!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" className='w-80' />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Ce champs est obligatoire!',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="mot de passe"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className='w-80' />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="w-full">
                    Se connecter
                  </Button>
                </Form.Item>
            </Form>
          </>
        )
      }
      
    </div>
  );
}
