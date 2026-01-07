
async function loadProduct(productId) {
    try {
        const res = await fetch(`/get_product.php?id=${productId}`);
        const product = await res.json();
        if (!product || product.error) throw new Error(product?.error || 'Товар не найден');

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `${product.price}₽`;
        document.getElementById('product-desc').textContent = product.description || 'Описание отсутствует';
        document.getElementById('product-img').src = product.photo || 'pic/placeholder.png';
        document.getElementById('product-img').onerror = () => this.src = 'pic/placeholder.png';

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
        alert('Товар не найден');
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

const observer = new MutationObserver(() => {
    const productSection = document.getElementById('product-section');
    if (productSection && productSection.classList.contains('active')) {
        const productId = sessionStorage.getItem('selectedProductId');
        if (productId) {
            loadProduct(productId);
        } else {
            navigateTo('merch');
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });

document.getElementById('btn-back-to-merch')?.addEventListener('click', () => {
    navigateTo('merch');
});