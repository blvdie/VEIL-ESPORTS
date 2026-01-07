-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 12 2025 г., 09:38
-- Версия сервера: 5.7.29
-- Версия PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `veil_esports`
--

-- --------------------------------------------------------

--
-- Структура таблицы `activity_log`
--

CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `activity_log`
--

INSERT INTO `activity_log` (`id`, `user_id`, `action`, `details`, `created_at`) VALUES
(1, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 03:24:38'),
(2, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-09 03:24:47'),
(3, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 03:55:07'),
(4, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-09 03:55:11'),
(5, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 03:55:28'),
(6, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-09 03:58:21'),
(11, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 04:10:12'),
(12, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 04:10:18'),
(13, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 04:10:25'),
(14, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 04:10:29'),
(15, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 05:35:55'),
(16, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 06:10:58'),
(17, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 07:07:10'),
(18, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 08:45:40'),
(19, 8, 'login_failed', '{\"attempted_login\":\"vvv\"}', '2025-11-09 08:45:51'),
(20, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 08:45:54'),
(21, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 10:35:18'),
(22, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 10:35:36'),
(23, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 10:47:31'),
(24, 8, 'login_failed', '{\"attempted_login\":\"vvv\"}', '2025-11-09 10:47:37'),
(25, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 10:47:46'),
(26, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 11:09:00'),
(27, 8, 'login_failed', '{\"attempted_login\":\"vvv\"}', '2025-11-09 11:09:08'),
(28, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 11:09:13'),
(29, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 11:22:06'),
(30, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 11:22:19'),
(31, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 11:53:39'),
(32, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 11:53:49'),
(33, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 19:54:17'),
(34, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 19:54:25'),
(35, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 19:55:42'),
(36, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 19:55:49'),
(37, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 20:06:17'),
(38, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 20:06:26'),
(39, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 20:21:19'),
(40, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 20:21:28'),
(41, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-09 21:09:51'),
(42, 4, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 21:10:05'),
(43, 4, 'logout', 'Выход через веб-интерфейс', '2025-11-09 21:35:52'),
(44, 8, 'login_failed', '{\"attempted_login\":\"vvv\"}', '2025-11-09 22:30:57'),
(45, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-09 22:31:05'),
(46, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 06:22:39'),
(47, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 06:23:14'),
(48, 9, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 06:23:53'),
(49, 9, 'logout', 'Выход через веб-интерфейс', '2025-11-10 06:23:58'),
(50, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 06:26:08'),
(51, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 06:26:54'),
(52, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 06:32:08'),
(53, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 06:32:37'),
(54, 8, 'login_failed', '{\"attempted_login\":\"vvv\"}', '2025-11-10 06:32:58'),
(55, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 06:33:02'),
(56, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 06:34:56'),
(57, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 06:55:30'),
(58, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 06:56:25'),
(59, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 07:03:50'),
(60, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 07:05:34'),
(61, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 07:12:28'),
(62, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 07:12:48'),
(63, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 07:46:27'),
(64, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 07:48:29'),
(65, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 07:53:40'),
(66, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 08:36:23'),
(67, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 08:36:37'),
(68, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-10 08:38:03'),
(69, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 08:38:13'),
(70, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 08:38:24'),
(71, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 08:38:31'),
(72, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 08:59:22'),
(73, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 09:06:49'),
(74, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 09:08:39'),
(75, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 09:24:15'),
(76, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 09:41:55'),
(77, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 09:42:14'),
(78, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-10 09:51:26'),
(79, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 09:51:36'),
(80, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 09:54:56'),
(81, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 09:55:13'),
(82, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 10:50:24'),
(83, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 10:50:54'),
(84, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-10 10:51:01'),
(85, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 10:53:24'),
(86, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 11:28:39'),
(87, 6, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 11:29:03'),
(88, 6, 'logout', 'Выход через веб-интерфейс', '2025-11-10 11:39:47'),
(89, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 11:39:57'),
(90, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 12:25:16'),
(91, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 12:27:08'),
(92, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 12:28:16'),
(97, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 12:28:39'),
(98, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 12:32:52'),
(99, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 12:33:01'),
(100, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 12:35:01'),
(101, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 12:35:12'),
(102, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 12:39:58'),
(103, 8, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 12:46:56'),
(104, 8, 'logout', 'Выход через веб-интерфейс', '2025-11-10 12:50:55'),
(105, 10, 'login_success', 'Вход через веб-интерфейс', '2025-11-10 12:51:21');

-- --------------------------------------------------------

--
-- Структура таблицы `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `size`, `quantity`, `added_at`) VALUES
(3, 8, 3, 'ONE SIZE', 1, '2025-11-10 09:24:53'),
(5, 8, 1, 'M', 1, '2025-11-10 11:24:37'),
(6, 6, 1, 'M', 1, '2025-11-10 11:36:16'),
(7, 8, 10, 'ONE COLOR', 1, '2025-11-10 12:28:07'),
(13, 10, 3, 'ONE SIZE', 5, '2025-11-10 12:53:14'),
(14, 10, 1, 'L', 1, '2025-11-10 12:54:37'),
(15, 10, 6, 'ONE COLOR', 1, '2025-11-10 12:59:53');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `disciplines`
--

CREATE TABLE `disciplines` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Название дисциплины, напр. Dota 2',
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL-дружелюбный идентификатор, напр. dota2',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `disciplines`
--

INSERT INTO `disciplines` (`id`, `name`, `slug`, `created_at`) VALUES
(1, 'DOTA 2', 'dota2', '2025-11-12 06:28:24'),
(2, 'CS2', 'counter-strike2', '2025-11-12 06:28:24'),
(3, 'Valorant', 'valorant', '2025-11-12 06:28:24'),
(4, 'MOBILE LEGENDS:BB', 'mlbb', '2025-11-12 06:28:24'),
(5, 'VEIL ESPORTS FAMILY', 'family', '2025-11-12 06:28:24');

-- --------------------------------------------------------

--
-- Структура таблицы `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Игровой никнейм',
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Имя',
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Фамилия',
  `discipline_id` int(11) NOT NULL COMMENT 'ID киберспортивной дисциплины'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `players`
--

INSERT INTO `players` (`id`, `nickname`, `first_name`, `last_name`, `discipline_id`) VALUES
(1, 'BLVDESGRXVE', 'АЛЕНА', 'ФЕДОРОВА', 1),
(2, 'SDF', 'СВЯТОСЛАВ', 'СМИРНОВ', 1),
(3, 'TOCHKA', 'ДАНИИЛ', 'МИЩЕНКО', 1),
(4, 'PICKME', 'ОЛЬГА', 'АДАМЯНЕЦ', 1),
(5, 'TRM', 'ЕГОР', 'РЕДЬКА', 1),
(6, 'FERAJUT', 'МАРК', 'САМОЛКИН', 2),
(7, 'NEWMAN', 'БЕЖАН', 'БАКАЕВ', 2),
(8, 'ANTI-RELAXX', 'ИГОРЬ', 'ТАРАСОВ', 2),
(9, 'VODKA', 'ДАНИИЛ', 'ПАНОВ', 2),
(10, 'NITROGLYCERIN', 'ХАРИС', 'НУРЧИ', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sizes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '\r\n',
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `photo`, `sizes`, `description`, `price`) VALUES
(1, 'THE CHAMPIONS JERSEY BLACK', 'merch/jersey_black.png', 'S,M,L,XL,XXL', 'Легендарная игровая форма чемпионов The International', '5499.00'),
(2, 'THE CHAMPIONS JERSEY WHITE', 'merch/jersey_white.png', 'S,M,L,XL,XXL', NULL, '5499.00'),
(3, 'BLACK CAP', 'merch/cap.png', 'ONE SIZE', NULL, '2999.00'),
(4, 'BLACK HOODIE', 'merch/hoodie.png', 'S,M,L,XL,XXL', NULL, '6499.00'),
(5, 'BLACK TEE', 'merch/tshirt.png', 'S,M,L,XL,XXL', NULL, '5499.00'),
(6, 'BLACK TOTE', 'merch/tote.png', 'ONE COLOR', NULL, '2499.00'),
(7, 'BOOTCAMP ZIP HOODIE', 'merch/zip_hoodie.png', 'ONE COLOR', NULL, '6499.00'),
(10, 'BOXER BAG', 'merch/bag.png', 'ONE COLOR', 'НЯ', '0.00');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`, `last_login`) VALUES
(3, 'zxc', 'zxc@gmail.com', '123123', 'admin', '2025-11-08 21:58:56', NULL),
(4, 'qwe', 'qwe@qwe.com', '$2y$10$G.wquJ0Ud5k5wPl3m/.l7eOi86fK12qyMuM8FSnEqjIxFuWT4vC7e', 'user', '2025-11-09 01:00:45', '2025-11-09 21:10:05'),
(5, 'asdas', 'asd@asd.com', '$2y$10$QvMrrNQguJrEvtoubFSUUOMXB8R0Bf049VEn2Ru0vorDqn2uHP4jC', 'user', '2025-11-09 01:48:57', NULL),
(6, 'testuser', 'test@example.com', '$2y$10$47l11N.pCOzW.My6YTMWze6KbfTt.of8muJzTvgEIXJg92nCMbcIK', 'user', '2025-11-09 01:54:52', '2025-11-10 11:29:03'),
(7, 'vbn', 'vbn@gmail.com', '$2y$10$irxFK4/PXIdC4hVPfQRCLODVfKmUpx5yMmAx19j1LBaf0StZV57RS', 'user', '2025-11-09 02:45:11', '2025-11-09 02:45:47'),
(8, 'vvv', 'vvv@vvv.com', '$2y$10$dIsZkMl2d/kDVpT1OxWkGeAcwSdgSu4FQoyS.tZZ8Zg39HXUyeX/6', 'admin', '2025-11-09 04:02:33', '2025-11-10 12:46:56'),
(9, 'bober', 'bober@bb.com', '$2y$10$J54SSlxgRGbSguxhGbEfv.y4rRNpSUluf3Ebvm3P/77BioBfJxBBS', 'user', '2025-11-10 06:23:47', '2025-11-10 06:23:53'),
(10, 'blvde', 'blvde@gg.com', '$2y$10$Qt1K4wWMnQjF/OThE5v89OqVfQCJdSSL/mtaqnpW7cx2tiVDo.ttG', 'admin', '2025-11-10 12:51:15', '2025-11-10 12:51:21');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Индексы таблицы `disciplines`
--
ALTER TABLE `disciplines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Индексы таблицы `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nickname` (`nickname`),
  ADD KEY `discipline_id` (`discipline_id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT для таблицы `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `disciplines`
--
ALTER TABLE `disciplines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`discipline_id`) REFERENCES `disciplines` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
