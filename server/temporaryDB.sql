-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2022 at 03:33 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `texas_e_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `state` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `customer_id`, `state`) VALUES
(1, 2, 0),
(2, 3, 0),
(3, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `cart_product`
--

CREATE TABLE `cart_product` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `number_of_items` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'Mobiles'),
(2, 'Tablets'),
(3, 'Laptops'),
(4, 'Cameras'),
(5, 'Monitors'),
(6, 'Smart Watches'),
(7, 'External Storages'),
(8, 'Desktops'),
(9, 'Smart TVs'),
(10, 'Routers'),
(11, 'Power Banks'),
(12, 'Keyboards'),
(13, 'Memory Cards'),
(14, 'Mice'),
(15, 'Printers');

-- --------------------------------------------------------

--
-- Table structure for table `category_link`
--

CREATE TABLE `category_link` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `sub_category_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category_link`
--

INSERT INTO `category_link` (`category_id`, `sub_category_id`) VALUES
(1, 1),
(1, 5),
(1, 6),
(1, 10),
(2, 1),
(2, 5),
(3, 1),
(3, 8),
(3, 9),
(4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `name`, `email`, `password`) VALUES
(1, 'Chaturanga Jayanath', 'chathuranga@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'),
(2, 'Nipuni Silva', 'nipuni@gmail.com', '$2b$10$XJTjhQfCLlg4sCrakL.ih.DaeXTb7SjrltITr/x4WgscUubBDDMRq'),
(3, 'Kumesh Uminda', 'kumesh@gmail.com', '$2b$10$TtrjJrQQn0LkvNJc3wUxLeWmWgji3b23Jq4rgIbzDJ39VauVTR5Zy');

-- --------------------------------------------------------

--
-- Table structure for table `customer_address`
--

CREATE TABLE `customer_address` (
  `address_id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `po_box` varchar(255) DEFAULT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customer_mobile`
--

CREATE TABLE `customer_mobile` (
  `telephone_id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `mobile` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `custom_feature`
--

CREATE TABLE `custom_feature` (
  `custom_feature_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `custom_feature_name` varchar(255) NOT NULL,
  `custom_feature_val` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `custom_feature`
--

INSERT INTO `custom_feature` (`custom_feature_id`, `product_id`, `custom_feature_name`, `custom_feature_val`) VALUES
(1, 1, 'Chipset', 'Apple A11 Bionic'),
(2, 1, 'OS', 'iOS11.1.1, upgradable to iOS 15.5'),
(3, 1, 'Dimensions', '143.6 x 70.9 x 7.7 mm'),
(4, 1, 'Network', 'GSM/HSPA/LTE'),
(5, 1, 'Display', 'Super Retina OLED, 5.8 inches, 1125 x 2436 pixels, 19.5:9 aspect ratio, ~458 ppi density'),
(6, 2, 'ddddd', 'fffff'),
(7, 3, 'ddddd', 'fffff'),
(8, 4, 'ddddd105mm', 'fffff');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED DEFAULT NULL,
  `cart_id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `order_name` varchar(255) DEFAULT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `delivery_method` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_id`, `customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`, `phone_number`, `delivery_method`, `payment_method`) VALUES
(2, 2, 1, '2022-06-16', 'sdeadf', 'qeqwd', '123123123', 'sdfafsafas', 'cccc'),
(3, 3, 2, '2022-06-13', 'rdhhthtrehre', 'we', '00000000777', 'xxxcsafw', 'cccc'),
(4, 1, 3, '2022-06-14', 'hhhhhhhh', '232rrrrrrrrrrr', '555555555555555', 'uuuuuuuuuuu', 'ttttttttttttt');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `sku` varchar(32) NOT NULL,
  `product_weight` float NOT NULL,
  `default_variant_id` int(10) UNSIGNED DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `availability` enum('AVAILABLE','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_title`, `sku`, `product_weight`, `default_variant_id`, `image_name`, `availability`) VALUES
