<?php
session_start();
require_once 'db.php';

$stmt = $pdo->query("SELECT id, name, photo, price FROM products ORDER BY id ASC");
$products = $stmt->fetchAll();

$user = $_SESSION['user'] ?? null;
$isAdmin = $user && ($user['role'] === 'admin');
$displayName = $isAdmin ? 'Admin' : htmlspecialchars($user['username'] ?? '');
?>

<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="cache-control" content="no-cache">
  <title>VEIL ESPORTS</title>
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="pic/logo.png" type="image/png">
</head>
<body<?= $isAdmin ? ' class="admin"' : '' ?>>
<aside class="sidebar">
  <div class="sidebar-item" data-page="main">
    <a href="#main" class="sidebar-link">ГЛАВНАЯ</a>
  </div>
  <div class="sidebar-item" data-page="about">
    <a href="#about" class="sidebar-link">О КЛУБЕ</a>
  </div>
  <div class="sidebar-item" data-page="teams">
    <a href="#teams" class="sidebar-link">КОМАНДЫ</a>
  </div>
  <div class="sidebar-item" data-page="merch">
    <a href="#merch" class="sidebar-link">МЕРЧ</a>
  </div>

  <?php if ($isAdmin): ?>
  <div class="sidebar-item" data-page="admin">
    <a href="#admin" class="sidebar-link">АДМИН</a>
  </div>
  <?php endif; ?>

  <img src="pic/logo.png" alt="VEIL Logo" class="sidebar-logo">
</aside>
  

  <div class="background-overlay"></div>

  <main id="main-section" class="page active">
    <h1 class="main-title">THE CHAMPIONS COLLECTION</h1>
    <a href="#merch" class="btn-link">
  <button class="btn-details">ПОДРОБНЕЕ</button>
</a>
  </main>

  <section id="about-section" class="page">
    <div class="about-bg"></div>
    <div class="about-overlay"></div>
    <h2 class="about-title">О КЛУБЕ</h2>
    <div class="about-content">
      <p><span class="highlight">VEIL ESPORTS</span> — международная киберспортивная организация, основанная в 2023 году. Штаб-квартира команды расположена в Дубае, ОАЭ.</p>
      <p>На сегодняшний день <span class="highlight">VEIL ESPORTS</span> представлена в следующих дисциплинах:  
        <span class="game">DOTA 2</span> (blvdesgrxve, sdf, tochka, pickme, trm),  
        <span class="game">CS2</span> (ferajut, lapse, anti-relaxx, vodka, nitroglycerin),  
        <span class="game">VALORANT</span> (blvdesgrxve, lapse, ferajut, lapse, newman),  
        <span class="game">League of Legends</span> (Upset, Jankos, Caps, Wunder, Mikyx),  
        а также в мобильных дисциплинах —  
        <span class="game">Mobile Legends: Bang Bang</span> (oleggg, Karltzy, Kielvj, OhMyV33Nus, Ribo).  
      </p>
      <p>В составе <span class="highlight">VEIL ESPORTS FAMILY</span> также выступают популярные стримеры и контент-мейкеры — Tarik, Pokimane, Knekro и Caedrel.</p>
      <p>Наша миссия — демонстрировать стабильно высокие результаты на международной арене, развивать киберспортивное сообщество и создавать качественный, вдохновляющий контент. Мы стремимся к лидерству не только в результатах, но и в инициативах, направленных на укрепление инклюзивности, устойчивого развития и позитивного влияния на индустрию.</p>
    </div>
  </section>

  <section id="teams-section" class="page">
    <div class="teams-block" id="disciplines-list">
      <div class="teams-placeholder">Загрузка дисциплин…</div>
    </div>
  </section>

  <section id="roster-section" class="page">
    <div class="roster-art">
      <div class="roster-art-overlay"></div>
    </div>
    <button id="btn-back-to-teams" class="roster-back">
      <img src="pic/arrow.png" alt="Назад" class="roster-back-icon">
      <span class="roster-back-text">НАЗАД К СОСТАВАМ</span>
    </button>
    <div class="roster-content">
      <div id="roster-list" class="roster-list"></div>
      <div id="roster-empty" class="roster-empty">Состав пока не опубликован</div>
    </div>
  </section>

  <section id="merch-section" class="page">
    <h2 class="merch-title">ВСЕ ТОВАРЫ</h2>
    <div class="merch-grid">
  <?php foreach ($products as $product): ?>
    <div class="merch-item" data-id="<?= (int)$product['id'] ?>">
      <img 
        src="<?= htmlspecialchars($product['photo']) ?>" 
        alt="<?= htmlspecialchars($product['name']) ?>" 
        class="merch-img"
        onerror="this.onerror=null; this.src='pic/placeholder.png'"
      >
      <div class="merch-name"><?= htmlspecialchars($product['name']) ?></div>
      <div class="merch-price"><?= number_format($product['price'], 0, '', ' ') ?>₽</div>
    </div>
  <?php endforeach; ?>
