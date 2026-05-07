import React, { useState } from 'react';
import { Modal, Form, Input, message, Tabs, Button, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/utils/api';

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mainAddressIndex, setMainAddressIndex] = useState(0);

  const onFinish = async (values: any) => {
    setLoading(true);
    
    const formattedAddresses = values.addresses?.map((addr: any, index: number) => ({
      name: addr.name,
      address: addr.address,
      is_main: index === mainAddressIndex
    })) || [];

    const payload = {
      name: values.name,
      nickname: values.nickname,
      addresses: formattedAddresses,
      contacts: [],
      groups: []
    };

    try {
      await api.post('/suppliers', payload);
      message.success('Supplier berhasil ditambahkan!');
      form.resetFields();
      setMainAddressIndex(0);
      onSuccess(); 
      onClose();   
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Gagal menambahkan supplier';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="New Supplier"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Save"
      cancelText="Cancel"
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '120px', height: '120px', border: '1px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Logo</span>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item label="Supplier Name" name="name" rules={[{ required: true, message: 'Required!' }]}>
              <Input placeholder="PT Setroom Indonesia" />
            </Form.Item>
            <Form.Item label="Nick Name" name="nickname">
              <Input placeholder="Setroom" />
            </Form.Item>
          </div>
        </div>

        {}
        <Tabs 
          defaultActiveKey="1" 
          type="card" 
          items={[
            { 
              key: '1', 
              label: 'Address', 
              children: (
                <Form.List name="addresses" initialValue={[{ name: '', address: '' }]}>
                  {(fields, { add, remove }) => (
                    <div> {}
                      {}
                      <div style={{ display: 'flex', fontWeight: 'bold', background: '#f0f0f0', padding: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '40px', textAlign: 'center' }}>
                          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" onClick={() => add()} />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '8px' }}>Name</div>
                        <div style={{ flex: 2, paddingLeft: '8px' }}>Address</div>
                        <div style={{ width: '80px', textAlign: 'center' }}>Main</div>
                        <div style={{ width: '40px' }}></div>
                      </div>

                      {}
                      {fields.map(({ key, name, ...restField }, index) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ width: '40px', textAlign: 'center', paddingTop: '5px' }}>
                            {index + 1}
                          </div>
                          <div style={{ flex: 1, paddingRight: '8px' }}>
                            <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Required!' }]}>
                              <Input placeholder="Example: Head Office" />
                            </Form.Item>
                          </div>
                          <div style={{ flex: 2, paddingRight: '8px' }}>
                            <Form.Item {...restField} name={[name, 'address']} rules={[{ required: true, message: 'Required!' }]}>
                              <Input placeholder="Example: Fatmawati Raya St, 123" />
                            </Form.Item>
                          </div>
                          <div style={{ width: '80px', textAlign: 'center', paddingTop: '5px' }}>
                            <Radio 
                              checked={mainAddressIndex === index} 
                              onChange={() => setMainAddressIndex(index)} 
                            />
                          </div>
                          <div style={{ width: '40px', textAlign: 'center', paddingTop: '5px' }}>
                            {fields.length > 1 && (
                              <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => remove(name)} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.List>
              ) 
            },
            { key: '2', label: 'Contacts', children: <div style={{ padding: 20 }}>Konten Contacts</div> },
            { key: '3', label: 'Groups', children: <div style={{ padding: 20 }}>Konten Groups</div> },
            { key: '4', label: 'Material List', children: <div style={{ padding: 20 }}>Konten Material List</div> },
            { key: '5', label: 'Others', children: <div style={{ padding: 20 }}>Konten Others</div> },
          ]} 
        />
      </Form>
    </Modal>
  );
};

export default SupplierModal;