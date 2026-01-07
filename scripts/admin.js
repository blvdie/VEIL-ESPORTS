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
                } else if (tab.dataset.tab === 'disciplines') {
                    loadDisciplines();
                } else if (tab.dataset.tab === 'participants') {
                    loadParticipants();
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
            const userId = btn.dataset.userId;
            if (!userId) return;

            btn.disabled = true;

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
                    alert(data.error || 'Ошибка удаления');
                    btn.disabled = false;
                }
            } catch (e) {
                alert('Ошибка сети');
                btn.disabled = false;
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
            result.data.forEach((log, i) => {
                const row = document.createElement('div');
                row.className = 'admin-table-row';
                row.innerHTML = `
                    <span class="col-id">${log.id}</span>
                    <span class="col-user-id">${log.user_id}</span>
                    <span class="col-action">${log.action}</span>
                    <span class="col-details">${
                        log.details ? (log.details.length > 50 ? log.details.substring(0, 50) + '…' : log.details) : ''
                    }</span>
                    <span class="col-created">${log.created_at}</span>
                `;
                activityBody.appendChild(row);

                if (i < result.data.length - 1) {
                    const divider = document.createElement('div');
                    divider.className = 'row-divider';
                    activityBody.appendChild(divider);
                }
            });

        } catch (err) {
            console.error('Ошибка активности:', err);
            activityBody.innerHTML = `<div class="admin-table-row"><span style="color:#f00">❌ ${escapeHTML(err.message)}</span></div>`;
        }
    }

    let productsData = [];
    let disciplinesData = [];
    let participantsData = [];

    const escapeHTML = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const escapeAttr = escapeHTML;

    const sharedInputStyle = 'width:100%; padding:2px; font-family:inherit; font-size:16px; background:#333; color:#fff; border:1px solid #9B79D5; border-radius:4px;';

    const makeInput = (field, placeholder = '', value = '') =>
        `<input type="text" class="edit-input" data-field="${field}" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(value)}" style="${sharedInputStyle}">`;

    let productDraftRow = null;
    let disciplineDraftRow = null;
    let participantDraftRow = null;

    async function loadProducts() {
        const container = document.getElementById('products-body');
        if (!container) return;

        try {
            const res = await fetch('/admin/get_products.php');
            const data = await res.json();

            if (!data.success || !Array.isArray(data.products)) {
                throw new Error(data.error || 'Не удалось получить список товаров');
            }

            productsData = data.products;
            renderProducts();
        } catch (err) {
            console.error('Товары ошибка:', err);
            container.innerHTML = `<div style="color:#f00">❌ ${escapeHTML(err.message)}</div>`;
        }
    }

    function renderProducts() {
        const container = document.getElementById('products-body');
        if (!container) return;

        container.innerHTML = '';
        productDraftRow = null;

        if (!Array.isArray(productsData) || productsData.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'admin-table-row';
            emptyRow.innerHTML = '<span>Товары отсутствуют</span>';
            container.appendChild(emptyRow);
            return;
        }

        productsData.forEach((prod, i) => {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            row.dataset.productId = prod.id;

            row.innerHTML = `
                <span class="col-id">${escapeHTML(prod.id)}</span>
                <span class="col-name">${escapeHTML(prod.name)}</span>
                <span class="col-photo">${escapeHTML(prod.photo || '')}</span>
                <span class="col-sizes">${escapeHTML(prod.sizes || '')}</span>
                <span class="col-desc">${escapeHTML(prod.description || '')}</span>
                <button class="btn-edit" data-role="edit">Редактировать</button>
                <button class="btn-delete" data-role="delete">Удалить</button>
            `;

            container.appendChild(row);

            if (i < productsData.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'product-divider';
                container.appendChild(divider);
            }

            row.querySelector('[data-role="edit"]').addEventListener('click', () => editProduct(row, prod));
            row.querySelector('[data-role="delete"]').addEventListener('click', () => deleteProduct(prod.id));
        });
    }

    function editProduct(row, product) {
        const editBtn = row.querySelector('[data-role="edit"]');
        const deleteBtn = row.querySelector('[data-role="delete"]');
        const isEditing = editBtn.classList.contains('confirm');

        if (!isEditing) {
            editBtn.classList.add('confirm');
            editBtn.textContent = 'Подтвердить';

            ['name', 'photo', 'sizes', 'description'].forEach(field => {
                const span = row.querySelector(`.col-${field}`);
                if (!span) return;
                const currentValue = span.textContent;
                span.innerHTML = makeInput(field, '', currentValue);
            });
        } else {
            const updates = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                updates[input.dataset.field] = input.value.trim();
            });

            editBtn.disabled = true;
            if (deleteBtn) deleteBtn.disabled = true;

            fetch('/admin/update_product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, ...updates })
            })
                .then(r => r.json())
                .then(data => {
                    if (!data.success) {
                        throw new Error(data.error || 'Ошибка сохранения');
                    }
                    Object.assign(product, updates);
                    renderProducts();
                })
                .catch(err => {
                    alert(err.message || 'Ошибка сохранения');
                })
                .finally(() => {
                    editBtn.disabled = false;
                    if (deleteBtn) deleteBtn.disabled = false;
                });
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
                if (!data.success) {
                    throw new Error(data.error || 'Ошибка удаления');
                }
                productsData = productsData.filter(p => Number(p.id) !== Number(id));
                if (productDraftRow) {
                    productDraftRow.remove();
                    productDraftRow = null;
                }
                renderProducts();
            })
            .catch(err => alert(err.message || 'Ошибка сети'));
    }

    function showProductDraft() {
        if (productDraftRow) {
            productDraftRow.querySelector('.edit-input')?.focus();
            return;
        }

        const container = document.getElementById('products-body');
        if (!container) return;

        container.querySelectorAll('.admin-table-row').forEach(existing => {
            if (!existing.dataset.productId) {
                existing.remove();
            }
        });

        const row = document.createElement('div');
        row.className = 'admin-table-row creating';
        row.innerHTML = `
            <span class="col-id">—</span>
            <span class="col-name">${makeInput('name', 'Название товара')}</span>
            <span class="col-photo">${makeInput('photo', 'Путь к фото')}</span>
            <span class="col-sizes">${makeInput('sizes', 'Размеры')}</span>
            <span class="col-desc">${makeInput('description', 'Описание')}</span>
            <button class="btn-edit" data-role="save">Сохранить</button>
            <button class="btn-delete" data-role="cancel">Отмена</button>
        `;

        container.prepend(row);
        productDraftRow = row;

        const saveBtn = row.querySelector('[data-role="save"]');
        const cancelBtn = row.querySelector('[data-role="cancel"]');

        saveBtn.addEventListener('click', async () => {
            const payload = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                payload[input.dataset.field] = input.value.trim();
            });

            if (!payload.name) {
                alert('Укажите название товара');
                return;
            }

            saveBtn.disabled = true;
            cancelBtn.disabled = true;

            try {
                const res = await fetch('/admin/create_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.error || 'Не удалось добавить товар');
                }

                row.remove();
                productDraftRow = null;

                if (data.product) {
                    productsData.push(data.product);
                    productsData.sort((a, b) => Number(a.id) - Number(b.id));
                }
                renderProducts();
            } catch (err) {
                alert(err.message || 'Ошибка сохранения');
                saveBtn.disabled = false;
                cancelBtn.disabled = false;
            }
        });

        cancelBtn.addEventListener('click', () => {
            row.remove();
            productDraftRow = null;
        });
    }

    document.getElementById('btn-add-product')?.addEventListener('click', showProductDraft);

    async function loadDisciplines() {
        const container = document.getElementById('disciplines-body');
        if (!container) return;

        try {
            const res = await fetch('/admin/get_disciplines.php');
            const data = await res.json();

            if (!data.success || !Array.isArray(data.disciplines)) {
                throw new Error(data.error || 'Не удалось получить дисциплины');
            }

            disciplinesData = data.disciplines;
            renderDisciplines();
        } catch (err) {
            console.error('Дисциплины ошибка:', err);
            container.innerHTML = `<div style="color:#f00">❌ ${escapeHTML(err.message)}</div>`;
        }
    }

    function renderDisciplines() {
        const container = document.getElementById('disciplines-body');
        if (!container) return;

        container.innerHTML = '';
        disciplineDraftRow = null;

        if (!Array.isArray(disciplinesData) || disciplinesData.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'admin-table-row';
            emptyRow.innerHTML = '<span>Дисциплины отсутствуют</span>';
            container.appendChild(emptyRow);
            return;
        }

        disciplinesData.forEach((disc, i) => {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            row.dataset.disciplineId = disc.id;

            row.innerHTML = `
                <span class="col-id">${escapeHTML(disc.id)}</span>
                <span class="col-name">${escapeHTML(disc.name)}</span>
                <span class="col-slug">${escapeHTML(disc.slug)}</span>
                <button class="btn-edit" data-role="edit">Редактировать</button>
                <button class="btn-delete" data-role="delete">Удалить</button>
            `;

            container.appendChild(row);

            if (i < disciplinesData.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'product-divider';
                container.appendChild(divider);
            }

            row.querySelector('[data-role="edit"]').addEventListener('click', () => editDiscipline(row, disc));
            row.querySelector('[data-role="delete"]').addEventListener('click', () => deleteDiscipline(disc.id));
        });
    }

    function editDiscipline(row, discipline) {
        const editBtn = row.querySelector('[data-role="edit"]');
        const deleteBtn = row.querySelector('[data-role="delete"]');
        const isEditing = editBtn.classList.contains('confirm');

        if (!isEditing) {
            editBtn.classList.add('confirm');
            editBtn.textContent = 'Подтвердить';

            ['name', 'slug'].forEach(field => {
                const span = row.querySelector(`.col-${field}`);
                if (!span) return;
                const currentValue = span.textContent;
                span.innerHTML = makeInput(field, '', currentValue);
            });
        } else {
            const updates = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                updates[input.dataset.field] = input.value.trim();
            });

            editBtn.disabled = true;
            if (deleteBtn) deleteBtn.disabled = true;

            fetch('/admin/update_discipline.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: discipline.id, ...updates })
            })
                .then(r => r.json())
                .then(data => {
                    if (!data.success) {
                        throw new Error(data.error || 'Ошибка сохранения');
                    }
                    Object.assign(discipline, updates);
                    renderDisciplines();
                })
                .catch(err => {
                    alert(err.message || 'Ошибка сохранения');
                })
                .finally(() => {
                    editBtn.disabled = false;
                    if (deleteBtn) deleteBtn.disabled = false;
                });
        }
    }

    function deleteDiscipline(id) {
        fetch('/admin/delete_discipline.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(data.error || 'Ошибка удаления');
                }
                disciplinesData = disciplinesData.filter(d => Number(d.id) !== Number(id));
                if (disciplineDraftRow) {
                    disciplineDraftRow.remove();
                    disciplineDraftRow = null;
                }
                renderDisciplines();
            })
            .catch(err => alert(err.message || 'Ошибка сети'));
    }

    function showDisciplineDraft() {
        if (disciplineDraftRow) {
            disciplineDraftRow.querySelector('.edit-input')?.focus();
            return;
        }

        const container = document.getElementById('disciplines-body');
        if (!container) return;

        container.querySelectorAll('.admin-table-row').forEach(existing => {
            if (!existing.dataset.disciplineId) {
                existing.remove();
            }
        });

        const row = document.createElement('div');
        row.className = 'admin-table-row creating';
        row.innerHTML = `
            <span class="col-id">—</span>
            <span class="col-name">${makeInput('name', 'Название дисциплины')}</span>
            <span class="col-slug">${makeInput('slug', 'Slug')}</span>
            <button class="btn-edit" data-role="save">Сохранить</button>
            <button class="btn-delete" data-role="cancel">Отмена</button>
        `;

        container.prepend(row);
        disciplineDraftRow = row;

        const saveBtn = row.querySelector('[data-role="save"]');
        const cancelBtn = row.querySelector('[data-role="cancel"]');

        saveBtn.addEventListener('click', async () => {
            const payload = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                payload[input.dataset.field] = input.value.trim();
            });

            if (!payload.name) {
                alert('Укажите название дисциплины');
                return;
            }
            if (!payload.slug) {
                alert('Укажите slug дисциплины');
                return;
            }

            saveBtn.disabled = true;
            cancelBtn.disabled = true;

            try {
                const res = await fetch('/admin/create_discipline.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.error || 'Не удалось добавить дисциплину');
                }

                row.remove();
                disciplineDraftRow = null;

                if (data.discipline) {
                    disciplinesData.push(data.discipline);
                    disciplinesData.sort((a, b) => Number(a.id) - Number(b.id));
                }
                renderDisciplines();
            } catch (err) {
                alert(err.message || 'Ошибка сохранения');
                saveBtn.disabled = false;
                cancelBtn.disabled = false;
            }
        });

        cancelBtn.addEventListener('click', () => {
            row.remove();
            disciplineDraftRow = null;
        });
    }

    document.getElementById('btn-add-discipline')?.addEventListener('click', showDisciplineDraft);

    async function loadParticipants() {
        const container = document.getElementById('participants-body');
        if (!container) return;

        try {
            const res = await fetch('/admin/get_participants.php');
            const data = await res.json();

            if (!data.success || !Array.isArray(data.participants)) {
                throw new Error(data.error || 'Не удалось получить участников');
            }

            participantsData = data.participants;
            renderParticipants();
        } catch (err) {
            console.error('Участники ошибка:', err);
            container.innerHTML = `<div style="color:#f00">❌ ${escapeHTML(err.message)}</div>`;
        }
    }

    function renderParticipants() {
        const container = document.getElementById('participants-body');
        if (!container) return;

        container.innerHTML = '';
        participantDraftRow = null;

        if (!Array.isArray(participantsData) || participantsData.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'admin-table-row';
            emptyRow.innerHTML = '<span>Участники отсутствуют</span>';
            container.appendChild(emptyRow);
            return;
        }

        participantsData.forEach((player, i) => {
            const row = document.createElement('div');
            row.className = 'admin-table-row';
            row.dataset.participantId = player.id;

            const disciplineTitle = escapeAttr(player.discipline_name || '');

            row.innerHTML = `
                <span class="col-id">${escapeHTML(player.id)}</span>
                <span class="col-nickname">${escapeHTML(player.nickname || '')}</span>
                <span class="col-first-name">${escapeHTML(player.first_name || '')}</span>
                <span class="col-last-name">${escapeHTML(player.last_name || '')}</span>
                <span class="col-discipline" title="${disciplineTitle}">${escapeHTML(player.discipline_id)}</span>
                <button class="btn-edit" data-role="edit">Редактировать</button>
                <button class="btn-delete" data-role="delete">Удалить</button>
            `;

            container.appendChild(row);

            if (i < participantsData.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'product-divider';
                container.appendChild(divider);
            }

            row.querySelector('[data-role="edit"]').addEventListener('click', () => editParticipant(row, player));
            row.querySelector('[data-role="delete"]').addEventListener('click', () => deleteParticipant(player.id));
        });
    }

    function editParticipant(row, participant) {
        const editBtn = row.querySelector('[data-role="edit"]');
        const deleteBtn = row.querySelector('[data-role="delete"]');
        const isEditing = editBtn.classList.contains('confirm');

        if (!isEditing) {
            editBtn.classList.add('confirm');
            editBtn.textContent = 'Подтвердить';

            [
                { className: 'nickname', field: 'nickname', placeholder: 'Никнейм' },
                { className: 'first-name', field: 'first_name', placeholder: 'Имя' },
                { className: 'last-name', field: 'last_name', placeholder: 'Фамилия' },
                { className: 'discipline', field: 'discipline', placeholder: 'ID дисциплины' }
            ].forEach(({ className, field, placeholder }) => {
                const span = row.querySelector(`.col-${className}`);
                if (!span) return;
                const currentValue = span.textContent;
                span.innerHTML = makeInput(field, placeholder, currentValue);
            });
        } else {
            const updates = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                updates[input.dataset.field] = input.value.trim();
            });

            if (updates.discipline !== undefined) {
                const parsed = parseInt(updates.discipline, 10);
                updates.discipline_id = Number.isNaN(parsed) ? participant.discipline_id : parsed;
                delete updates.discipline;
            }

            editBtn.disabled = true;
            if (deleteBtn) deleteBtn.disabled = true;

            fetch('/admin/update_participant.php', {
                method: 'POST',
               	headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: participant.id, ...updates })
            })
                .then(r => r.json())
                .then(data => {
                    if (!data.success) {
                        throw new Error(data.error || 'Ошибка сохранения');
                    }
                    loadParticipants();
                })
                .catch(err => {
                    alert(err.message || 'Ошибка сохранения');
                })
                .finally(() => {
                    editBtn.disabled = false;
                    if (deleteBtn) deleteBtn.disabled = false;
                });
        }
    }

    function deleteParticipant(id) {
        fetch('/admin/delete_participant.php', {
            method: 'POST',
           	headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(data.error || 'Ошибка удаления');
                }
                participantsData = participantsData.filter(p => Number(p.id) !== Number(id));
                if (participantDraftRow) {
                    participantDraftRow.remove();
                    participantDraftRow = null;
                }
                renderParticipants();
            })
            .catch(err => alert(err.message || 'Ошибка сети'));
    }

    function showParticipantDraft() {
        if (participantDraftRow) {
            participantDraftRow.querySelector('.edit-input')?.focus();
            return;
        }

        const container = document.getElementById('participants-body');
        if (!container) return;

        container.querySelectorAll('.admin-table-row').forEach(existing => {
            if (!existing.dataset.participantId) {
                existing.remove();
            }
        });

        const row = document.createElement('div');
        row.className = 'admin-table-row creating';
        row.innerHTML = `
            <span class="col-id">—</span>
            <span class="col-nickname">${makeInput('nickname', 'Никнейм')}</span>
            <span class="col-first-name">${makeInput('first_name', 'Имя')}</span>
            <span class="col-last-name">${makeInput('last_name', 'Фамилия')}</span>
            <span class="col-discipline">${makeInput('discipline_id', 'ID дисциплины')}</span>
            <button class="btn-edit" data-role="save">Сохранить</button>
            <button class="btn-delete" data-role="cancel">Отмена</button>
        `;

        container.prepend(row);
        participantDraftRow = row;

        const saveBtn = row.querySelector('[data-role="save"]');
        const cancelBtn = row.querySelector('[data-role="cancel"]');

        saveBtn.addEventListener('click', async () => {
            const payload = {};
            row.querySelectorAll('.edit-input').forEach(input => {
                payload[input.dataset.field] = input.value.trim();
            });

            if (!payload.nickname) {
                alert('Укажите никнейм участника');
                return;
            }

            const disciplineId = parseInt(payload.discipline_id, 10);
            if (!Number.isInteger(disciplineId) || disciplineId <= 0) {
                alert('Укажите корректный ID дисциплины');
                return;
            }
            payload.discipline_id = disciplineId;

            saveBtn.disabled = true;
            cancelBtn.disabled = true;

            try {
                const res = await fetch('/admin/create_participant.php', {
                    method: 'POST',
                   	headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.error || 'Не удалось добавить участника');
                }

                row.remove();
                participantDraftRow = null;

                if (data.participant) {
                    participantsData.push(data.participant);
                    participantsData.sort((a, b) => Number(a.id) - Number(b.id));
                }
                renderParticipants();
            } catch (err) {
                alert(err.message || 'Ошибка сохранения');
                saveBtn.disabled = false;
                cancelBtn.disabled = false;
            }
        });

        cancelBtn.addEventListener('click', () => {
            row.remove();
            participantDraftRow = null;
        });
    }

    document.getElementById('btn-add-participant')?.addEventListener('click', showParticipantDraft);

});