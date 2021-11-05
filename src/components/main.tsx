/* eslint-disable no-template-curly-in-string */
import { useCallback, useEffect, useState } from "react";
import {
    useAppSelector,
    useAppDispatch
} from '../app/hooks';

import {
    addData, addUserData, dislikeUser,
    likeUser, removeUser, updateUser
} from './reducers/dataReducer';

import {
    Card, Row,
    Col, Modal,
    Form, Input
} from 'antd';

import {
    EditOutlined, DeleteFilled,
    HeartOutlined, HeartFilled,
    MailOutlined, PhoneOutlined,
    GlobalOutlined
} from '@ant-design/icons';

import Loading from "./loading";
import { MapProps } from "./types/userProps";


const Main = () => {
    const { users, userData } = useAppSelector((state: any) => state);
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();

    const getUser = (id: number) => {
        const user: MapProps = users.filter((val: MapProps) => val.id === id)[0];
        return user;
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const showForm = (id: number) => {
        setIsOpen(true);
        dispatch(addUserData(getUser(id)))
        setFormData();
    };

    const closeForm = useCallback(() => {
        form.resetFields();
        setIsOpen(false);
    }, [form]);

    useEffect(() => {
        if (users.length === 0) {
            const fetchRes = async () => {
                const userBuffer = await fetch('https://jsonplaceholder.typicode.com/users');
                const usersData = await userBuffer.json();
                return usersData;
            }
            fetchRes().then((data) => {
                const fData = data.map(({ id, name, email, website, phone }: MapProps) => {
                    const val = {
                        id, name, email, website, phone, isLiked: false
                    }
                    return val;
                });
                dispatch(addData(fData));
            });
        }
    }, [dispatch, users.length]);

    const setFormData = useCallback(() => {
        console.log(userData)
    }, [userData]);

    const onSubmit = useCallback((value: any) => {
        const userDataF: MapProps = {
            id: userData?.id, ...value
        }
        dispatch(updateUser(userDataF));
        closeForm();
    }, [closeForm, dispatch, userData?.id]);

    return (
        <main>
            <Row>
                {users.length !== 0 ? users?.map(({ id, name, email,
                    phone, website, isLiked }: MapProps,
                    indx: number) => {
                    return <Col
                        xs={24} sm={24} md={8} lg={8} xl={6}
                        key={indx}>
                        <Card
                            className='userCard'
                            cover={
                                <div className="coverImage">
                                    <img className='userImage'
                                        alt="userimage"
                                        src={`https://avatars.dicebear.com/v2/avataaars/${name.split(' ')[0]}.svg?options[mood][]=happy`}
                                    />
                                </div>
                            }
                            actions={[
                                !isLiked ? <HeartOutlined className='action'
                                    onClick={() => dispatch(likeUser(id))}
                                /> : <HeartFilled className='action'
                                    onClick={() => dispatch(dislikeUser(id))}
                                />,
                                <EditOutlined onClick={() => showForm(id)} />,
                                <DeleteFilled onClick={() => dispatch(removeUser(id))} />,
                            ]}
                        >
                            <div className='userOptions'>
                                <h3>{name}</h3>
                                <div className='userText'>
                                    <MailOutlined className='userOption' />
                                    <p className='optionText'>{email}</p>
                                </div>
                                <div className='userText'>
                                    <PhoneOutlined className='userOption' />
                                    <p className='optionText'>{phone}</p>
                                </div>
                                <div className='userText'>
                                    <GlobalOutlined className='userOption' />
                                    <a className='optionText' href={website}>{website}</a>
                                </div>
                            </div>
                        </Card>
                    </Col>

                }) : <Loading />}
            </Row>
            <Modal title="Basic Modal" visible={isOpen} onOk={form.submit} onCancel={closeForm}>
                <Form form={form} {...layout} name="nest-messages"

                    onFinish={onSubmit} validateMessages={validateMessages}>
                    <Form.Item name={'name'} label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={'email'} label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={'phone'} label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={'website'} label="Website" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    )
}

export default Main
