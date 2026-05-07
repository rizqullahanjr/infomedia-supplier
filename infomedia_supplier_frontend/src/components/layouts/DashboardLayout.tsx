import React from 'react';
import { Layout } from 'antd';
import Sidebar from '../fragments/Sidebar';

const { Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 200 }}> {}
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;