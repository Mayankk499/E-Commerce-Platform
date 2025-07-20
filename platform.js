 // Sample product data
        const products = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 89.99,
                category: "electronics",
                description: "High-quality wireless headphones with noise cancellation",
                image: "🎧"
            },
            {
                id: 2,
                name: "Smart Watch",
                price: 199.99,
                category: "electronics",
                description: "Feature-rich smartwatch with health monitoring",
                image: "⌚"
            },
            {
                id: 3,
                name: "Cotton T-Shirt",
                price: 24.99,
                category: "clothing",
                description: "Comfortable 100% cotton t-shirt in various colors",
                image: "👕"
            },
            {
                id: 4,
                name: "Programming Book",
                price: 34.99,
                category: "books",
                description: "Learn modern web development with this comprehensive guide",
                image: "📚"
            },
            {
                id: 5,
                name: "Coffee Maker",
                price: 79.99,
                category: "home",
                description: "Automatic coffee maker with programmable timer",
                image: "☕"
            },
            {
                id: 6,
                name: "Laptop",
                price: 899.99,
                category: "electronics",
                description: "High-performance laptop for work and gaming",
                image: "💻"
            },
            {
                id: 7,
                name: "Jeans",
                price: 59.99,
                category: "clothing",
                description: "Classic fit denim jeans in multiple sizes",
                image: "👖"
            },
            {
                id: 8,
                name: "Plant Pot",
                price: 19.99,
                category: "home",
                description: "Beautiful ceramic pot perfect for indoor plants",
                image: "🪴"
            }
        ];

        // Cart functionality
        let cart = [];
        let currentUser = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadProducts();
            updateCartCount();
        });

        // Load products into the grid
        function loadProducts(productsToShow = products) {
            const grid = document.getElementById('productGrid');
            grid.innerHTML = '';

            productsToShow.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">${product.image}</div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-price">$${product.price}</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                            <button class="btn btn-secondary" onclick="viewProduct(${product.id})">View Details</button>
                        </div>
                    </div>
                `;
                grid.appendChild(productCard);
            });
        }

        // Filter products
        function filterProducts(category) {
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Filter products
            const filteredProducts = category === 'all' 
                ? products 
                : products.filter(product => product.category === category);
            
            loadProducts(filteredProducts);
        }

        // Search products
        function searchProducts() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            loadProducts(filteredProducts);
        }

        // Add to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCartCount();
            updateCartDisplay();
            
            // Show success message
            showNotification(`${product.name} added to cart!`);
        }

        // Update cart count
        function updateCartCount() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
        }

        // Update cart display
        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');

            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
                cartTotal.textContent = '0.00';
                return;
            }

            cartItems.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        ${item.image}
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span style="margin: 0 0.5rem;">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="btn btn-secondary" onclick="removeFromCart(${item.id})" style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;">Remove</button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });

            cartTotal.textContent = total.toFixed(2);
        }

        // Update quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;

            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }

            updateCartCount();
            updateCartDisplay();
        }

        // Remove from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartCount();
            updateCartDisplay();
        }

        // Toggle cart
        function toggleCart() {
            const cartElement = document.getElementById('cart');
            const overlay = document.getElementById('overlay');
            
            cartElement.style.display = 'block';
            cartElement.classList.toggle('open');
            overlay.classList.toggle('show');
            
            updateCartDisplay();
        }

        // Close cart
        function closeCart() {
            const cartElement = document.getElementById('cart');
            const overlay = document.getElementById('overlay');
            
            cartElement.classList.remove('open');
            overlay.classList.remove('show');
            
            setTimeout(() => {
                if (!cartElement.classList.contains('open')) {
                    cartElement.style.display = 'none';
                }
            }, 300);
        }

        // Checkout
        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            if (!currentUser) {
                alert('Please login to checkout');
                openModal('login');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
            cart = [];
            updateCartCount();
            updateCartDisplay();
            closeCart();
        }

        // Modal functions
        function openModal(type) {
            document.getElementById(`${type}Modal`).style.display = 'block';
        }

        function closeModal(type) {
            document.getElementById(`${type}Modal`).style.display = 'none';
        }

        // Authentication
        function login() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Simulate login
            currentUser = { email: email, name: email.split('@')[0] };
            
            // Update UI
            document.querySelector('.nav-actions .btn-secondary').textContent = `Hello, ${currentUser.name}`;
            document.querySelector('.nav-actions .btn-secondary').onclick = logout;
            
            closeModal('login');
            showNotification('Login successful!');
        }

        function register() {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Simulate registration
            currentUser = { email: email, name: name };
            
            // Update UI
            document.querySelector('.nav-actions .btn-secondary').textContent = `Hello, ${currentUser.name}`;
            document.querySelector('.nav-actions .btn-secondary').onclick = logout;
            
            closeModal('register');
            showNotification('Account created successfully!');
        }

        function logout() {
            currentUser = null;
            document.querySelector('.nav-actions .btn-secondary').textContent = 'Login';
            document.querySelector('.nav-actions .btn-secondary').onclick = () => openModal('login');
            showNotification('Logged out successfully!');
        }

        // Navigation
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('hidden');
            });

            // Show selected section
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        }

        // View product details
        function viewProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            alert(`Product: ${product.name}\nPrice: $${product.price}\nDescription: ${product.description}\n\nCategory: ${product.category}`);
        }

        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #667eea;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 3000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Close modals when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Search on Enter key
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });

        // Initialize with home section visible
        showSection('home');