import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faXmark} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import emailjs from 'emailjs-com';
const Order = () => {
  const [orders, setOrders] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [complaintMessage, setComplaintMessage] = useState('');
  const [username, setUserName] = useState(user.name);
  const [useremail, setUserEmail] = useState('');
  const [usermobile, setUserMobile] = useState('');





  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/order/getAllOrders');
        const { data, success, message } = await response.json();

        if (success) {
          console.log('API Response:', data);

          if (user && user.name) {
            const filteredOrders = data.filter((order) => order.customerName === user.name);
            const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
          } else {
            console.error('User is null or does not have a name property');
          }
        } else {
          console.error('Error fetching orders:', message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setComplaintMessage('');
    setUserName('');
    setUserEmail('');
    setUserMobile('');
  };

  const handleComplaintSubmit = async() => {
    if (selectedOrder) {
      try {
       const templateParams = {
          to_name: 'Lakshay Bansal', 
          from_name: username, 
          message: complaintMessage,
          email:useremail,
mobile:usermobile,
        };
        await emailjs.send('service_ewumrwj','template_w41gkya',templateParams,'Sx4o6vx7xG2hKlQda');

        alert('Email sent successfully!');
        closeModal();
      } catch (error) {
       console.log('Error sending email:', error);
      }
    }
    }
  

  return (
    <div>
      <h2 className="text-4xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available for {user.name}</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="border p-4 mb-4">
              <h3 className="text-2xl font-bold mb-2">Order #{order._id}</h3>
              <p>Total Cost: Rs{order.totalCost}</p>
              <p>Total Items: {order.totalItems}</p>
              <p>Placed At: {formatDate(order.createdAt)}</p>
              <p>Customer Name: {order.customerName}</p>
              <h4 className="text-xl font-bold mt-2">Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
              <button onClick={() => openModal(order)} className="mt-2 bg-red-500 text-white  p-2 rounded-md">
              <FontAwesomeIcon icon={faMessage} className='pr-2'/>Having Query/Complaint regarding order ?
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={selectedOrder !== null}
        onRequestClose={closeModal}
        contentLabel="Complaint/Query Form"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-4">Complaint Form - Order #{selectedOrder?._id}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleComplaintSubmit();
          }}
        >
          <label htmlFor="name" className="block text-xl font-bold text-gray-700">
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={user.name}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          ></input>
         
          <label htmlFor="email" className="block text-xl font-bold text-gray-700">
          Email:
          </label>
          <input
          type='mail'
            id="email"
            name="email"
         
            value={useremail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          ></input>
          
          <label htmlFor="mobile" className="block text-xl font-bold text-gray-700">
            Contact Number :
          </label>
          <input
            id="mobile"
            name="mobile"
           type='number'
            value={usermobile}
            onChange={(e) => setUserMobile(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          ></input>
        
          <label htmlFor="complaint" className="block text-xl font-bold text-gray-700">
            Complaint/Query:
          </label>
          <textarea
            id="complaint"
            name="complaint"
            rows="3"
            value={complaintMessage}
            onChange={(e) => setComplaintMessage(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          ></textarea>
          <div className="flex justify-end mt-4">
            <button type="submit" className="mr-2 bg-red-500 text-white p-2 rounded-md">
              Submit Complaint
            </button>
            <button onClick={closeModal} className="relative bottom-96 bg-gray-300 text-gray-700 p-2 rounded-md">
             <FontAwesomeIcon icon={faXmark}/>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Order;
