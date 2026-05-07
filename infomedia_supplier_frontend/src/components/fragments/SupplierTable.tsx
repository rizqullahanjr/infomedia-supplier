import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message, Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api from '@/utils/api';

interface SupplierData {
  id: number;
  name: string;
  nickname: string;
  code: string;
  status: string;
  addresses: any[];
  contacts: any[];
}

const SupplierTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/suppliers');
      setDataSource(res.data.data);
    } catch (err) {
      console.error("Gagal load tabel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/suppliers/${id}/status`, { status: newStatus });
      message.success('Status berhasil diubah!');
      fetchData(); 
    } catch (error) {
      message.error('Gagal mengubah status');
    }
  };

  const columns: ColumnsType<SupplierData> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        const prefix = text.replace('PT ', '').substring(0, 4).toUpperCase(); 
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar shape="square" icon={<PictureOutlined />} style={{ background: '#f0f0f0', color: '#8c8c8c' }} />
              <div style={{ fontSize: '10px', marginTop: '2px', fontWeight: 'bold' }}>{prefix}</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{text}</div>
              <div style={{ fontSize: '12px', color: '#595959' }}>
                 {}
                 <a href="#" style={{ color: '#1890ff' }}>{record.code}</a> [{record.nickname}]
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Address',
      key: 'address',
      render: (_, record) => {
        const mainAddr = record.addresses?.find((a: any) => a.is_main);
        return mainAddr ? mainAddr.address : '-';
      },
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => {
        const mainContact = record.contacts?.find((c: any) => c.is_main);
        return mainContact ? mainContact.name : '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        return (
          <Select
            value={status}
            onChange={(val) => handleStatusChange(record.id, val)}
            variant='borderless'
            style={{ width: 130 }}
            options={[
              { value: 'Active', label: <Tag color="blue">Active</Tag> },
              { value: 'In Progress', label: <Tag color="orange">In Progress</Tag> },
              { value: 'Blocked', label: <Tag color="default">Blocked</Tag> },
            ]}
          />
        );
      },
    },
  ];

  return (
    <Table 
      dataSource={dataSource} 
      columns={columns} 
      rowKey="id" 
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default SupplierTable;