</div>
  </section>

<section id="product-section" class="page">
  <div class="product-bg"></div>
  <div class="product-overlay"></div>

  <button id="btn-back-to-merch" class="back-btn">
    <span class="back-text">НАЗАД К КАТАЛОГУ</span>
  </button>

  <img id="product-img" src="" alt="" class="product-img">

  <div class="product-frame">
    <div class="frame-bg"></div>
    <div class="product-header">
      <h3 id="product-name" class="product-name"></h3>
      <div id="product-price" class="product-price"></div>
    </div>
    <div id="product-desc" class="product-desc"></div>
    <div id="sizes-container" class="sizes-block"></div>
    <button id="btn-add-to-cart" class="add-btn">Выберите размер</button>
  </div>
</section>

<?php if ($isAdmin): ?>
<section id="admin-section" class="page">
<h2 class="admin-title">АДМИН-ПАНЕЛЬ</h2>

<div class="admin-tabs">
  <button class="admin-tab" data-tab="users">ПОЛЬЗОВАТЕЛИ</button>
  <button class="admin-tab" data-tab="activity">АКТИВНОСТЬ</button>
  <button class="admin-tab" data-tab="products">ТОВАРЫ</button>
  <button class="admin-tab" data-tab="disciplines">ДИСЦИПЛИНЫ</button>
  <button class="admin-tab" data-tab="participants">УЧАСТНИКИ</button>
</div>

  <div class="admin-content">
    <div id="tab-users" class="admin-tab-content active">
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>LOGIN</th>
              <th>EMAIL</th>
              <th>РОЛЬ</th>
              <th>СОЗДАН</th>
              <th>ПОСЛЕДНИЙ ВХОД</th>
              <th>ИЗМЕНИТЬ РОЛЬ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <?php
            $stmt = $pdo->query("SELECT id, username, email, role, created_at, last_login FROM users ORDER BY id ASC");
            while ($row = $stmt->fetch()): ?>
            <tr data-user-id="<?= $row['id'] ?>">
              <td><?= htmlspecialchars($row['id']) ?></td>
              <td><?= htmlspecialchars($row['username']) ?></td>
              <td><?= htmlspecialchars($row['email']) ?></td>
              <td><?= htmlspecialchars($row['role'] === 'admin' ? 'Admin' : 'User') ?></td>
              <td><?= date('d.m.Y H:i', strtotime($row['created_at'])) ?></td>
              <td><?= $row['last_login'] ? date('d.m.Y H:i', strtotime($row['last_login'])) : '—' ?></td>
              <td>
                <?php if ($row['role'] === 'user'): ?>
                  <select class="role-select" data-user-id="<?= $row['id'] ?>">
                    <option value="user" <?= $row['role'] === 'user' ? 'selected' : '' ?>>User</option>
                    <option value="admin" <?= $row['role'] === 'admin' ? 'selected' : '' ?>>Admin</option>
                  </select>
                <?php else: ?>
                  —
                <?php endif; ?>
              </td>
              <td>
                <?php if ($row['id'] != $_SESSION['user']['id']): ?>
                  <button class="btn-delete" data-user-id="<?= $row['id'] ?>">Удалить</button>
                <?php endif; ?>
              </td>
            </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>
    
