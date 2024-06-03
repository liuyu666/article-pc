
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Card, Breadcrumb, Form, Button, Input, Space, message, Radio, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import './index.scss'
import 'react-quill/dist/quill.snow.css'
import http from '../../utils/http'

const Item = Form.Item

const Publish = () => {
    const navigate = useNavigate()

    // 获取表单数据
    const onFinish = async (values) => {
        // 数据的二次处理 重点是处理cover字段
        const { title, price, images } = values
        // 判断type fileList 是匹配的才能正常提交
        const params = {
            title,
            price,
            images: fileList?.map(item => {
                return item.url
            })
        }
        if (id) {
            await http.put(`/product/item/${id}?draft=false`, params)
        } else {
            await http.post('/product/item', params)
        }

        // 跳转列表 提示用户
        navigate('/layout/article')
        message.success(`${id ? '更新成功' : '发布成功'}`)
    }
    // 编辑功能 文案适配 路由参数id 判断条件
    const [params] = useSearchParams()
    const id = params.get('id')
    // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
    const [form] = Form.useForm()
    useEffect(() => {
        const loadDetail = async () => {
            const res = await http.get(`/mp/articles/${id}`)
            const data = res.data
            // 表单数据回填
            form.current.setFieldsValue({ ...data, type: data.cover.type })
            // 回填upload
            const formatImgList = data.cover.images.map(url => ({ url }))
            setFileList(formatImgList)
            // 暂存列表里也存一份
            cacheImgList.current = formatImgList
            // 图片type
            setImgCount(data.cover.type)
        }
        // 必须是编辑状态 才可以发送请求
        if (id) {
            loadDetail()
        }
    }, [id, form])


    const [imageUrl, setImageUrl] = useState(null);


    // 存放上传图片的列表
    const [fileList, setFileList] = useState([])
    // 保存的图片数量
    const [imgCount, setImgCount] = useState(1)
    // 声明图片的暂存仓库
    const cacheImgList = useRef()

    const radioChange = (e) => {
        const rawValue = e.target.value
        setImgCount(rawValue)
        console.log(cacheImgList.current);
        // 从仓库里面获取对应的图片数量 交给用来渲染图片的fileList
        if (cacheImgList.current === undefined || 0) {
            return false
        }
        if (rawValue === 1) {
            const img = cacheImgList.current ? cacheImgList.current[0] : []
            setFileList([img])
        } else if (rawValue === 3) {
            setFileList(cacheImgList.current)
        }
    }


    const onUploadChange = ({ fileList }) => {
        // 这里关键位置:需要做数据格式化
        const formatList = fileList.map(file => {
            // 上传完毕 做数据处理
            if (file.response) {
                console.log('file.response11: ', file.response);
                return {
                    url: file.response.imageUrl
                }
            }
            // 否则在上传中时，不做处理
            return file
        })
        // 存放data数据
        setFileList(formatList)
        console.log('formatListxxx: ', formatList);
        // 同时把图片列表存入仓库一份
        cacheImgList.current = formatList
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://liuyu666.cn/common/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('data7777: ', data);
            if (data.success) {
                setImageUrl(data.imageUrl);
            } else {
                console.error('Image upload failed:', data.message);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">" items={[
                        { title: <Link to="/layout/home">首页</Link> },
                        { title: `${id ? '编辑' : '发布'}商品` }
                    ]} />
                }
            >
                <Form ref={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ type: 1, content: '' }} onFinish={onFinish}>
                    <Item label="标题1" name="title" rules={[{ required: true, message: '请输入商品标题' }]}>
                        <Input placeholder="请输入商品标题" style={{ width: 400 }} />
                    </Item>
                    <Item label="价格" name="price" rules={[{ required: true, message: '请输入商品价格' }]}>
                        <Input placeholder="请输入商品价格" type="number" style={{ width: 400 }} />
                    </Item>


                    {/* <Item label="商品图片" name="images" rules={[{ required: true, message: '请输入图片链接，使用;链接' }]}>
                        <Input.TextArea placeholder="请输入商品图片链接" style={{ width: 400 }} />
                    </Item> */}


                    <Item label="商品列表">
                        <Item name="type">
                            <Radio.Group onChange={radioChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Item>
                        {imgCount > 0 && (
                            <Upload name='image' listType='picture-card' className='avatar-uploader' showUploadList
                                action="http://liuyu666.cn/common/upload" fileList={fileList} onChange={onUploadChange}
                                multiple={imgCount > 1} maxCount={imgCount} >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>)
                        }
                    </Item>

                    <Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                {id ? '更新' : '发布'}商品
                            </Button>
                        </Space>
                    </Item>
                </Form>
            </Card>


            <div>
                <input type="file" onChange={handleImageUpload} />
                {imageUrl && <img src={imageUrl} alt="Uploaded" />}
            </div>
        </div>
    )
}

export default observer(Publish)