(1, 'iPhone X', '0123456789', 174, NULL, NULL, 'AVAILABLE'),
(2, 'ttttt', '1341341414', 9, NULL, NULL, 'AVAILABLE'),
(3, 'ttttt', '1341341414-x', 9, 5, '5a7dc0e3-999d-486f-b9d1-539b41b8b42d.png', 'AVAILABLE'),
(4, 'sssss', '1341341414', 330, 6, '74d06112-f499-41be-9355-44fcf5b1aa41.png', 'AVAILABLE');

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `sub_category_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`product_id`, `category_id`, `sub_category_id`) VALUES
(2, 1, 1),
(3, 1, 1),
(4, 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sell`
--

CREATE TABLE `sell` (
  `sell_id` int(10) UNSIGNED NOT NULL,
  `date_time` datetime NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `delivery_state` int(10) UNSIGNED DEFAULT NULL,
  `payment_state` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sub_category`
--

CREATE TABLE `sub_category` (
  `sub_category_id` int(10) UNSIGNED NOT NULL,
  `sub_category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sub_category`
--

INSERT INTO `sub_category` (`sub_category_id`, `sub_category_name`) VALUES
(1, 'Apple'),
(2, 'Nikon'),
(3, 'SanDisk'),
(4, 'Transcend'),
(5, 'Samsung'),
(6, 'Nokia'),
(7, 'Hp'),
(8, 'Asus'),
(9, 'Acer'),
(10, 'Huawei');

-- --------------------------------------------------------

--
-- Table structure for table `variant`
--

CREATE TABLE `variant` (
  `variant_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `variant`
--

INSERT INTO `variant` (`variant_id`, `product_id`, `variant_name`, `price`, `quantity`) VALUES
(1, 1, 'Red - 64GB', '300000.00', 100),
(2, 1, 'Red - 128GB', '350000.00', 88),
(3, 1, 'Blue - 64GB', '295000.00', 72),
(4, 1, 'Blue - 128GB', '345000.00', 21),
(5, 3, 'Default', '12.00', 1000),
(6, 4, 'Default', '3900.00', 40);

-- --------------------------------------------------------

--
-- Table structure for table `variant_image`
--

CREATE TABLE `variant_image` (
  `variant_id` int(10) UNSIGNED NOT NULL,
  `image_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `variant_option`
--

CREATE TABLE `variant_option` (
  `option_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `option_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `variant_option`
--

INSERT INTO `variant_option` (`option_id`, `product_id`, `option_name`) VALUES
(1, 1, 'Color'),
(2, 1, 'Storage'),
(3, 2, '434324-u'),
(4, 2, '434324-uawd'),
(5, 3, '434324-u'),
(6, 3, '434324-uawd'),
(7, 4, 'xspeed4');

-- --------------------------------------------------------

--
-- Table structure for table `variant_option_values`
--

CREATE TABLE `variant_option_values` (
  `value_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `option_id` int(10) UNSIGNED NOT NULL,
  `value_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `variant_option_values`
--

INSERT INTO `variant_option_values` (`value_id`, `product_id`, `option_id`, `value_name`) VALUES
(1, 1, 1, 'Red'),
(2, 1, 1, 'Blue'),
(3, 1, 2, '64GB'),
(4, 1, 2, '128GB'),
(5, 2, 3, '44'),
(6, 2, 4, '4432'),
(7, 3, 5, '44'),
(8, 3, 6, '4432'),
(9, 4, 7, '2GHz');

-- --------------------------------------------------------

--
-- Table structure for table `variant_values`
--

CREATE TABLE `variant_values` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `option_id` int(10) UNSIGNED NOT NULL,
  `value_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `variant_values`
--

INSERT INTO `variant_values` (`product_id`, `variant_id`, `option_id`, `value_id`) VALUES
(1, 1, 1, 1),
(1, 1, 2, 3),
(1, 2, 1, 1),
(1, 2, 2, 4),
(1, 3, 1, 2),
(1, 3, 2, 3),
(1, 4, 1, 2),
(1, 4, 2, 4),
(3, 5, 5, 7),
(3, 5, 6, 8),
(4, 6, 7, 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `cart_product`
--
ALTER TABLE `cart_product`
  ADD PRIMARY KEY (`cart_id`,`variant_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `category_link`
--
ALTER TABLE `category_link`
  ADD PRIMARY KEY (`category_id`,`sub_category_id`),
  ADD KEY `sub_category_id` (`sub_category_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `customer_address`
--
ALTER TABLE `customer_address`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customer_mobile`
--
ALTER TABLE `customer_mobile`
  ADD PRIMARY KEY (`telephone_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `custom_feature`
--
ALTER TABLE `custom_feature`
  ADD PRIMARY KEY (`custom_feature_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `FK_Product_DefaultVariant` (`default_variant_id`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`product_id`,`category_id`,`sub_category_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `sub_category_id` (`sub_category_id`);

--
-- Indexes for table `sell`
--
ALTER TABLE `sell`
  ADD PRIMARY KEY (`sell_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `sub_category`
--
ALTER TABLE `sub_category`
  ADD PRIMARY KEY (`sub_category_id`);

--
-- Indexes for table `variant`
--
ALTER TABLE `variant`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `variant_image`
--
ALTER TABLE `variant_image`
  ADD PRIMARY KEY (`image_name`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `variant_option`
--
ALTER TABLE `variant_option`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `variant_option_values`
--
ALTER TABLE `variant_option_values`
  ADD PRIMARY KEY (`value_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `option_id` (`option_id`);

--
-- Indexes for table `variant_values`
--
ALTER TABLE `variant_values`
  ADD PRIMARY KEY (`product_id`,`variant_id`,`option_id`,`value_id`),
  ADD KEY `variant_id` (`variant_id`),
  ADD KEY `option_id` (`option_id`),
  ADD KEY `value_id` (`value_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer_address`
--
ALTER TABLE `customer_address`
  MODIFY `address_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_mobile`
--
ALTER TABLE `customer_mobile`
  MODIFY `telephone_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `custom_feature`
--
ALTER TABLE `custom_feature`
  MODIFY `custom_feature_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sell`
--
ALTER TABLE `sell`
  MODIFY `sell_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_category`
--
ALTER TABLE `sub_category`
  MODIFY `sub_category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `variant`
--
ALTER TABLE `variant`
  MODIFY `variant_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `variant_option`
--
ALTER TABLE `variant_option`
  MODIFY `option_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `variant_option_values`
--
ALTER TABLE `variant_option_values`
  MODIFY `value_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_product`
--
ALTER TABLE `cart_product`
  ADD CONSTRAINT `cart_product_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_product_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `variant` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `category_link`
--
ALTER TABLE `category_link`
  ADD CONSTRAINT `category_link_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `category_link_ibfk_2` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category` (`sub_category_id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_address`
--
ALTER TABLE `customer_address`
  ADD CONSTRAINT `customer_address_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_mobile`
--
ALTER TABLE `customer_mobile`
  ADD CONSTRAINT `customer_mobile_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_feature`
--
ALTER TABLE `custom_feature`
  ADD CONSTRAINT `custom_feature_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_Product_DefaultVariant` FOREIGN KEY (`default_variant_id`) REFERENCES `variant` (`variant_id`);

--
-- Constraints for table `product_category`
--
ALTER TABLE `product_category`
  ADD CONSTRAINT `product_category_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_category_ibfk_3` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category` (`sub_category_id`) ON DELETE CASCADE;

--
-- Constraints for table `sell`
--
ALTER TABLE `sell`
  ADD CONSTRAINT `sell_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant`
--
ALTER TABLE `variant`
  ADD CONSTRAINT `variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_image`
--
ALTER TABLE `variant_image`
  ADD CONSTRAINT `variant_image_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `variant` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_option`
--
ALTER TABLE `variant_option`
  ADD CONSTRAINT `variant_option_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_option_values`
--
ALTER TABLE `variant_option_values`
  ADD CONSTRAINT `variant_option_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_option_values_ibfk_2` FOREIGN KEY (`option_id`) REFERENCES `variant_option` (`option_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_values`
--
ALTER TABLE `variant_values`
  ADD CONSTRAINT `variant_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_values_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `variant` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_values_ibfk_3` FOREIGN KEY (`option_id`) REFERENCES `variant_option` (`option_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_values_ibfk_4` FOREIGN KEY (`value_id`) REFERENCES `variant_option_values` (`value_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
