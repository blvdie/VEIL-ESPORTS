document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(`tab-${tab.dataset.tab}`);
            if (target) {
                target.classList.add('active');
                if (tab.dataset.tab === 'activity') {
                    loadActivity();
                } else if (tab.dataset.tab === 'products') {
                    loadProducts();
                }
            }
        });
    });

    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', async () => {
            const userId = select.dataset.userId;
            const newRole = select.value;

            try {
                const res = await fetch('/admin/update_role.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, role: newRole })
                });
                const data = await res.json();
                if (!data.success) {
                    alert(data.error || 'Ошибка');
                    select.value = select.value === 'admin' ? 'user' : 'admin';
                }
            } catch (e) {
                alert('Ошибка сети');
                select.value = select.value === 'admin' ? 'user' : 'admin';
            }
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Удалить пользователя? Это нельзя отменить.')) return;
            const userId = btn.dataset.userId;
            try {
                const res = await fetch('/admin/delete_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId })
                });
                const data = await res.json();
                if (data.success) {
                    const row = btn.closest('tr');
                    if (row) row.remove();
                } else {
                    alert(data.error || 'Ошибка');
                }
            } catch (e) {
                alert('Ошибка сети');
            }
        });
    });

    const sortDropdown = document.querySelector('#tab-activity .sort-dropdown');
    const sortOptions = document.querySelector('#tab-activity .sort-options');

    if (sortDropdown && sortOptions) {
        sortDropdown.addEventListener('click', () => {
            sortOptions.style.display = sortOptions.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!sortDropdown.contains(e.target) && !sortOptions.contains(e.target)) {
                sortOptions.style.display = 'none';
            }
        });

        sortOptions.addEventListener('click', async (e) => {
            e.preventDefault();
            if (e.target.tagName !== 'A') return;
            sortOptions.style.display = 'none';
            const col = e.target.dataset.sort;
            loadActivity(col);
        });
    }

    async function loadActivity(col = 'created_at') {
        const activityBody = document.getElementById('activity-body');
        if (!activityBody) return;

        try {
            const res = await fetch(`/admin/sort_activity.php?col=${col}&order=desc`);
            const result = await res.json();

            if (!result.success || !Array.isArray(result.data)) {
                throw new Error('Некорректный формат данных');
            }

            activityBody.innerHTML = '';
            result.data.forEach((log) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${log.id}</td>
                    <td>${log.user_id}</td>
                    <td>${log.action}</td>
                    <td>${log.details ? (log.details.length > 50 ? log.details.substring(0, 50) + '…' : log.details) : ''}</td>
                    <td>${log.created_at}</td>
                `;
                activityBody.appendChild(tr);
            });

        } catch (err) {
            console.error('Ошибка активности:', err);
            activityBody.innerHTML = `<tr><td colspan="5" style="color:#f00">❌ ${err.message}</td></tr>`;
        }
    }

    let productsData = [];

    async function loadProducts() {
        const container = document.getElementById('products-body');
        if (!container) return;

        try {
            const res = await fetch('/admin/get_products.php');
            const data = await res.json();

            if (!data.success) throw new Error(data.error || 'no success');

            productsData = data.products;
            renderProducts();

        } catch (err) {
            console.error('Товары ошибка:', err);
            container.innerHTML = `<div style="color:#f00">❌ ${err.message}</div>`;
        }
    }

    function renderProducts() {
        const container = document.getElementById('products-body');
        container.innerHTML = '';

        productsData.forEach((prod) => {
            const tr = document.createElement('tr');
            tr.dataset.productId = prod.id;

            tr.innerHTML = `
                <td class="col-id">${prod.id}</td>
                <td class="col-name">${prod.name}</td>
                <td class="col-photo">${prod.photo || ''}</td>
                <td class="col-sizes">${prod.sizes || ''}</td>
                <td class="col-desc">${prod.description || ''}</td>
                <td class="col-actions">
                    <button class="btn-edit">Редактировать</button>
                    <button class="btn-delete">Удалить</button>
                </td>
            `;

            container.appendChild(tr);

            tr.querySelector('.btn-edit').addEventListener('click', () => editProduct(tr, prod));
            tr.querySelector('.btn-delete').addEventListener('click', () => deleteProduct(prod.id));
        });
    }

    function editProduct(row, product) {
        const editBtn = row.querySelector('.btn-edit');
        const isEditing = editBtn.classList.contains('confirm');
    
        if (!isEditing) {
            editBtn.classList.add('confirm');
            editBtn.textContent = 'Подтвердить';
    
            ['name', 'photo', 'sizes', 'description'].forEach(field => {
                const cell = field === 'description' ? row.querySelector('.col-desc') : row.querySelector(`.col-${field}`);
                const value = cell.textContent;
                if (field === 'description') {
                    cell.innerHTML = `<textarea class="edit-input" data-field="description" style="width:100%; height:50px; padding:4px; resize:vertical; font-family:inherit; font-size:14px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;">${value}</textarea>`;
                } else {
                    cell.innerHTML = `<input type="text" class="edit-input" data-field="${field}" value="${value}" style="width:100%; padding:2px; font-family:inherit; font-size:16px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;">`;
                }
            });
    
        } else {
            const updates = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                updates[input.dataset.field] = input.value.trim();
            });
    
            fetch('/admin/update_product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, ...updates })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    Object.assign(product, updates);
                    renderProducts();
                } else {
                    alert(data.error || 'Ошибка сохранения');
                }
            })
            .catch(() => alert('Ошибка сети'));
        }
    }

    function deleteProduct(id) {
        fetch('/admin/delete_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                productsData = productsData.filter(p => p.id != id);
                renderProducts();
            }
        });
    }

    document.getElementById('btn-add-product')?.addEventListener('click', () => {
        const container = document.getElementById('products-body');
        if (!container) return;

        if (container.querySelector('tr.new-product')) return;

        const row = document.createElement('tr');
        row.className = 'new-product';
        row.innerHTML = `
            <td class="col-id">—</td>
            <td class="col-name"><input type="text" class="edit-input" data-field="name" placeholder="Название" style="width:100%; padding:2px; font-family:inherit; font-size:16px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;"></td>
            <td class="col-photo"><input type="text" class="edit-input" data-field="photo" placeholder="pic/..." style="width:100%; padding:2px; font-family:inherit; font-size:16px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;"></td>
            <td class="col-sizes"><input type="text" class="edit-input" data-field="sizes" placeholder="S,M,L..." style="width:100%; padding:2px; font-family:inherit; font-size:16px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;"></td>
            <td class="col-desc"><textarea class="edit-input" data-field="description" placeholder="Описание" style="width:100%; height:50px; padding:4px; resize:vertical; font-family:inherit; font-size:14px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;"></textarea></td>
            <td class="col-actions">
                <button class="btn-edit confirm">Подтвердить</button>
                <button class="btn-delete">Отмена</button>
            </td>
        `;

        container.prepend(row);

        row.querySelector('.btn-delete').addEventListener('click', () => {
            row.remove();
        });

        row.querySelector('.btn-edit').addEventListener('click', async () => {
            const payload = {};
            row.querySelectorAll('.edit-input').forEach(i => payload[i.dataset.field] = i.value.trim());
            if (!payload.name) {
                alert('Укажите название товара');
                return;
            }
            try {
                const res = await fetch('/admin/add_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success && data.product) {
                    productsData.unshift(data.product);
                    renderProducts();
                } else {
                    alert(data.error || 'Ошибка добавления');
                }
            } catch (e) {
                alert('Ошибка сети');
            }
        });
    });

});