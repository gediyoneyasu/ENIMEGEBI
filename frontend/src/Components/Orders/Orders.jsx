import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import './Orders.css';

const Orders = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');

  const translations = {
    en: {
      title: 'My Orders',
      noOrders: 'No orders yet',
      noOrdersMsg: 'You haven\'t placed any orders yet.',
      startShopping: 'Start Shopping',
      orderId: 'Order ID',
      date: 'Date',
      paymentStatus: 'Payment Status',
      orderStatus: 'Order Status',
      totalAmount: 'Total Amount',
      viewDetails: 'View Details',
      printReceipt: 'Print Receipt',
      orderDetails: 'Order Details',
      orderInfo: 'Order Information',
      shippingInfo: 'Shipping Information',
      items: 'Items',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      close: 'Close',
      print: 'Print',
      pending: 'Pending',
      paid: 'Paid',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      failed: 'Failed',
      refunded: 'Refunded',
      moreItems: 'more items',
      loading: 'Loading your orders...'
    },
    am: {
      title: 'የእኔ ትዕዛዞች',
      noOrders: 'እስካሁን ትዕዛዝ የለም',
      noOrdersMsg: 'እስካሁን ምንም ትዕዛዝ አላስገቡም።',
      startShopping: 'ግብይት ጀምር',
      orderId: 'የትዕዛዝ መለያ',
      date: 'ቀን',
      paymentStatus: 'የክፍያ ሁኔታ',
      orderStatus: 'የትዕዛዝ ሁኔታ',
      totalAmount: 'ጠቅላላ መጠን',
      viewDetails: 'ዝርዝር ይመልከቱ',
      printReceipt: 'ደረሰኝ አትም',
      orderDetails: 'የትዕዛዝ ዝርዝሮች',
      orderInfo: 'የትዕዛዝ መረጃ',
      shippingInfo: 'የመላኪያ መረጃ',
      items: 'እቃዎች',
      product: 'ምርት',
      quantity: 'ብዛት',
      price: 'ዋጋ',
      total: 'ጠቅላላ',
      close: 'ዝጋ',
      print: 'አትም',
      pending: 'በመጠባበቅ ላይ',
      paid: 'ተከፍሏል',
      processing: 'በሂደት ላይ',
      shipped: 'ተልኳል',
      delivered: 'ደርሷል',
      cancelled: 'ተሰርዟል',
      failed: 'አልተሳካም',
      refunded: 'ገንዘብ ተመልሷል',
      moreItems: 'ተጨማሪ እቃዎች',
      loading: 'ትዕዛዞችዎን በማጫን ላይ...'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchOrders();
    
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    const orderId = urlParams.get('order');
    
    if (paymentSuccess === 'success' && orderId) {
      alert(language === 'en' ? '✅ Payment successful! Your order has been confirmed.' : '✅ ክፍያ ተሳክቷል! ትዕዛዝዎ ተረጋግጧል።');
      window.history.replaceState({}, document.title, '/orders');
    }
  }, [language]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('enimegebiToken');
      const response = await axios.get('http://localhost:5001/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(language === 'en' ? 'Failed to load orders' : 'ትዕዛዞችን ማግኘት አልተቻለም');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336',
      paid: '#4caf50',
      failed: '#f44336',
      refunded: '#9c27b0'
    };
    return colors[status] || '#999';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: t.pending,
      processing: t.processing,
      shipped: t.shipped,
      delivered: t.delivered,
      cancelled: t.cancelled,
      paid: t.paid,
      failed: t.failed,
      refunded: t.refunded
    };
    return statusMap[status] || status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const printReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    const title = language === 'en' ? 'Enimegebi Receipt' : 'የኢኒመገቢ ደረሰኝ';
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - ${order.orderReference}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .receipt { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #c9a66b; padding-bottom: 20px; }
            .header h1 { color: #c9a66b; margin: 0; }
            .order-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; }
            .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #ddd; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header"><h1>Enimegebi</h1><p>${language === 'en' ? 'Ethiopian Organic Products' : 'የኢትዮጵያ ኦርጋኒክ ምርቶች'}</p></div>
            <div class="order-info">
              <p><strong>${t.orderId}:</strong> ${order.orderReference}</p>
              <p><strong>${t.date}:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>${t.paymentStatus}:</strong> ${getStatusText(order.paymentStatus)}</p>
              <p><strong>${t.orderStatus}:</strong> ${getStatusText(order.orderStatus)}</p>
            </div>
            <table><thead><tr><th>${t.product}</th><th>${t.quantity}</th><th>${t.price}</th><th>${t.total}</th></tr></thead>
            <tbody>${order.items.map(item => `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>ETB ${item.price}</td><td>ETB ${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('')}</tbody></table>
            <div class="total"><p>${t.totalAmount}: ETB ${order.totalAmount.toFixed(2)}</p></div>
            <div class="footer"><p>${language === 'en' ? 'Thank you for shopping with Enimegebi!' : 'ኢኒመገቢን ስለመረጡ እናመሰግናለን!'}</p></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (<div className="orders-loading"><i className="ri-loader-4-line ri-spin"></i><p>{t.loading}</p></div>);
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">{t.title}</h1>
      {error && <div className="error-message">{error}</div>}
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <i className="ri-shopping-bag-line"></i>
          <h2>{t.noOrders}</h2>
          <p>{t.noOrdersMsg}</p>
          <Link to="/products" className="start-shopping-btn">{t.startShopping}</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info"><span className="order-ref">{order.orderReference}</span><span className="order-date">{formatDate(order.createdAt)}</span></div>
                <div className="order-status">
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(order.paymentStatus) }}>{getStatusText(order.paymentStatus)}</span>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>{getStatusText(order.orderStatus)}</span>
                </div>
              </div>
              <div className="order-items">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-image">{item.image ? <img src={item.image} alt={item.productName} /> : <i className="ri-image-line"></i>}</div>
                    <div className="item-details"><h4>{item.productName}</h4><p>{t.quantity}: {item.quantity} × ETB {item.price}</p></div>
                  </div>
                ))}
                {order.items.length > 2 && <div className="more-items">+{order.items.length - 2} {t.moreItems}</div>}
              </div>
              <div className="order-footer">
                <div className="order-total"><span>{t.totalAmount}:</span><strong>ETB {order.totalAmount.toFixed(2)}</strong></div>
                <div className="order-actions">
                  <button onClick={() => setSelectedOrder(order)} className="view-details-btn"><i className="ri-eye-line"></i> {t.viewDetails}</button>
                  <button onClick={() => printReceipt(order)} className="print-receipt-btn"><i className="ri-printer-line"></i> {t.printReceipt}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{t.orderDetails}</h2><button className="close-modal" onClick={() => setSelectedOrder(null)}><i className="ri-close-line"></i></button></div>
            <div className="order-details">
              <div className="detail-section"><h3>{t.orderInfo}</h3><p><strong>{t.orderId}:</strong> {selectedOrder.orderReference}</p><p><strong>{t.date}:</strong> {formatDate(selectedOrder.createdAt)}</p><p><strong>{t.paymentStatus}:</strong> <span style={{ color: getStatusColor(selectedOrder.paymentStatus) }}>{getStatusText(selectedOrder.paymentStatus)}</span></p><p><strong>{t.orderStatus}:</strong> <span style={{ color: getStatusColor(selectedOrder.orderStatus) }}>{getStatusText(selectedOrder.orderStatus)}</span></p></div>
              <div className="detail-section"><h3>{t.shippingInfo}</h3><p><strong>{t.yourName}:</strong> {selectedOrder.userName}</p><p><strong>{t.email}:</strong> {selectedOrder.userEmail}</p><p><strong>{t.phone}:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}</p><p><strong>{t.address}:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}</p></div>
              <div className="detail-section"><h3>{t.items}</h3><table className="items-table"><thead><tr><th>{t.product}</th><th>{t.quantity}</th><th>{t.price}</th><th>{t.total}</th></tr></thead><tbody>{selectedOrder.items.map((item, idx) => (<tr key={idx}><td>{item.productName}</td><td>{item.quantity}</td><td>ETB {item.price}</td><td>ETB {(item.price * item.quantity).toFixed(2)}</td></tr>))}</tbody><tfoot><tr><td colSpan="3" className="total-label"><strong>{t.total}</strong></td><td><strong>ETB {selectedOrder.totalAmount.toFixed(2)}</strong></td></tr></tfoot></table></div>
              <div className="modal-actions"><button onClick={() => printReceipt(selectedOrder)} className="print-btn"><i className="ri-printer-line"></i> {t.print}</button><button onClick={() => setSelectedOrder(null)} className="close-btn">{t.close}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
