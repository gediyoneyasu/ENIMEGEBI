import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Orders.css';

function Orders() {
  const { language } = useLanguage();  // Use context instead of local state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock orders data
    const mockOrders = [
      {
        id: 'ORD-001',
        date: '2024-03-15',
        status: 'delivered',
        paymentMethod: 'cash',
        total: 620,
        items: [
          { id: 1, name: 'Organic Coffee', nameAm: 'ኦርጋኒክ ቡና', price: 350, quantity: 1, image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=100' },
          { id: 2, name: 'Fresh Avocado', nameAm: 'ትኩስ አቮካዶ', price: 120, quantity: 2, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100' }
        ],
        deliveryMethod: 'delivery',
        address: 'Hawassa, Ethiopia',
        tracking: [
          { status: 'Order Placed', date: '2024-03-15 10:30', completed: true },
          { status: 'Confirmed', date: '2024-03-15 11:00', completed: true },
          { status: 'Preparing', date: '2024-03-15 14:00', completed: true },
          { status: 'Out for Delivery', date: '2024-03-16 09:00', completed: true },
          { status: 'Delivered', date: '2024-03-16 14:30', completed: true }
        ]
      },
      {
        id: 'ORD-002',
        date: '2024-03-10',
        status: 'shipped',
        paymentMethod: 'chapa',
        total: 480,
        items: [
          { id: 3, name: 'Raw Honey', nameAm: 'ጥሬ ማር', price: 250, quantity: 1, image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=100' },
          { id: 4, name: 'Fresh Milk', nameAm: 'ትኩስ ወተት', price: 80, quantity: 3, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100' }
        ],
        deliveryMethod: 'pickup',
        pickupPoint: 'Hawassa Main Market',
        tracking: [
          { status: 'Order Placed', date: '2024-03-10 09:15', completed: true },
          { status: 'Confirmed', date: '2024-03-10 10:00', completed: true },
          { status: 'Ready for Pickup', date: '2024-03-11 08:00', completed: true },
          { status: 'Picked Up', date: '2024-03-11 16:30', completed: false }
        ]
      },
      {
        id: 'ORD-003',
        date: '2024-03-05',
        status: 'pending',
        paymentMethod: 'telebirr',
        total: 350,
        items: [
          { id: 5, name: 'Tomatoes', nameAm: 'ቲማቲም', price: 60, quantity: 3, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa2e5?w=100' },
          { id: 6, name: 'Mango', nameAm: 'ማንጎ', price: 90, quantity: 2, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100' }
        ],
        deliveryMethod: 'delivery',
        address: 'Adare, Hawassa',
        tracking: [
          { status: 'Order Placed', date: '2024-03-05 14:20', completed: true },
          { status: 'Confirmed', date: '2024-03-05 15:00', completed: false },
          { status: 'Preparing', date: 'Pending', completed: false }
        ]
      }
    ];
    
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const translations = {
    en: {
      title: 'My Orders',
      subtitle: 'View and track your orders',
      orderId: 'Order ID',
      date: 'Date',
      items: 'Items',
      total: 'Total',
      status: 'Status',
      actions: 'Actions',
      viewDetails: 'View Details',
      trackOrder: 'Track Order',
      reorder: 'Reorder',
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      orderDetails: 'Order Details',
      orderSummary: 'Order Summary',
      paymentMethod: 'Payment Method',
      deliveryMethod: 'Delivery Method',
      deliveryAddress: 'Delivery Address',
      pickupPoint: 'Pickup Point',
      trackingInfo: 'Tracking Information',
      close: 'Close',
      noOrders: 'No orders found',
      shopNow: 'Shop Now',
      allOrders: 'All Orders',
      recentOrders: 'Recent Orders'
    },
    am: {
      title: 'ትዕዛዞቼ',
      subtitle: 'ትዕዛዞችዎን ይመልከቱ እና ይከታተሉ',
      orderId: 'የትዕዛዝ መለያ',
      date: 'ቀን',
      items: 'ምርቶች',
      total: 'ድምር',
      status: 'ሁኔታ',
      actions: 'ድርጊቶች',
      viewDetails: 'ዝርዝር ይመልከቱ',
      trackOrder: 'ትዕዛዝ ይከታተሉ',
      reorder: 'እንደገና ያዝዙ',
      pending: 'በመጠባበቅ ላይ',
      confirmed: 'ተረጋግጧል',
      processing: 'በሂደት ላይ',
      shipped: 'ተልኳል',
      delivered: 'ደርሷል',
      cancelled: 'ተሰርዟል',
      orderDetails: 'የትዕዛዝ ዝርዝር',
      orderSummary: 'የትዕዛዝ ማጠቃለያ',
      paymentMethod: 'የክፍያ ዘዴ',
      deliveryMethod: 'የመላኪያ ዘዴ',
      deliveryAddress: 'የመላኪያ አድራሻ',
      pickupPoint: 'የመልቀቂያ ነጥብ',
      trackingInfo: 'የክትትል መረጃ',
      close: 'ዝጋ',
      noOrders: 'ምንም ትዕዛዞች አልተገኙም',
      shopNow: 'አሁን ይግዙ',
      allOrders: 'ሁሉም ትዕዛዞች',
      recentOrders: 'የቅርብ ጊዜ ትዕዛዞች'
    }
  };

  const t = translations[language];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'status-pending', text: t.pending },
      confirmed: { class: 'status-confirmed', text: t.confirmed },
      processing: { class: 'status-processing', text: t.processing },
      shipped: { class: 'status-shipped', text: t.shipped },
      delivered: { class: 'status-delivered', text: t.delivered },
      cancelled: { class: 'status-cancelled', text: t.cancelled }
    };
    const s = statusMap[status] || statusMap.pending;
    return <span className={`status-badge ${s.class}`}>{s.text}</span>;
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const filters = [
    { id: 'all', name: t.allOrders },
    { id: 'pending', name: t.pending },
    { id: 'confirmed', name: t.confirmed },
    { id: 'shipped', name: t.shipped },
    { id: 'delivered', name: t.delivered }
  ];

  if (loading) {
    return (
      <div className="orders-loading">
        <i className="ri-loader-4-line ri-spin"></i>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Filter Tabs */}
        <div className="orders-filters">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <i className="ri-shopping-bag-line"></i>
            <h2>{t.noOrders}</h2>
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="shop-now-btn">{t.shopNow}</Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">{t.orderId}: {order.id}</span>
                    <span className="order-date">
                      <i className="ri-calendar-line"></i> {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-items">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={language === 'en' ? item.name : item.nameAm} />
                      <div className="order-item-info">
                        <h4>{language === 'en' ? item.name : item.nameAm}</h4>
                        <p>{item.quantity} x ETB {item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">+{order.items.length - 3} more items</div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>{t.total}:</span>
                    <strong>ETB {order.total}</strong>
                  </div>
                  <div className="order-actions">
                    <button className="view-details-btn" onClick={() => setSelectedOrder(order)}>
                      <i className="ri-eye-line"></i> {t.viewDetails}
                    </button>
                    {order.status === 'delivered' && (
                      <button className="reorder-btn">
                        <i className="ri-repeat-line"></i> {t.reorder}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.orderDetails}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span>{t.orderId}:</span>
                <strong>{selectedOrder.id}</strong>
              </div>
              <div className="detail-row">
                <span>{t.date}:</span>
                <strong>{new Date(selectedOrder.date).toLocaleDateString()}</strong>
              </div>
              <div className="detail-row">
                <span>{t.status}:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="detail-row">
                <span>{t.paymentMethod}:</span>
                <strong>{selectedOrder.paymentMethod.toUpperCase()}</strong>
              </div>
              <div className="detail-row">
                <span>{t.deliveryMethod}:</span>
                <strong>{selectedOrder.deliveryMethod === 'delivery' ? t.deliveryMethod : t.pickupPoint}</strong>
              </div>
              {selectedOrder.deliveryMethod === 'delivery' ? (
                <div className="detail-row">
                  <span>{t.deliveryAddress}:</span>
                  <strong>{selectedOrder.address}</strong>
                </div>
              ) : (
                <div className="detail-row">
                  <span>{t.pickupPoint}:</span>
                  <strong>{selectedOrder.pickupPoint}</strong>
                </div>
              )}

              <div className="detail-divider"></div>

              <h4>{t.orderSummary}</h4>
              <div className="modal-items">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="modal-item">
                    <span>{language === 'en' ? item.name : item.nameAm} x{item.quantity}</span>
                    <span>ETB {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="modal-total">
                <span>{t.total}:</span>
                <strong>ETB {selectedOrder.total}</strong>
              </div>

              <div className="detail-divider"></div>

              <h4>{t.trackingInfo}</h4>
              <div className="tracking-timeline">
                {selectedOrder.tracking.map((track, index) => (
                  <div key={index} className={`tracking-step ${track.completed ? 'completed' : ''}`}>
                    <div className="tracking-dot"></div>
                    <div className="tracking-content">
                      <div className="tracking-status">{track.status}</div>
                      <div className="tracking-date">{track.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;