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
            body: JSON.stringify({ product_id: productId, size })
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