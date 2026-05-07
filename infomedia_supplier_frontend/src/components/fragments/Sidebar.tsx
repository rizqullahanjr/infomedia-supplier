import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  SolutionOutlined,
  FileSearchOutlined,
  SettingOutlined,
  NodeIndexOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <DashboardOutlined />),
  getItem('Supplier Management', 'sub1', <SolutionOutlined />, [
    getItem('Dashboard', '2'),
    getItem('Supplier List', '3'),
    getItem('Review & Approvals', '4'),
    getItem('Configurations', '5'),
  ]),
  getItem('Funnel Management', '6', <NodeIndexOutlined />),
  getItem('Help & Support', '7', <QuestionCircleOutlined />),
];

const Sidebar = () => {
  return (
    <Sider breakpoint="lg" collapsedWidth="0" theme="light" style={{ height: '100vh', position: 'fixed', left: 0 }}>
      <div style={{ height: 32, margin: 16, fontWeight: 'bold', fontSize: '1.2rem' }}>
        ALISA
      </div>
      <Menu theme="light" defaultSelectedKeys={['3']} defaultOpenKeys={['sub1']} mode="inline" items={items} />
      <div style={{ position: 'absolute', bottom: 20, width: '100%', padding: '0 16px' }}>
        <Menu mode="inline" selectable={false} items={[getItem('John Doe', 'user', <UserOutlined />)]} />
      </div>
    </Sider>
  );
};

export default Sidebar;