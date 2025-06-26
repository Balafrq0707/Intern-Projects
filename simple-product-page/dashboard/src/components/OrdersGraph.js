import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const OrdersGraph = () => {
  const [data, setData] = useState([]);

useEffect(() => {
    const fetchOrdersSummary = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders/summary');
        const result = await response.json();

        const formatData = result.map(entry => ({
          date: entry.date,
          totalOrders: parseInt(entry.totalOrders, 10),
        }));

        setData(formatData);
      } catch (error) {
        console.error('Failed to fetch order summary:', error);
      }
    };

    fetchOrdersSummary();
  }, []);


  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Orders Over Time</h3>
      <ResponsiveContainer width="95%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="totalOrders" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OrdersGraph;