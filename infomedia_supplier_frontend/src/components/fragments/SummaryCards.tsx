import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Skeleton } from 'antd';
import { UserOutlined, UserAddOutlined, RiseOutlined, FallOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const SummaryCards = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/suppliers/summary')
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => console.error("Gagal fetch summary:", err));
  }, []);

  if (loading) return <Skeleton active />;

  return (
    <Row gutter={16}>
      {}
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Supplier"
            value={data?.total_supplier || 0}
            prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
          />
          <div style={{ color: 'green', fontSize: '12px' }}>
            <RiseOutlined /> +8% vs last year
          </div>
        </Card>
      </Col>

      {}
      <Col span={6}>
        <Card>
          <Statistic
            title="New Supplier"
            value={data?.new_supplier || 0}
            prefix={<UserAddOutlined style={{ color: '#8c8c8c' }} />}
          />
          <div style={{ color: 'green', fontSize: '12px' }}>
            <RiseOutlined /> +1% vs Last Year
          </div>
        </Card>
      </Col>

      {}
      <Col span={6}>
        <Card>
          <Statistic
            title="Avg Cost per Supplier"
            value={data?.avg_cost || "Rp 0"}
            prefix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>Rp</span>}
          />
          <div style={{ color: 'red', fontSize: '12px' }}>
            <FallOutlined /> -1% vs Last Year
          </div>
        </Card>
      </Col>

      {}
      <Col span={6}>
        <Card>
          <Statistic
            title="Blocked Supplier"
            value={data?.blocked_supplier || 0}
            prefix={<ClockCircleOutlined style={{ color: '#8c8c8c' }} />}
          />
          <div style={{ color: 'green', fontSize: '12px' }}>
            <RiseOutlined /> -4% vs Last Year
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;