import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/customer.css';

// COMPONENTS
import Sidebar from '../../components/Sidebar';
import ProtectedLayout from '../../components/ProtectedLayout';

const Customer = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/users/${id}`)
      .then(res => {
        setUser(res.data);
      })
      .catch(error => console.log(error));
  }, [id]);

  // CURRENCY LOCALIZATION Function
  function localize(amount) {
    return Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(amount);
  }

  function totalSpent() {
    return localize(user.orders.reduce((prev, curr) => prev + curr.totalAmt, 0));
  }

  function averageOrderValue() {
    const orderLength = user.orders.length;
    const orderTotal = user.orders.reduce((prev, curr) => prev + curr.totalAmt, 0);
    const averageValue = orderTotal / orderLength;
    return localize(averageValue);
  }

  if (user === null) {
    return (
      <h1>Loading..</h1>
    );
  }

  if (user !== null) {
    return (
      <ProtectedLayout>
        <div className="dashboard-grid">

          {/* SIDEBAR */}
          <Sidebar activePage={"customers"} />

          <div className="dashboard-container">
            <div className="divider"></div>
            <section className="dashboard-main">
              <div className="area-header">
                <div className="arrow-title">
                  <img
                    src="/images/icons/chevron-right-outline-white.svg"
                    alt="Return Back Icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(-1)}
                  />
                  <h3>{`${user.first_name} ${user.last_name}`}</h3>
                </div>
              </div>

              <div className="area-grid">
                {user.orders.length >= 1 && (
                  <section className="order-details">
                    <div className="order-facts-grid">
                      <section className="spent">
                        <h4>
                          total amount <br />
                          spent
                        </h4>
                        <p>{totalSpent()}</p>
                      </section>
                      <section className="placed">
                        <h4>total orders placed</h4>
                        <p>{user.orders.length} {user.orders.length > 1 ? "orders" : "order"}</p>
                      </section>
                      <section className="average">
                        <h4>
                          avg. order <br />
                          value
                        </h4>
                        <p>{averageOrderValue()}</p>
                      </section>
                    </div>
                    <div className="last">
                      <h4>last order placed</h4>
                      <div className="order-grid">
                        <div className="order-details">
                          <div className="status">
                            <Link to={`/dashboard/orders/${user.orders[0].orderNumber}`}>#{user.orders[0].orderNumber}</Link><span className="payment-status">paid</span>
                            <span className="fulfillment-status">{user.orders[0].fulfillmentStatus}</span>
                          </div>
                          <p>Ordered on {new Date(user.orders[0].createdAt).toLocaleDateString("en-AE", { month: "short", day: "2-digit", year: "numeric" })}</p>
                        </div>
                        <div className="order-amount">
                          <p>{localize(user.orders[0].totalAmt)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="total-orders">
                      <h4>total orders placed</h4>
                      {user.orders.map((eachOrder, index) => (
                        <div key={index} className="order-grid">
                          <div className="order-details">
                            <div className="status">
                              <Link to={`/dashboard/orders/${eachOrder.orderNumber}`}>#{eachOrder.orderNumber}</Link
                              ><span className="payment-status">paid</span>
                              <span className="fulfillment-status">{eachOrder.fulfillmentStatus}</span>
                            </div>
                            <p>Ordered on {new Date(eachOrder.createdAt).toLocaleDateString("en-AE", { month: "short", day: "2-digit", year: "numeric" })}</p>
                          </div>
                          <div className="order-amount">
                            <p>{localize(eachOrder.totalAmt)}</p>
                          </div>
                        </div>
                      ))}

                    </div>
                  </section>
                )}

                <div className="customer-details">
                  <div className="details-card">
                    <h4>Customer details</h4>
                    <div className="customer-name">
                      <h5 className="name">Customer Name</h5>
                      <p>{`${user.first_name} ${user.last_name}`}</p>
                    </div>
                    <div className="customer-email">
                      <h5 className="email">Customer Email</h5>
                      <p>{user.email}</p>
                    </div>
                    <div className="shipping-address">
                      <h5>Shipping Address</h5>
                      <p className="shipping-name">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="shipping-residence">{user.addresses.apartment}</p>
                      <p className="shipping-city">{user.addresses.city}</p>
                      <p className="shipping-country">{user.addresses.country}</p>
                      <p className="shipping-contact">{user.phone}</p>
                    </div>
                    <div className="billing-address">
                      <h5>Billing address</h5>
                      <p>Same as shipping address</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div >
        </div >
      </ProtectedLayout>
    );
  }
};

export default Customer;