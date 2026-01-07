document.addEventListener('DOMContentLoaded', function () {
    const welcomeBlock = document.getElementById('welcome-block');
    const accountPanel = document.getElementById('account-panel');
    const overlay = document.getElementById('overlay');
    const topBar = document.getElementById('top-bar');

    if (welcomeBlock && accountPanel && overlay) {
        accountPanel.classList.remove('open');
        overlay.classList.remove('active');
        if (topBar) topBar.style.visibility = 'visible';
    }

    document.querySelectorAll('.with-placeholder').forEach(container => {
        const input = container.querySelector('.auth-input');
        const placeholder = container.querySelector('.input-placeholder');
        if (!input || !placeholder) return;

        input.addEventListener('focus', () => placeholder.style.opacity = '0');
        input.addEventListener('blur', () => {
            placeholder.style.opacity = input.value === '' ? '1' : '0';
        });
        placeholder.style.opacity = input.value === '' ? '1' : '0';
    });

    function showError(input, label, message) {
        label.classList.add('error');
        let errorEl = input.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('field-error')) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            input.parentNode.insertBefore(errorEl, input.nextSibling);
        }
        errorEl.textContent = message;
    }

    function clearError(input, label) {
        label.classList.remove('error');
        const errorEl = input.nextElementSibling;
        if (errorEl && errorEl.classList.contains('field-error')) {
            errorEl.remove();
        }
    }

    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', async () => {
            const usernameInput = document.getElementById('login-username');
            const passwordInput = document.getElementById('login-password');
            const usernameLabel = document.querySelector('#login-form label:nth-of-type(1)');
            const passwordLabel = document.querySelector('#login-form label:nth-of-type(2)');

            [usernameLabel, passwordLabel].forEach(l => l?.classList.remove('error'));
            document.querySelectorAll('.field-error').forEach(el => el.remove());

            if (!usernameInput?.value.trim()) {
                showError(usernameInput, usernameLabel, 'Обязательное поле');
                return;
            }
            if (!passwordInput?.value) {
                showError(passwordInput, passwordLabel, 'Обязательное поле');
                return;
            }

            try {
                const res = await fetch('/auth/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: usernameInput.value.trim(),
                        password: passwordInput.value
                    })
                });

                const data = await res.json();

                if (data.success) {
                    window.location = window.location.origin + window.location.pathname + '?_=' + Date.now() + '#main';
                } else {
                    const errorEl = document.getElementById('login-error');
                    if (errorEl) errorEl.textContent = data.error;
                    usernameLabel?.classList.add('error');
                }
            } catch (e) {
                document.getElementById('login-error').textContent = 'Ошибка подключения';
            }
        });
    }

const btnRegister = document.getElementById('btn-register');
if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
        const inputs = {
            username: { el: document.getElementById('reg-username') },
            email: { el: document.getElementById('reg-email') },
            password: { el: document.getElementById('reg-password') },
            password2: { el: document.getElementById('reg-password2') }
        };
        const labels = {
            username: document.querySelector('#register-form label:nth-of-type(1)'),
            email: document.querySelector('#register-form label:nth-of-type(2)'),
            password: document.querySelector('#register-form label:nth-of-type(3)'),
            password2: document.querySelector('#register-form label:nth-of-type(4)')
        };

        Object.values(labels).forEach(l => l?.classList.remove('error'));
        document.querySelectorAll('.field-error').forEach(el => el.remove());

        let valid = true;
        for (const [key, el] of Object.entries(inputs)) {
            if (!el.el?.value.trim()) {
                showError(el.el, labels[key], 'Обязательное поле');
                valid = false;
            }
        }

        const { username, email, password, password2 } = inputs;
        if (email.el?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.el.value)) {
            showError(email.el, labels.email, 'Некорректный email');
            valid = false;
        }
        if (password.el?.value && password.el.value.length < 6) {
            showError(password.el, labels.password, 'Минимум 6 символов');
            valid = false;
        }
        if (password.el?.value && password2.el?.value && password.el.value !== password2.el.value) {
            showError(password2.el, labels.password2, 'Пароли не совпадают');
            valid = false;
        }

        if (!valid) return;

        try {
            const res = await fetch('/auth/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.el.value.trim(),
                    email: email.el.value.trim(),
                    password: password.el.value,
                    password2: password2.el.value
                })
            });
            const data = await res.json();

            if (data.success) {
                document.getElementById('register-form')?.classList.remove('active-form');
                document.getElementById('login-form')?.classList.add('active-form');
                const logo = document.getElementById('auth-logo');
                if (logo) {
                    logo.classList.remove('register-logo');
                    logo.classList.add('login-logo');
                }
                Object.values(inputs).forEach(i => { if (i.el) i.el.value = ''; });
            } else {
                document.getElementById('register-error').textContent = data.error;
                labels.username?.classList.add('error');
                labels.email?.classList.add('error');
            }
        } catch (e) {
            document.getElementById('register-error').textContent = 'Ошибка подключения';
        }
    });
}

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            fetch('/auth/logout.php', { method: 'POST' })
                .then(() => {
                    window.location = window.location.origin + window.location.pathname + '?_=' + Date.now() + '#main';
                })
                .catch(err => {
                    console.error('Выход не удался:', err);
                    alert('Не удалось выйти. Попробуйте позже.');
                });
        });
    }
});