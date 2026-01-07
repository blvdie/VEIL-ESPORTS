document.addEventListener('DOMContentLoaded', function () {

    const overlay = document.getElementById('overlay');
    const cartPanel = document.getElementById('cart-panel');
    const accountPanel = document.getElementById('account-panel');
    const topBar = document.getElementById('top-bar');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const pages = document.querySelectorAll('.page');
    const copyrightBox = document.querySelector('.copyright-box');

    function navigateTo(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        sidebarItems.forEach(item => item.classList.remove('active'));

        let targetPage;
        if (pageId === 'product' && document.getElementById('product-section')) {
            targetPage = document.getElementById('product-section');
        } else {
            targetPage = document.getElementById(pageId + '-section') || document.getElementById('main-section');
        }

        if (targetPage) {
            targetPage.classList.add('active');
        }

        const activeSidebarItem = document.querySelector(`.sidebar-item[data-page="${pageId}"]`);
        if (activeSidebarItem) {
            activeSidebarItem.classList.add('active');
            updateMarkerPosition(pageId);
        }

        if (copyrightBox) {
            copyrightBox.classList.toggle('on-main', pageId === 'main');
        }
    }

    function updateMarkerPosition(pageId) {
        document.querySelectorAll('.marker').forEach(m => {
            m.style.top = '';
            m.style.opacity = '0';
        });

        const activeItem = document.querySelector(`.sidebar-item[data-page="${pageId}"]`);
        if (!activeItem) return;

        const marker = activeItem.querySelector('.marker');
        if (!marker) return;

        let topInSidebar;
        switch (pageId) {
            case 'main':  topInSidebar = '21px'; break;
            case 'about': topInSidebar = '6px';  break;
            case 'teams': topInSidebar = '104px'; break;
            case 'merch': topInSidebar = '35px'; break;
            case 'admin': topInSidebar = '21px'; break;
            default:      topInSidebar = '21px';
        }
        marker.style.top = topInSidebar;
        marker.style.opacity = '1';
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.dataset.page;
            window.location.hash = page;
        });
    });

    function guardAndNavigate(target) {
        if (target === 'admin' && !document.body.classList.contains('admin')) {
            navigateTo('main');
            return;
        }
        navigateTo(target);
    }

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1) || 'main';
        guardAndNavigate(hash);
    });

    const initialHash = window.location.hash.substring(1) || 'main';
    guardAndNavigate(initialHash);

    document.querySelectorAll('.merch-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = item.dataset.id;
            if (!productId) return;

            sessionStorage.setItem('selectedProductId', productId);
            navigateTo('product');
            
            setTimeout(() => loadProduct(productId), 50);
        });
    });

    async function loadProduct(productId) {
        try {
            const res = await fetch(`/get_product.php?id=${productId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const product = await res.json();
            if (!product || product.error) throw new Error(product.error || 'Товар не найден');

            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = `${product.price}₽`;
            document.getElementById('product-desc').textContent = product.description || 'Описание отсутствует';
            const img = document.getElementById('product-img');
            img.src = product.photo || 'pic/placeholder.png';
            img.onerror = () => img.src = 'pic/placeholder.png';

            const sizesContainer = document.getElementById('sizes-container');
            sizesContainer.innerHTML = '';

            const sizes = (product.sizes || '').split(',').map(s => s.trim()).filter(Boolean);
            const addBtn = document.getElementById('btn-add-to-cart');
            addBtn.textContent = 'Выберите размер';
            addBtn.classList.remove('active', 'guest-prompt');
            addBtn.dataset.productId = productId;
            addBtn.dataset.size = '';

            if (sizes.length === 1 && sizes[0].toUpperCase() === 'ONE SIZE') {
                const btn = document.createElement('button');
                btn.className = 'one-size-btn';
                btn.textContent = 'ONE SIZE';
                btn.dataset.size = 'ONE SIZE';
                btn.addEventListener('click', () => selectSize(btn, addBtn));
                sizesContainer.appendChild(btn);
            } else {
                sizes.forEach(size => {
                    const btn = document.createElement('button');
                    btn.className = 'size-btn';
                    btn.textContent = size;
                    btn.dataset.size = size;
                    btn.addEventListener('click', () => selectSize(btn, addBtn));
                    sizesContainer.appendChild(btn);
                });
            }

        } catch (err) {
            console.error('Ошибка загрузки товара:', err);
            navigateTo('merch');
        }
    }

    function selectSize(btn, addBtn) {
        document.querySelectorAll('.size-btn, .one-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        addBtn.textContent = 'В корзину';
        addBtn.classList.add('active');
        addBtn.dataset.size = btn.dataset.size;
    }

    document.getElementById('btn-back-to-merch')?.addEventListener('click', () => {
        navigateTo('merch');
    });

    document.querySelector('.btn-details')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'merch';
        navigateTo('merch');
    });

    document.getElementById('btn-cart')?.addEventListener('click', () => {
        cartPanel?.classList.add('open');
        overlay?.classList.add('active');
        loadCart();
    });

    document.getElementById('close-cart')?.addEventListener('click', () => {
        cartPanel?.classList.remove('open');
        overlay?.classList.remove('active');
    });

    document.getElementById('btn-account')?.addEventListener('click', () => {
        accountPanel?.classList.add('open');
        overlay?.classList.add('active');
        topBar?.style.setProperty('visibility', 'hidden');
    });

    document.getElementById('close-account')?.addEventListener('click', () => {
        accountPanel?.classList.remove('open');
        overlay?.classList.remove('active');
        topBar?.style.setProperty('visibility', 'visible');
    });

    document.getElementById('switch-to-register')?.addEventListener('click', () => {
        document.getElementById('login-form')?.classList.remove('active-form');
        document.getElementById('register-form')?.classList.add('active-form');
        document.getElementById('auth-logo')?.classList.remove('login-logo');
        document.getElementById('auth-logo')?.classList.add('register-logo');
    });

    document.getElementById('switch-to-login')?.addEventListener('click', () => {
        document.getElementById('register-form')?.classList.remove('active-form');
        document.getElementById('login-form')?.classList.add('active-form');
        document.getElementById('auth-logo')?.classList.remove('register-logo');
        document.getElementById('auth-logo')?.classList.add('login-logo');
    });

    document.getElementById('btn-add-to-cart')?.addEventListener('click', async (e) => {
        const btn = e.target;
        if (!btn.classList.contains('active')) return;

        const productId = btn.dataset.productId;
        const size = btn.dataset.size;

        const isLoggedIn = document.querySelector('#welcome-block') !== null;

        if (!isLoggedIn) {
            btn.textContent = 'Войдите или зарегистрируйтесь';
            btn.classList.add('guest-prompt');

            const handler = () => {
                document.getElementById('btn-account').click();
                btn.textContent = 'В корзину';
                btn.classList.remove('guest-prompt');
                btn.removeEventListener('click', handler);
            };
            btn.addEventListener('click', handler);
            return;
        }

        try {
            const res = await fetch('/add_to_cart.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, size: size })
            });
            const data = await res.json();
            if (data.success) {
                document.getElementById('btn-cart').click();
            } else {
                alert(data.error || 'Ошибка добавления');
            }
        } catch (err) {
            console.error('Ошибка сети при добавлении в корзину');
        }
    });

    async function loadCart() {
        try {
            const res = await fetch('/get_cart.php');
            const data = await res.json();

            const itemsContainer = document.getElementById('cart-items-container');
            const emptyMsg = document.getElementById('cart-empty-msg');

            if (!itemsContainer || !emptyMsg) return;

            itemsContainer.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                emptyMsg.style.display = 'block';
                return;
            }

            emptyMsg.style.display = 'none';

            data.items.forEach((item, i) => {
                const topOffset = i * (145 + 32);

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.style.position = 'absolute';
                cartItem.style.top = topOffset + 'px';
                cartItem.style.left = '0';
                cartItem.dataset.cartId = item.cart_id;

                const price = parseFloat(item.price) || 0;
                cartItem.innerHTML = `
                    <img src="${item.photo || 'pic/placeholder.png'}" 
                         alt="${item.name}" 
                         class="cart-img"
                         onerror="this.src='pic/placeholder.png'">
                    <div class="cart-name">${item.name}</div>
                    <div class="cart-size">${item.size || '—'}</div>
                    <div class="cart-price">${price.toLocaleString('ru-RU')}₽</div>
                    
                    <div class="cart-qty-controls">
                        <button class="cart-qty-btn minus">−</button>
                        <div class="cart-qty-val">${item.quantity}</div>
                        <button class="cart-qty-btn plus">+</button>
                    </div>

                    <button class="cart-remove-btn">
                        <span class="cart-remove-icon"></span>
                    </button>
                `;

                itemsContainer.appendChild(cartItem);

                cartItem.querySelector('.minus')?.addEventListener('click', () => updateQuantity(item.cart_id, -1));
                cartItem.querySelector('.plus')?.addEventListener('click', () => updateQuantity(item.cart_id, +1));
                cartItem.querySelector('.cart-remove-btn')?.addEventListener('click', () => removeItem(item.cart_id));
            });

        } catch (err) {
            console.error('Ошибка корзины:', err);
            document.getElementById('cart-empty-msg').textContent = 'Ошибка загрузки';
            document.getElementById('cart-empty-msg').style.display = 'block';
        }
    }

    async function updateQuantity(cartId, delta) {
        const itemEl = document.querySelector(`.cart-item[data-cart-id="${cartId}"]`);
        const qtyEl = itemEl?.querySelector('.cart-qty-val');
        if (!qtyEl) return;

        let qty = parseInt(qtyEl.textContent) || 1;
        qty = Math.max(1, Math.min(5, qty + delta));
        
        try {
            const res = await fetch('/update_cart.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: cartId, quantity: qty })
            });
            const data = await res.json();
            if (data.success) {
                qtyEl.textContent = qty;
            }
        } catch (e) {
            console.error('Ошибка сети при изменении количества');
        }
    }

    async function removeItem(cartId) {
        try {
            const res = await fetch('/remove_from_cart.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: cartId })
            });
            const data = await res.json();
            if (data.success) {
                document.querySelector(`.cart-item[data-cart-id="${cartId}"]`)?.remove();
                loadCart();
            }
        } catch (e) {
            console.error('Ошибка сети при удалении из корзины');
        }
    }

    document.getElementById('close-cart')?.addEventListener('click', () => {
        cartPanel?.classList.remove('open');
        overlay?.classList.remove('active');
    });

});