<div id="tab-activity" class="admin-tab-content">
  <div class="sort-dropdown">СОРТИРОВАТЬ ПО</div>
  <div class="sort-options">
    <a href="#" data-sort="id">ID</a>
    <a href="#" data-sort="user_id">USER_ID</a>
    <a href="#" data-sort="action">ДЕЙСТВИЕ</a>
    <a href="#" data-sort="created_at">СОВЕРШЕН</a>
  </div>

  <div class="admin-table-header">
  <span class="col-id">ID</span>
  <span class="col-user-id">USER_ID</span>
  <span class="col-action">ДЕЙСТВИЕ</span>
  <span class="col-details">ДЕТАЛИ</span>
  <span class="col-created">СОВЕРШЕН</span>
  
  <div class="sort-options">
    <a href="#" data-sort="id">ID</a>
    <a href="#" data-sort="user_id">USER_ID</a>
    <a href="#" data-sort="action">ДЕЙСТВИЕ</a>
    <a href="#" data-sort="created_at">СОВЕРШЕН</a>
  </div>
</div>
  <div class="admin-table-body" id="activity-body">
  <?php
$rows = $stmt->fetchAll();
foreach ($rows as $i => $row): ?>
  <div class="admin-table-row">
    <span class="col-id"><?= htmlspecialchars($row['id']) ?></span>
    <span class="col-user-id"><?= htmlspecialchars($row['user_id']) ?></span>
    <span class="col-action"><?= htmlspecialchars($row['action']) ?></span>
    <span class="col-details"><?= htmlspecialchars(substr($row['details'] ?? '', 0, 50)) . (strlen($row['details'] ?? '') > 50 ? '…' : '') ?></span>
    <span class="col-created"><?= date('d.m.Y H:i', strtotime($row['created_at'])) ?></span>
  </div>
  <?php if ($i < count($rows) - 1): ?>
    <div class="row-divider"></div>
  <?php endif; ?>
<?php endforeach; ?>
  </div>
</div>

<div id="tab-products" class="admin-tab-content">
  <div class="admin-content">
    <div class="admin-table-header">
      <span class="col-id">ID</span>
      <span class="col-name">НАЗВАНИЕ</span>
      <span class="col-photo">ПУТЬ К ФОТО</span>
      <span class="col-sizes">РАЗМЕРЫ</span>
      <span class="col-desc">ОПИСАНИЕ</span>
      <button id="btn-add-product" class="btn-add-product">Добавить новый товар</button>
    </div>
    <div class="admin-table-body" id="products-body"></div>
  </div>
</div>
<div id="tab-disciplines" class="admin-tab-content">
  <div class="admin-content">
    <div class="admin-table-header">
      <span class="col-id">ID</span>
      <span class="col-name">НАЗВАНИЕ</span>
      <span class="col-slug">SLUG</span>
      <button id="btn-add-discipline" class="btn-add-product">Добавить дисциплину</button>
    </div>
    <div class="admin-table-body" id="disciplines-body"></div>
  </div>
</div>
<div id="tab-participants" class="admin-tab-content">
  <div class="admin-content">
    <div class="admin-table-header">
      <span class="col-id">ID</span>
      <span class="col-nickname">НИК</span>
      <span class="col-first-name">ИМЯ</span>
      <span class="col-last-name">ФАМИЛИЯ</span>
      <span class="col-discipline">ДИСЦИПЛИНА (ID)</span>
      <button id="btn-add-participant" class="btn-add-product">Добавить участника</button>
    </div>
    <div class="admin-table-body" id="participants-body"></div>
  </div>
</div>
</section>
<?php endif; ?>

  <header class="top-bar" id="top-bar">
    <button id="btn-account" class="btn-account">
      <img src="pic/user.png" alt="Account" class="icon-account">
    </button>
    <button id="btn-cart" class="btn-cart">
      <span class="cart-text">КОРЗИНА</span>
      <img src="pic/cart.png" alt="Cart" class="icon-cart">
    </button>
  </header>

  <div id="overlay" class="overlay"></div>

  <aside id="cart-panel" class="cart-panel">
  <button id="close-cart" class="close-btn"><span class="close-x">&times;</span></button>
  <h2 class="cart-title">Ваша корзина</h2>
  <div id="cart-items-container"></div>
  <p id="cart-empty-msg" class="cart-empty">Ваша корзина пуста</p>
  <div id="cart-order-container" class="cart-order-container">
    <button id="cart-order-button" class="cart-order-button" type="button">Заказать</button>
  </div>
