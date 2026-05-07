"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import SummaryCards from '@/components/fragments/SummaryCards';
import SupplierTable from '@/components/fragments/SupplierTable';
import SupplierModal from '@/components/fragments/SupplierModal';
import { Button, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SupplierListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>Supplier List</Title>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={() => setIsModalOpen(true)}
        >
          New Supplier
        </Button>
      </div>

      {}
      <SummaryCards key={`summary-${refreshTrigger}`} />

      <div style={{ marginTop: '24px' }}>
        <SupplierTable key={`table-${refreshTrigger}`} />
      </div>

      <SupplierModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  );
}