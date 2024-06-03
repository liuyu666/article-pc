import { Link } from 'react-router-dom'
import { HomeOutlined,DiffOutlined,EditOutlined } from '@ant-design/icons';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
    getItem(<Link to='/layout/home'>数据概览</Link>, '/layout/home', <HomeOutlined />),
    getItem(
        '商品管理',
        '/layout/product',
        null,
        [
            getItem(<Link to='/layout/article'>商品列表</Link>, '/layout/article', <DiffOutlined />),
            // getItem(<Link to='/layout/product'>上传商品</Link>, '/layout/product', <DiffOutlined />)
        ],
        'group'),
    getItem(<Link to='/layout/publish'>发布商品</Link>, '/layout/publish', <EditOutlined />),
];

export default items