</aside>

<div id="order-panel" class="order-panel">
  <div class="order-content">
    <button id="order-close" class="close-btn" type="button"><span class="close-x">&times;</span></button>
    <form id="order-form" class="order-form" novalidate>
      <label for="order-full-name">Полное имя
        <input id="order-full-name" name="full_name" type="text" placeholder="Введите свое полное имя" autocomplete="name">
      </label>
      <label for="order-phone">Телефон
        <input id="order-phone" name="phone" type="text" placeholder="Введите свой номер телефона" autocomplete="tel">
      </label>
      <label for="order-country">Страна
        <select id="order-country" name="country">
          <option value="ru" selected>Россия</option>
          <option value="by">Беларусь</option>
          <option value="kz">Казахстан</option>
        </select>
      </label>
      <label for="order-city">Город
        <select id="order-city" name="city">
          <option value="">Выберите город</option>
        </select>
      </label>
      <label for="order-address">Адрес
        <input id="order-address" name="address" type="text" placeholder="Улица, дом, квартира" autocomplete="street-address">
      </label>
      <div id="order-error" class="order-error"></div>
      <div class="order-submit-container">
        <button id="order-submit" class="order-submit" type="submit">Заказать</button>
      </div>
    </form>
  </div>
</div>

<div id="order-success-panel" class="order-success-panel">
  <div class="order-success-content">
    <div class="order-success-title">СПАСИБО ЗА ПОКУПКУ!!!</div>
    <button id="order-success-button" class="order-success-button" type="button">На главную</button>
  </div>
</div>

  <aside id="account-panel" class="account-panel">
    <button id="close-account" class="close-btn"><span class="close-x">&times;</span></button>
    
    <img id="auth-logo" src="pic/logo big.png" alt="VEIL" class="auth-logo login-logo">

    <?php if ($user): ?>
      <div id="welcome-block" class="welcome-block">
        <div class="welcome-text">Добро пожаловать, <?= $displayName ?>!</div>
        <button id="btn-logout" class="logout-btn">Выйти из аккаунта</button>
      </div>
    <?php else: ?>
      <div id="login-form" class="active-form">
        <label class="auth-label">Email или логин</label>
        <input type="text" id="login-username" class="auth-input">
        <label class="auth-label">Пароль</label>
        <input type="password" id="login-password" class="auth-input">
        <button type="button" id="btn-login" class="auth-btn">Войти</button>
        <p class="auth-divider">— Или —</p>
        <button type="button" id="switch-to-register" class="auth-link">Зарегистрироваться</button>
        <div id="login-error" class="auth-error"></div>
      </div>

      <div id="register-form">
        <label class="auth-label">Логин</label>
        <div class="input-with-placeholder">
          <input type="text" id="reg-username" class="auth-input with-placeholder">
          <span class="input-placeholder">Ваш никнейм</span>
        </div>
        <label class="auth-label">Email</label>
        <div class="input-with-placeholder">
          <input type="email" id="reg-email" class="auth-input with-placeholder">
          <span class="input-placeholder">you@example.com</span>
        </div>
        <label class="auth-label">Пароль</label>
        <div class="input-with-placeholder">
          <input type="password" id="reg-password" class="auth-input with-placeholder">
          <span class="input-placeholder">Минимум 6 символов</span>
        </div>
        <label class="auth-label">Повторите пароль</label>
        <input type="password" id="reg-password2" class="auth-input">
        <button type="button" id="btn-register" class="auth-btn">Зарегистрироваться</button>
        <p class="auth-divider">— Или —</p>
        <button type="button" id="switch-to-login" class="auth-link">Войти</button>
        <div id="register-error" class="auth-error"></div>
      </div>
    <?php endif; ?>
  </aside>

  <footer class="footer">
    <div class="copyright-box <?= $user ? '' : 'on-main' ?>">
      <span class="copyright-text">@ 2025 VEIL ESPORTS</span>
    </div>
  </footer>

  <script src="scripts/auth.js"></script>
  <script src="scripts/script.js"></script>
  <?php if ($isAdmin): ?><script src="scripts/admin.js"></script><?php endif; ?>
  <script>const USER_IS_LOGGED_IN = <?= $user ? 'true' : 'false' ?>;</script>
</body>
</html>