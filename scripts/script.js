document.addEventListener('DOMContentLoaded', function () {

    const overlay = document.getElementById('overlay');
    const cartPanel = document.getElementById('cart-panel');
    const accountPanel = document.getElementById('account-panel');
    const topBar = document.getElementById('top-bar');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const pages = document.querySelectorAll('.page');
    const copyrightBox = document.querySelector('.copyright-box');
    const cartOrderContainer = document.getElementById('cart-order-container');
    const cartOrderButton = document.getElementById('cart-order-button');
    const orderPanel = document.getElementById('order-panel');
    const orderForm = document.getElementById('order-form');
    const orderError = document.getElementById('order-error');
    const orderSubmitBtn = document.getElementById('order-submit');
    const orderCloseBtn = document.getElementById('order-close');
    const orderSuccessPanel = document.getElementById('order-success-panel');
    const orderSuccessButton = document.getElementById('order-success-button');
    const orderFullName = document.getElementById('order-full-name');
    const orderPhone = document.getElementById('order-phone');
    const orderCountry = document.getElementById('order-country');
    const orderCity = document.getElementById('order-city');
    const orderAddress = document.getElementById('order-address');

    const cityDictionary = {
        ru: ['Москва', 'Санкт-Петербург', 'Казань'],
        by: ['Минск', 'Гомель', 'Брест'],
        kz: ['Астана', 'Алматы', 'Шымкент'],
    };
    const countryTitles = {
        ru: 'Россия',
        by: 'Беларусь',
        kz: 'Казахстан',
    };

    const isUserLoggedIn = () => document.querySelector('#welcome-block') !== null;

    function navigateTo(pageId, options = {}) {
        const targetPageId = options.overridePageId || pageId;
        const highlightPageId = options.sidebarPage || pageId;
        pages.forEach(page => page.classList.remove('active'));
        sidebarItems.forEach(item => item.classList.remove('active'));

        let targetPage;
        if (targetPageId === 'product' && document.getElementById('product-section')) {
            targetPage = document.getElementById('product-section');
        } else {
            targetPage = document.getElementById(targetPageId + '-section') || document.getElementById('main-section');
        }

        if (targetPage) {
            targetPage.classList.add('active');
        }

        const activeSidebarItem = document.querySelector(`.sidebar-item[data-page="${highlightPageId}"]`);
        if (activeSidebarItem) {
            activeSidebarItem.classList.add('active');
            updateMarkerPosition(highlightPageId);
        }

        if (copyrightBox) {
            copyrightBox.classList.toggle('on-main', highlightPageId === 'main');
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

    function populateCities(countryValue, selectedCity = '') {
        if (!orderCity) return;
        const cities = cityDictionary[countryValue] || [];
        orderCity.innerHTML = '<option value="">Выберите город</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            orderCity.appendChild(option);
        });
        if (selectedCity && cities.includes(selectedCity)) {
            orderCity.value = selectedCity;
        } else {
            orderCity.value = '';
        }
        orderCity.classList.remove('error');
    }

    function clearOrderFieldErrors() {
        if (!orderForm) return;
        orderForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    function resetOrderForm() {
        if (!orderForm) return;
        orderForm.reset();
        clearOrderFieldErrors();
        if (orderError) orderError.textContent = '';
        if (orderSubmitBtn) {
            orderSubmitBtn.disabled = false;
            orderSubmitBtn.textContent = 'Заказать';
        }
        populateCities(orderCountry?.value || 'ru');
    }

    function openOrderPanel() {
        if (!orderPanel) return;
        resetOrderForm();
        cartPanel?.classList.remove('open');
        orderPanel.classList.add('open');
        overlay?.classList.add('active');
    }

    function closeOrderPanel({ reopenCart = true } = {}) {
        if (!orderPanel) return;
        orderPanel.classList.remove('open');
        if (reopenCart) {
            cartPanel?.classList.add('open');
            overlay?.classList.add('active');
        }
    }

    function showOrderSuccessPanel() {
        if (!orderSuccessPanel) return;
        orderSuccessPanel.classList.add('open');
        overlay?.classList.add('active');
    }

    function hideOrderSuccessPanel() {
        if (!orderSuccessPanel) return;
        orderSuccessPanel.classList.remove('open');
        overlay?.classList.remove('active');
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.dataset.page;
            window.location.hash = page;
        });
    });

    orderCountry?.addEventListener('change', (e) => populateCities(e.target.value));

    orderCloseBtn?.addEventListener('click', () => closeOrderPanel());

    cartOrderButton?.addEventListener('click', () => {
        if (!isUserLoggedIn()) {
            cartPanel?.classList.remove('open');
            overlay?.classList.remove('active');
            document.getElementById('btn-account')?.click();
            return;
        }
        openOrderPanel();
    });

    [orderFullName, orderPhone, orderAddress].forEach(field => {
        field?.addEventListener('input', () => field.classList.remove('error'));
    });

    orderCity?.addEventListener('change', () => orderCity.classList.remove('error'));

    orderSuccessButton?.addEventListener('click', () => {
        hideOrderSuccessPanel();
        navigateTo('main');
    });

    orderForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!orderForm) return;

        if (!isUserLoggedIn()) {
            closeOrderPanel({ reopenCart: false });
            overlay?.classList.remove('active');
            document.getElementById('btn-account')?.click();
            return;
        }

        clearOrderFieldErrors();
        if (orderError) orderError.textContent = '';

        const fullName = (orderFullName?.value || '').trim();
        const rawPhone = (orderPhone?.value || '').trim();
        const phoneDigits = rawPhone.replace(/\D/g, '');
        const phoneToSend = rawPhone.startsWith('+') ? `+${phoneDigits}` : phoneDigits;
        const countryCode = orderCountry?.value || 'ru';
        const countryTitle = countryTitles[countryCode] || countryCode;
        const city = (orderCity?.value || '').trim();
        const address = (orderAddress?.value || '').trim();

        const errors = [];

        if (!fullName) {
            errors.push('Укажите полное имя.');
            orderFullName?.classList.add('error');
        }

        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
            errors.push('Введите корректный номер телефона.');
            orderPhone?.classList.add('error');
        }

        if (!city) {
            errors.push('Выберите город.');
            orderCity?.classList.add('error');
        }

        if (!address) {
            errors.push('Укажите адрес.');
            orderAddress?.classList.add('error');
        }

        if (errors.length) {
            if (orderError) {
                orderError.textContent = errors.join(' ');
            }
            return;
        }

        if (orderSubmitBtn) {
            orderSubmitBtn.disabled = true;
            orderSubmitBtn.textContent = 'Отправка…';
        }

        try {
            const res = await fetch('/create_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    phone: phoneToSend,
                    country: countryTitle,
                    city,
                    address,
                })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Не удалось оформить заказ');
            }

            loadCart();
            closeOrderPanel({ reopenCart: false });
            showOrderSuccessPanel();

        } catch (err) {
            if (orderError) {
                orderError.textContent = err.message || 'Произошла ошибка оформления заказа';
            }
        } finally {
            if (orderSubmitBtn) {
                orderSubmitBtn.disabled = false;
                orderSubmitBtn.textContent = 'Заказать';
            }
        }
    });

    function handleHashChange() {
        const hash = window.location.hash.substring(1);

        if (!hash) {
            navigateTo('main');
            return;
        }

        if (hash.startsWith('teams/')) {
            const [, slug] = hash.split('/');
            if (slug) {
                showRosterBySlug(slug, { updateHash: false }).catch(() => {
                    navigateTo('teams');
                });
            } else {
                navigateTo('teams');
            }
            return;
        }

        navigateTo(hash);
    }

    window.addEventListener('hashchange', handleHashChange);

    const disciplinesList = document.getElementById('disciplines-list');
    const rosterTitle = document.getElementById('roster-discipline-name');
    const rosterList = document.getElementById('roster-list');
    const rosterEmpty = document.getElementById('roster-empty');
    const rosterBackBtn = document.getElementById('btn-back-to-teams');

    let disciplinesData = [];
    let disciplinesLoaded = false;
    const disciplinesMap = new Map();

    async function fetchDisciplines() {
        if (!disciplinesList) return false;
        disciplinesList.innerHTML = '<div class="teams-placeholder">Загрузка дисциплин…</div>';

        try {
            const res = await fetch('/get_disciplines.php');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!data.success || !Array.isArray(data.disciplines)) {
                throw new Error('Некорректный ответ сервера');
            }

            disciplinesData = data.disciplines;
            disciplinesMap.clear();
            disciplinesData.forEach(d => disciplinesMap.set(d.slug, d));
            disciplinesLoaded = true;
            renderDisciplines();
            return true;
        } catch (err) {
            console.error('Ошибка загрузки дисциплин:', err);
            disciplinesLoaded = false;
            if (disciplinesList) {
                disciplinesList.innerHTML = '<div class="teams-placeholder error">Не удалось загрузить дисциплины</div>';
            }
            return false;
        }
    }

    function renderDisciplines() {
        if (!disciplinesList) return;
        disciplinesList.innerHTML = '';

        if (!disciplinesData.length) {
            disciplinesList.innerHTML = '<div class="teams-placeholder">Дисциплины не найдены</div>';
            return;
        }

        disciplinesData.forEach(discipline => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'team-item';
            item.dataset.slug = discipline.slug;
            item.textContent = (discipline.name || '').toUpperCase();
            item.addEventListener('click', () => {
                window.location.hash = `teams/${discipline.slug}`;
            });
            disciplinesList.appendChild(item);
        });
    }

    async function ensureDisciplinesLoaded() {
        if (!disciplinesLoaded) {
            await fetchDisciplines();
        }
    }

    async function showRosterBySlug(slug, { updateHash = true } = {}) {
        if (!slug) return;

        if (updateHash) {
            window.location.hash = `teams/${slug}`;
            return;
        }

        if (rosterList) {
            rosterList.innerHTML = '';
        }
        if (rosterEmpty) {
            rosterEmpty.textContent = 'Загрузка состава…';
            rosterEmpty.style.display = 'block';
        }

        await ensureDisciplinesLoaded();

        try {
            const res = await fetch(`/get_roster.php?slug=${encodeURIComponent(slug)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Не удалось загрузить состав');

            const discipline = data.discipline || disciplinesMap.get(slug) || { name: slug };
            if (rosterTitle) {
                rosterTitle.textContent = (discipline.name || slug).toUpperCase();
            }

            renderRoster(data.players || []);

            navigateTo('teams', { overridePageId: 'roster', sidebarPage: 'teams' });
        } catch (err) {
            console.error('Ошибка загрузки состава:', err);
            if (rosterTitle) {
                rosterTitle.textContent = 'ОШИБКА';
            }
            if (rosterEmpty) {
                rosterEmpty.textContent = err.message || 'Не удалось загрузить состав';
                rosterEmpty.style.display = 'block';
            }
            navigateTo('teams', { overridePageId: 'roster', sidebarPage: 'teams' });
            throw err;
        }
    }

    function renderRoster(players) {
        if (!rosterList || !rosterEmpty) return;

        rosterList.innerHTML = '';

        if (!players.length) {
            rosterEmpty.textContent = 'Состав пока не опубликован';
            rosterEmpty.style.display = 'block';
            return;
        }

        rosterEmpty.style.display = 'none';

        players.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';

            const nickname = document.createElement('div');
            nickname.className = 'player-nickname';
            nickname.textContent = (player.nickname || '').toUpperCase();
            card.appendChild(nickname);

            const fullNameText = [player.last_name, player.first_name].filter(Boolean).join(' ').trim();
            if (fullNameText) {
                const fullName = document.createElement('div');
                fullName.className = 'player-fullname';
                fullName.textContent = fullNameText.toUpperCase();
                card.appendChild(fullName);
            }

            rosterList.appendChild(card);
        });
    }

    rosterBackBtn?.addEventListener('click', () => {
        window.location.hash = 'teams';
    });

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

            if (sizes.length === 1) {
                const value = sizes[0].toUpperCase();
                if (value === 'ONE SIZE' || value === 'ONE COLOR') {
                    const btn = document.createElement('button');
                    btn.className = value === 'ONE COLOR' ? 'one-color-btn' : 'one-size-btn';
                    btn.textContent = value; 
                    btn.dataset.size = sizes[0]; 
                    btn.addEventListener('click', () => selectSize(btn, addBtn));
                    sizesContainer.appendChild(btn);
                    return; 
                }
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
                        alert('Не удалось загрузить товар');
                        navigateTo('merch');
                    }
                }

    function selectSize(btn, addBtn) {
        document.querySelectorAll('.size-btn, .one-size-btn, .one-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        addBtn.textContent = 'В корзину';
        addBtn.classList.add('active');
        addBtn.dataset.size = btn.dataset.size;
    }

    document.getElementById('btn-back-to-merch')?.addEventListener('click', () => {
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
            alert('Ошибка сети');
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
            cartOrderContainer?.classList.remove('visible');
            if (cartOrderButton) cartOrderButton.disabled = true;

            if (!data.items || data.items.length === 0) {
                emptyMsg.textContent = 'Ваша корзина пуста';
                emptyMsg.style.display = 'block';
                return;
            }

            emptyMsg.style.display = 'none';
            cartOrderContainer?.classList.add('visible');
            if (cartOrderButton) cartOrderButton.disabled = false;

            data.items.forEach((item) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.cartId = item.cart_id;

                const img = document.createElement('img');
                img.className = 'cart-img';
                img.src = item.photo || 'pic/placeholder.png';
                img.alt = item.name;
                img.onerror = () => { img.src = 'pic/placeholder.png'; };

                const info = document.createElement('div');
                info.className = 'cart-info';

                const infoTop = document.createElement('div');
                infoTop.className = 'cart-info-top';

                const nameEl = document.createElement('div');
                nameEl.className = 'cart-name';
                nameEl.textContent = item.name || 'Без названия';
                nameEl.title = item.name || '';

                const meta = document.createElement('div');
                meta.className = 'cart-meta';

                const sizeEl = document.createElement('span');
                sizeEl.className = 'cart-size';
                sizeEl.textContent = `Размер: ${item.size || '—'}`;

                const priceEl = document.createElement('span');
                priceEl.className = 'cart-price';
                const price = parseFloat(item.price) || 0;
                priceEl.textContent = `${price.toLocaleString('ru-RU')}₽`;

                meta.appendChild(sizeEl);
                meta.appendChild(priceEl);

                infoTop.appendChild(nameEl);
                infoTop.appendChild(meta);

                const actions = document.createElement('div');
                actions.className = 'cart-actions';

                const qtyControls = document.createElement('div');
                qtyControls.className = 'cart-qty-controls';

                const btnMinus = document.createElement('button');
                btnMinus.type = 'button';
                btnMinus.className = 'cart-qty-btn minus';
                btnMinus.textContent = '−';
                btnMinus.setAttribute('aria-label', 'Уменьшить количество');

                const qtyVal = document.createElement('div');
                qtyVal.className = 'cart-qty-val';
                qtyVal.textContent = item.quantity;

                const btnPlus = document.createElement('button');
                btnPlus.type = 'button';
                btnPlus.className = 'cart-qty-btn plus';
                btnPlus.textContent = '+';
                btnPlus.setAttribute('aria-label', 'Увеличить количество');

                qtyControls.appendChild(btnMinus);
                qtyControls.appendChild(qtyVal);
                qtyControls.appendChild(btnPlus);

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'cart-remove-btn';
                removeBtn.setAttribute('aria-label', 'Удалить из корзины');

                const removeIcon = document.createElement('span');
                removeIcon.className = 'cart-remove-icon';
                removeBtn.appendChild(removeIcon);

                actions.appendChild(qtyControls);
                actions.appendChild(removeBtn);

                info.appendChild(infoTop);
                info.appendChild(actions);

                cartItem.appendChild(img);
                cartItem.appendChild(info);

                itemsContainer.appendChild(cartItem);

                btnMinus.addEventListener('click', () => updateQuantity(item.cart_id, -1));
                btnPlus.addEventListener('click', () => updateQuantity(item.cart_id, +1));
                removeBtn.addEventListener('click', () => removeItem(item.cart_id));
            });

        } catch (err) {
            console.error('Ошибка корзины:', err);
            document.getElementById('cart-empty-msg').textContent = 'Ошибка загрузки';
            document.getElementById('cart-empty-msg').style.display = 'block';
            cartOrderContainer?.classList.remove('visible');
            if (cartOrderButton) cartOrderButton.disabled = true;
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
            alert('Ошибка сети');
        }
    }

    async function removeItem(cartId) {
        if (!confirm('Удалить товар из корзины?')) return;

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
            alert('Ошибка сети');
        }
    }

    document.getElementById('close-cart')?.addEventListener('click', () => {
        cartPanel?.classList.remove('open');
        overlay?.classList.remove('active');
    });

    if (orderCountry) {
        populateCities(orderCountry.value || 'ru');
    }

    fetchDisciplines().finally(() => {
        handleHashChange();
    });

});