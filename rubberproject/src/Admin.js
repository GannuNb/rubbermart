import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './Admin.css';
import './Sell.css';
import Adminnav from './Adminnav';

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [scrapItems, setScrapItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newItemFormData, setNewItemFormData] = useState({
        name: '',
        type: '',
        available_quantity: '',
        price: '',
        hsn:'',
        ex_mundra:'',
        ex_nhavasheva : '',
        ex_chennai : '',
    });


    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        available_quantity: '',
        price: '',
        hsn:"",
        ex_mundra:"",
        ex_nhavasheva : '',
        ex_chennai : '',
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    

    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, { email, password });
            const tokenKey = `admin_token_${email}`; // Unique key for the token
            localStorage.setItem(tokenKey, response.data.token); // Store the JWT token with a unique key
            setIsAuthenticated(true); // Set authentication to true on successful login
        } catch (err) {
            setLoginError('Invalid email or password.');
        }
    };

    // Logout handler
    const handleLogout = () => {
        const tokenKey = `admin_token_${email}`; // Use the same unique key for logout
        localStorage.removeItem(tokenKey); // Clear the specific JWT token
        setIsAuthenticated(false);
    };

    // Fetch scrap items
    useEffect(() => {
        const fetchAdminScrapItems = async () => {
            try {
                const tokenKey = `admin_token_${email}`; // Use the same unique key to fetch the token
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/scrap`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem(tokenKey)}` }
                });
                setScrapItems(response.data.scrap_items);
            } catch (err) {
                setError('Failed to fetch scrap items.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchAdminScrapItems();
        }
    }, [isAuthenticated, email]); // Add email as a dependency

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scrap item?')) {
            try {
                const tokenKey = `admin_token_${email}`; // Use the same unique key for the delete request
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/scrap/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem(tokenKey)}` }
                });
                setScrapItems(scrapItems.filter(item => item._id !== id));
                alert('Scrap item deleted successfully.');
            } catch (err) {
                alert('Failed to delete scrap item.');
            }
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            type: item.type,
            available_quantity: item.available_quantity,
            price: item.price,
            hsn: item.hsn,
            ex_mundra: item.ex_mundra,
            ex_nhavasheva : item.ex_nhavasheva,
            ex_chennai : item.ex_chennai,
        });
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentItem(null); // Reset currentItem when closing modal
        setFormData({ name: '', type: '', available_quantity: '', price: '',hsn:'',ex_mundra:'' ,ex_nhavasheva : '',
            ex_chennai : '',}); // Reset form data
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!currentItem) return;

        const updatedData = {
            name: formData.name.trim(),
            type: formData.type.trim(),
            available_quantity: Number(formData.available_quantity),
            price: Number(formData.price),
            hsn:formData.hsn.trim(),
            ex_mundra:Number(formData.ex_mundra),
            ex_nhavasheva : Number(formData.ex_nhavasheva),
            ex_chennai : Number(formData.ex_chennai),
        };

        if (isNaN(updatedData.available_quantity) || updatedData.available_quantity < 0 || isNaN(updatedData.price) || updatedData.price < 0) {
            alert('Available Quantity and Price must be non-negative numbers.');
            setIsSubmitting(false);
            return;
        }

        try {
            const tokenKey = `admin_token_${email}`; // Use the same unique key for the update request
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/scrap/${currentItem._id}`, updatedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem(tokenKey)}` }
            });
            setScrapItems(scrapItems.map(item => item._id === currentItem._id ? response.data.scrap_item : item));
            alert('Scrap item updated successfully.');
            handleCloseEditModal(); // Close modal after successful update
        } catch (err) {
            alert('Failed to update scrap item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewItemFormChange = (e) => {
        const { name, value } = e.target;
        setNewItemFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNewItemFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        // Ensure HSN is provided
        if (!newItemFormData.hsn.trim()) {
            alert('HSN is required.');
            setIsSubmitting(false);
            return;
        }
    
        const newData = {
            name: newItemFormData.name.trim(),
            type: newItemFormData.type.trim(),
            available_quantity: Number(newItemFormData.available_quantity),
            price: Number(newItemFormData.price),
            hsn: newItemFormData.hsn.trim(),
            ex_mundra: Number(newItemFormData.ex_mundra),
            ex_nhavasheva : Number(newItemFormData.ex_nhavasheva),
            ex_chennai : Number(newItemFormData.ex_chennai),
        };
    
        // Validate other fields as well
        if (isNaN(newData.available_quantity) || newData.available_quantity < 0 || isNaN(newData.price) || newData.price < 0) {
            alert('Available Quantity and Price must be non-negative numbers.');
            setIsSubmitting(false);
            return;
        }
    
        
        try {
            const tokenKey = `admin_token_${email}`; // Use the same unique key for the add request
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/scrap`, newData, {
                headers: { Authorization: `Bearer ${localStorage.getItem(tokenKey)}` }
            });
            setScrapItems([...scrapItems, response.data.scrap_item]);
            alert('New scrap item added successfully.');
            setNewItemFormData({ name: '', type: '', available_quantity: '', price: '', hsn: '' }); // Reset after adding
        } catch (err) {
            alert('Failed to add new scrap item.');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    if (!isAuthenticated) {
        return (
            <div>
            
                <div className="login-container">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {loginError && <p className="text-danger">{loginError}</p>}
                        <button type="submit">Login</button>
                    </form>
                </div>
           
            </div>
        );
    }

    if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
    if (error) return <div className="container mt-5"><p className="text-danger">{error}</p></div>;

    return (
        <>
        <Adminnav/>

        <div>
        <div className=" mt-5">
            <h2 className="mb-4">Admin Dashboard</h2>

         
            <div className="mb-4">
                <h3>Add New Scrap Item</h3>
                <Form onSubmit={handleNewItemFormSubmit}>
                    <Form.Group controlId="newName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={newItemFormData.name}
                            onChange={handleNewItemFormChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="newType" className="mt-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={newItemFormData.type}
                            onChange={handleNewItemFormChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="newAvailableQuantity" className="mt-3">
                        <Form.Label>Available Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="available_quantity"
                            value={newItemFormData.available_quantity}
                            onChange={handleNewItemFormChange}
                            required
                            min="0"
                        />
                    </Form.Group>
                    <Form.Group controlId="newPrice" className="mt-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={newItemFormData.price}
                            onChange={handleNewItemFormChange}
                            required
                            min="0"
                        />
                    </Form.Group>
                     
                                        <Form.Group controlId="newHsn" className="mt-3">
                        <Form.Label>Hsn</Form.Label>
                        <Form.Control
                            type="text"
                            name="hsn"  // Fix this to 'hsn' instead of 'type'
                            value={newItemFormData.hsn}
                            onChange={handleNewItemFormChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="newPrice" className="mt-3">
                        <Form.Label>ex_mundra</Form.Label>
                        <Form.Control
                            type="number"
                            name="ex_mundra"
                            value={newItemFormData.ex_mundra}
                            onChange={handleNewItemFormChange}
                            required
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="newPrice" className="mt-3">
                        <Form.Label>ex_nhavasheva</Form.Label>
                        <Form.Control
                            type="number"
                            name="ex_nhavasheva"
                            value={newItemFormData.ex_nhavasheva}
                            onChange={handleNewItemFormChange}
                            required
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="newPrice" className="mt-3">
                        <Form.Label>ex_chennai</Form.Label>
                        <Form.Control
                            type="number"
                            name="ex_chennai"
                            value={newItemFormData.ex_chennai}
                            onChange={handleNewItemFormChange}
                            required
                            min="0"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Scrap Item'}
                    </Button>
                </Form>
            </div>

            <div className="row">
                {scrapItems.length === 0 ? (
                    <p>No scrap items available.</p>
                ) : (
                    scrapItems.map((item) => (
                        <div key={item._id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="card-title">{item.name}</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>Type:</strong> {item.type}</p>
                                    <p><strong>Available Quantity:</strong> {item.available_quantity}</p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Hsn:</strong> ${item.hsn}</p>
                                    <p><strong>ex_mundra:</strong> ${item.ex_mundra}</p>
                                    <p><strong>ex_nhavasheva:</strong> ${item.ex_nhavasheva}</p>
                                    <p><strong>ex_chennai:</strong> ${item.ex_chennai}</p>                                </div>
                                <div className="card-footer">
                                    <Button variant="secondary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                                        Edit
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

           
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Scrap Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formType" className="mt-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAvailableQuantity" className="mt-3">
                            <Form.Label>Available Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="available_quantity"
                                value={formData.available_quantity}
                                onChange={handleFormChange}
                                required
                                min="0"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrice" className="mt-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleFormChange}
                                required
                                min="0"
                            />
                        </Form.Group>
                        <Form.Group controlId="newHsn" className="mt-3">
                                <Form.Label>Hsn</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hsn"  // Fix this to 'hsn' instead of 'type'
                                    value={formData.hsn}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPrice" className="mt-3">
                            <Form.Label>ex_mundra</Form.Label>
                            <Form.Control
                                type="number"
                                name="ex_mundra"
                                value={formData.ex_mundra}
                                onChange={handleFormChange}
                                required
                                min="0"
                            />
                        </Form.Group>

                        
                        <Form.Group controlId="formPrice" className="mt-3">
                            <Form.Label>ex_nhavasheva</Form.Label>
                            <Form.Control
                                type="number"
                                name="ex_nhavasheva"
                                value={formData.ex_nhavasheva}
                                onChange={handleFormChange}
                                required
                                min="0"
                            />
                        </Form.Group>

                        
                        <Form.Group controlId="formPrice" className="mt-3">
                            <Form.Label>ex_chennai</Form.Label>
                            <Form.Control
                                type="number"
                                name="ex_chennai"
                                value={formData.ex_chennai}
                                onChange={handleFormChange}
                                required
                                min="0"
                            />
                        </Form.Group>

                        
                        <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>



        </div>
   
        </div></>
    );
};

export default AdminPage;
