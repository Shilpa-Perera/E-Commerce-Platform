-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2022 at 05:16 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `order_transaction` (IN `orderCartId` INT(10), IN `orderDate` DATETIME, IN `orderName` VARCHAR(255), IN `orderAddress` VARCHAR(255), IN `orderZipCode` VARCHAR(10), IN `orderPhoneNumber` VARCHAR(255), IN `orderDeliveryMethod` VARCHAR(255), IN `orderPaymentMethod` VARCHAR(255), IN `orderCustomerId` INT(10), IN `sellDateTime` DATETIME, IN `sellPaymentStatus` ENUM('PENDING','PAID'))  BEGIN
 
 DECLARE exit handler for sqlexception
   BEGIN
     -- ERROR
   ROLLBACK;
 END;
   

 
 START TRANSACTION;
   INSERT INTO `order` (`customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`, `zip_code`, `phone_number`, `delivery_method`, `payment_method`) VALUES (orderCustomerId, orderCartId, orderDate, orderName, orderAddress, orderZipCode, orderPhoneNumber, orderDeliveryMethod, orderPaymentMethod);
   SELECT @newOrder :=order_id FROM `order` WHERE cart_id = orderCartId;
   INSERT INTO `sell` (`date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES (sellDateTime, @newOrder, 'PROCESSING', sellPaymentStatus);
   CALL update_product_variants_quantity_from_cart(orderCartId);
   UPDATE `cart` SET `state` = 'INACTIVE' WHERE `cart`.`cart_id` = orderCartId;
 COMMIT;
 END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `order_transaction_guest` (IN `orderCartId` INT(10), IN `orderDate` DATETIME, IN `orderName` VARCHAR(255), IN `orderAddress` VARCHAR(255), IN `orderZipcode` VARCHAR(10), IN `orderPhoneNumber` VARCHAR(255), IN `orderDeliveryMethod` ENUM('STORE-PICKUP','DELIVERY'), IN `orderPaymentMethod` ENUM('CASH','CARD'), IN `orderCustomerId` INT(10), IN `sellDateTime` DATETIME, IN `sellPaymentStatus` ENUM('PENDING','PAID'))  BEGIN
 

 START TRANSACTION;
   INSERT INTO `order` (`customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`,`zip_code`, `phone_number`, `delivery_method`, `payment_method`) VALUES (NULL, orderCartId, orderDate, orderName, orderAddress, orderZipcode, orderPhoneNumber, orderDeliveryMethod, orderPaymentMethod);
   SELECT @newOrder :=order_id FROM `order` WHERE cart_id = orderCartId;
   INSERT INTO `sell` (`date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES (sellDateTime, @newOrder, 'PROCESSING', sellPaymentStatus);
   CALL update_product_variants_quantity_from_cart(orderCartId);
   UPDATE `cart` SET `state` = 'INACTIVE' WHERE `cart`.`cart_id` = orderCartId;
 COMMIT;
 END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_product_variants_quantity_from_cart` (IN `cartId` INT)  BEGIN  
	DECLARE i INT DEFAULT 0;
	SELECT @n:=COUNT(*) FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId;
	SET i=0;
	WHILE i<@n DO 
  		SELECT @variantId := variant_id FROM (SELECT ROW_NUMBER()OVER(ORDER BY variant_id)-1 as e , variant_id,quantity-CAST( number_of_items AS SIGNED ) remainder  FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId) as A WHERE A.e=i LIMIT 1;
        SELECT @qval := number_of_items FROM (SELECT ROW_NUMBER()OVER(ORDER BY variant_id)-1 as e , variant_id, number_of_items FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId) as A WHERE A.e=i LIMIT 1;
        UPDATE `variant` SET `quantity` = quantity-CAST( @qval AS SIGNED ) WHERE `variant`.`variant_id` = @variantId;
  		SET i = i + 1;
	END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `name`, `email`, `password`) VALUES
(1, 'Achira', 'achira@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'),
(2, 'Chaturanga', 'chathuranga@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'),
(3, 'Sasitha', 'sasitha@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'),
(4, 'Thamindu', 'thamindu@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'),
(5, 'Shilpa', 'shilpa@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED DEFAULT NULL,
  `state` enum('ACTIVE','INACTIVE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `customer_id`, `state`) VALUES
(1, NULL, 'INACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `cart_product`
--

CREATE TABLE `cart_product` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `number_of_items` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart_product`
--

INSERT INTO `cart_product` (`cart_id`, `variant_id`, `number_of_items`) VALUES
(1, 1, 2),
(1, 2, 1),
(1, 6, 3),
(1, 11, 1),
(1, 12, 10),
(1, 13, 2);

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
(3, 7),
(3, 8),
(3, 9),
(4, 2),
(6, 1);

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
(1, 'Sahan Silva', 'sahan@gmail.com', '$2b$10$XJTjhQfCLlg4sCrakL.ih.DaeXTb7SjrltITr/x4WgscUubBDDMRq'),
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
(1, 1, 'Display', 'IPS LCD, 6.0 inches, 92.4 cm2 (~77.2% screen-to-body ratio), 1080 x 2160 pixels, 18:9 ratio (~403 ppi density)'),
(2, 1, 'Operating System', 'Android 8.1 (Oreo), upgradable to Android 10, Android One'),
(3, 1, 'Chipset', 'Qualcomm SDM660 Snapdragon 660 (14 nm)'),
(4, 1, 'Network', 'GSM / CDMA / HSPA / EVDO / LTE'),
(5, 1, 'Storage', '64GB'),
(6, 2, 'Operating System', 'iOS 11.1.1, up to iOS 15.5, planned upgrade to iOS 16'),
(7, 2, 'Chipset', 'Apple A11 Bionic (10 nm)'),
(8, 2, 'RAM', '3GB'),
(9, 2, 'Network', 'GSM / HSPA / LTE'),
(10, 3, 'Processor', '12th Gen Intel Core™ i7 processor'),
(11, 3, 'Graphics', ' NVIDIA® GeForce® RTX3060'),
(12, 3, 'Display', '15.6” 144Hz FHD IPS display'),
(13, 3, 'Operating System', 'Windows 11 Home'),
(14, 5, 'Display', 'TFT LCD, 10.1 inches, 295.8 cm2 (~80.7% screen-to-body ratio), 1200 x 1920 pixels, 16:10 ratio (~224 ppi density)'),
(15, 5, 'Operating System', 'Android 9.0 (Pie), upgradable to Android 11, One UI 3.0'),
(16, 5, 'Chipset', 'Exynos 7904 (14 nm)'),
(17, 7, 'Operating System', 'Windows 11 Home'),
(18, 7, 'Screen Size', '15.6\"'),
(19, 7, 'Display', 'FHD IPS LED'),
(20, 8, 'Sensor', '20.9MP DX-Format CMOS Sensor'),
(21, 8, 'Image Processor', 'EXPEED 5'),
(22, 8, 'Screen', '3.2\" 922k-Dot Tilting Touchscreen LCD'),
(23, 8, 'Video Recording', '4K UHD at 30 fps'),
(24, 9, 'Sensor', '20.9MP DX-Format CMOS Sensor'),
(25, 9, 'Image Processor', 'EXPEED 5'),
(26, 9, 'Video Recording', '4K UHD at 30 fps'),
(27, 9, 'Screen', '3.2\" 2539k-Dot Tilting Touchscreen LCD'),
(28, 10, 'Network', 'GSM / HSPA / LTE'),
(29, 10, 'Dimensions', '45 x 38 x 10.7 mm'),
(30, 10, 'Operating System', 'watchOS 8.0, up to 8.6, planned upgrade to watchOS 9.0'),
(31, 10, 'Chipset', 'Apple S7'),
(32, 10, 'Display', 'Retina LTPO OLED, 1000 nits (peak), 1.9 inches, 484 x 396 pixels (~326 ppi density)'),
(33, 11, 'Network', 'GSM / CDMA / HSPA / EVDO / LTE / 5G'),
(34, 11, 'Display', 'Liquid Retina XDR mini-LED LCD, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 1600 nits (peak), 12.9 inches, 515.3 cm2 (~85.4% screen-to-body ratio), 2048 x 2732 pixels, 4:3 ratio (~265 ppi density)'),
(35, 11, 'Operating System', 'iPadOS 14.5.1, up to iPadOS 15.5, planned upgrade to iPadOS 16'),
(36, 11, 'Chipset', 'Apple M1');

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
  `zip_code` varchar(10) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `delivery_method` enum('DELIVERY','STORE-PICKUP','','') DEFAULT NULL,
  `payment_method` enum('CASH','CARD','','') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_id`, `customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`, `zip_code`, `phone_number`, `delivery_method`, `payment_method`) VALUES
(7, NULL, 1, '2022-06-29', 'Achira Dias', '293/E/1, 2ND LANE, MANDAVILLA ROAD, KESBAWA, PILIYANDALA', '10300', '01126194121', 'DELIVERY', 'CASH'),
(13, NULL, 1, '2022-06-29', 'Achira Dias', '293/E/1, 2ND LANE, MANDAVILLA ROAD, KESBAWA, PILIYANDALA', '10300', '01126194121', 'DELIVERY', 'CASH');

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
(1, 'Nokia 7 Plus', '0123456789', 177, 1, '5d398d54-f630-4c4a-9122-04a184d82931.png', 'AVAILABLE'),
(2, 'iPhone X', '0987654321', 174, 4, '3d1d3b00-74bd-4b04-afe4-798a827cdb61.png', 'AVAILABLE'),
(3, 'Asus VivoBook Pro', '0563214789', 2000, 6, '87ce7344-e6c9-4c0d-b64e-169db00d99cd.png', 'AVAILABLE'),
(5, 'Galaxy Tab A', '4597231809', 200, 10, '3eb765f4-6e08-4544-8312-e40b9ce7a093.png', 'AVAILABLE'),
(7, 'HP Pavilion 15', '07812546938', 2000, 11, '54e93a83-a994-4952-b431-ee2c8b9506ef.png', 'AVAILABLE'),
(8, 'Nikon D7500', '6712489325', 1000, 15, '88bb0b8c-734e-4415-a04d-ede9190a4053.png', 'AVAILABLE'),
(9, 'Nikon D500', '9632485176', 1000, 16, 'cd82303a-f316-4aa9-b3a1-22b1b938a468.png', 'AVAILABLE'),
(10, 'iWatch Series 7', '3541796820', 32, 17, '47db40bf-3fde-4c60-b28a-a5a681782e30.png', 'AVAILABLE'),
(11, 'iPad Pro', '4896347210', 682, 19, '874ad8a3-a666-4b4e-a22a-553f577e34e9.png', 'AVAILABLE');

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
(1, 1, 6),
(2, 1, 1),
(3, 3, 8),
(5, 2, 5),
(7, 3, 7),
(8, 4, 2),
(9, 4, 2),
(10, 6, 1),
(11, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sell`
--

CREATE TABLE `sell` (
  `sell_id` int(10) UNSIGNED NOT NULL,
  `date_time` datetime DEFAULT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `delivery_state` enum('PROCESSING','OUTFORDELIVERY','DELIVERED') DEFAULT NULL,
  `payment_state` enum('PENDING','PAID') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sell`
--

INSERT INTO `sell` (`sell_id`, `date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES
(1, NULL, 13, 'PROCESSING', 'PENDING');

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
(1, 1, 'Black/Copper - 4GB ', '60000.00', 98),
(2, 1, 'White/Copper - 4GB', '60000.00', 99),
(3, 1, 'Black/Copper - 6GB', '65000.00', 100),
(4, 2, 'Silver - 64GB', '200000.00', 100),
(5, 2, 'Gray - 256GB', '220000.00', 100),
(6, 3, 'Black - 8GB - 1TB', '250000.00', 97),
(7, 3, 'Silver - 8GB - 2TB', '275000.00', 100),
(8, 3, 'Silver - 16GB - 1TB', '285000.00', 100),
(9, 3, 'Black - 2TB - 32GB', '300000.00', 100),
(10, 5, 'Black - 16GB - 2GB', '50000.00', 100),
(11, 7, 'Silver - 512GB - 8GB - i5', '300000.00', 99),
(12, 7, 'Blue - 1TB - 8GB - i5', '320000.00', 90),
(13, 7, 'Gold - 2TB - 16GB - i7', '410000.00', 98),
(14, 7, 'Teal - 1TB - 8GB - i7', '365000.00', 100),
(15, 8, 'D7500 - Default', '500000.00', 100),
(16, 9, 'D500 - Default', '400000.00', 100),
(17, 10, 'Silver - Steel', '250000.00', 100),
(18, 10, 'Green - Aluminium', '250000.00', 100),
(19, 11, 'Gray - 8GB - 128GB', '345000.00', 100),
(20, 11, 'Silver - 8GB - 128GB', '345000.00', 100);

-- --------------------------------------------------------

--
-- Table structure for table `variant_image`
--

CREATE TABLE `variant_image` (
  `variant_id` int(10) UNSIGNED NOT NULL,
  `image_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `variant_image`
--

INSERT INTO `variant_image` (`variant_id`, `image_name`) VALUES
(1, '041aeb97-3284-4d54-908d-cd15a99a19ee.png'),
(1, '78793e99-21b9-4ab9-8144-66748036fdd6.png'),
(1, '916103d0-3e9c-46d9-ba45-2915c20bf206.png'),
(2, '6a78e5b7-4f07-4fd2-a1f1-2bb33fe9bb15.png'),
(2, 'a1b755a9-a1f4-437a-b404-57eddd736ba6.png'),
(3, '06cac41d-5dc0-4ba0-9fd6-bdc4595d8afc.png'),
(3, '5bf53b92-3447-407b-8ec4-4abaf84aeb0d.png'),
(3, 'c7f3d075-6a3e-4581-bd1d-bf9fe99e7a0c.png'),
(4, '6c3fcde1-8cba-4c59-947d-3d0d845ec538.png'),
(4, '8fdb63e9-41ef-421b-81b6-9051984317b3.png'),
(5, '8e5bb046-04be-430d-b43f-50d7f8e08782.png'),
(5, '9d0a892e-2296-460a-95f0-e0c66bf7bfbc.png'),
(6, '02d19284-0569-4f97-8da1-e829efe32058.png'),
(6, 'cb1e224b-e900-49ce-a9fd-987709341c3e.png'),
(6, 'f5744f58-307c-4e3a-a305-7591cea6ddfd.png'),
(7, '3666d33d-c3b3-429a-8a3b-7ce12b17fc38.png'),
(7, 'abfd0500-3b10-47fc-9a58-7f352f2e61af.png'),
(8, '24c5c333-120b-41e6-b5b9-c28677ddb2fe.png'),
(8, '3e9806b6-ddd1-4dee-8484-e3371478bcc1.png'),
(8, 'ebf46444-b7e5-43e7-ad67-baa64ce1e7c4.png'),
(9, '18ac07ed-f4f9-4a87-a2d9-644eb04630c5.png'),
(9, '38789a71-2ce9-4aa7-841c-03556539a997.png'),
(9, 'be2fac0b-6eba-4223-b594-40791ca87693.png'),
(11, '95521860-054d-4247-bd29-3c8ac8d914ab.png'),
(11, 'eb33c04c-5a0f-454f-9840-67d934d01000.png'),
(11, 'f5c31616-3b33-437d-8ecd-75eed097fd6d.png'),
(12, '8d85e366-208a-466a-aed9-8aef851a8645.png'),
(12, 'b57eada5-c6c9-4dd3-92a3-545dd41ef942.png'),
(12, 'c46b0f6a-b614-4dd9-8d98-637d8de47170.png'),
(13, '047b91de-986d-4229-8bc4-35e220207772.png'),
(13, '2ae938c6-4591-48a8-8a0b-0a9c477159a9.png'),
(13, 'ee6fdeb0-cd0f-445b-8283-b197d3e19e6b.png'),
(14, '142730e5-d876-43f7-9b68-0b76f3a2a802.png'),
(14, '901c3c69-5fa5-4cf9-b6d6-01fcce46810b.png'),
(14, '9722a921-ac12-4431-8a61-7eebebaefeff.png'),
(14, '9cf738f5-ae07-4a26-bc84-fd3731c0758b.png'),
(15, '0a040b1e-2c6a-4ec2-a694-61a81a3b0ffa.png'),
(15, '8a433133-efa1-4abc-aaf1-3852ceb7b900.png'),
(15, '9d08cc89-4202-410f-a7ff-312c9866c597.png'),
(16, '11c4d24c-dc87-4342-bc24-c2eae3268934.png'),
(16, 'e1093666-c01c-4520-b762-48cacc22fc46.png'),
(17, 'edfb4893-2e32-4a4d-b4fd-e403341f9b31.png'),
(18, 'be7c8b9c-111e-43f1-ad46-621401568aec.png'),
(19, '72d36ce0-45b9-4d5a-8b86-95bb769e3bfd.png'),
(19, 'a7556d30-a7b2-4b81-891e-8cc4ced8c864.png'),
(20, '06608ead-4e7c-4dae-b78b-398007149a22.png'),
(20, '2374696f-8cc6-49bd-9438-09adf8eb8a77.png');

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
(2, 1, 'RAM'),
(3, 2, 'Storage'),
(4, 2, 'Color'),
(5, 3, 'Color'),
(6, 3, 'Storage'),
(7, 3, 'RAM'),
(8, 5, 'Color'),
(9, 5, 'Storage'),
(10, 5, 'RAM'),
(11, 7, 'Color'),
(12, 7, 'Storage'),
(13, 7, 'RAM'),
(14, 7, 'Processor'),
(15, 10, 'Case'),
(16, 10, 'Color'),
(17, 11, 'Color'),
(18, 11, 'RAM'),
(19, 11, 'Storage');

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
(1, 1, 1, 'Black/Copper'),
(2, 1, 1, 'White/Copper'),
(3, 1, 2, '4GB'),
(4, 1, 2, '6GB'),
(5, 2, 3, '64GB'),
(6, 2, 3, '256GB'),
(7, 2, 4, 'Space Gray'),
(8, 2, 4, 'Silver'),
(9, 3, 5, 'Black'),
(10, 3, 5, 'Silver'),
(11, 3, 6, '1TB'),
(12, 3, 6, '2TB'),
(13, 3, 7, '8GB'),
(14, 3, 7, '16GB'),
(15, 3, 7, '32GB'),
(16, 5, 8, 'Black'),
(17, 5, 8, 'Gold'),
(18, 5, 8, 'Silver'),
(19, 5, 9, '16GB'),
(20, 5, 9, '32GB'),
(21, 5, 9, '64GB'),
(22, 5, 9, '128GB'),
(23, 5, 10, '2GB'),
(24, 5, 10, '3GB'),
(25, 7, 11, 'Natural Silver'),
(26, 7, 11, 'Fog Blue'),
(27, 7, 11, 'Forest Teal'),
(28, 7, 11, 'Warm Gold'),
(29, 7, 12, '512GB'),
(30, 7, 12, '1TB'),
(31, 7, 12, '2TB'),
(32, 7, 13, '8GB'),
(33, 7, 13, '16GB'),
(34, 7, 14, 'Intel Core i5'),
(35, 7, 14, 'Intel Core i7'),
(36, 10, 15, 'Stainless Steel'),
(37, 10, 15, 'Aluminum '),
(38, 10, 16, 'Silver'),
(39, 10, 16, 'Green'),
(40, 10, 16, 'Blue'),
(41, 10, 16, 'Midnight'),
(42, 10, 16, 'Gold'),
(43, 10, 16, 'Graphite'),
(44, 10, 16, 'Red'),
(45, 11, 17, 'Silver'),
(46, 11, 17, 'Space Gray'),
(47, 11, 18, '8GB'),
(48, 11, 18, '16GB'),
(49, 11, 19, '128GB'),
(50, 11, 19, '256GB'),
(51, 11, 19, '512GB');

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
(1, 2, 1, 2),
(1, 2, 2, 3),
(1, 3, 1, 1),
(1, 3, 2, 4),
(2, 4, 3, 5),
(2, 4, 4, 8),
(2, 5, 3, 6),
(2, 5, 4, 7),
(3, 6, 5, 9),
(3, 6, 6, 11),
(3, 6, 7, 13),
(3, 7, 5, 10),
(3, 7, 6, 12),
(3, 7, 7, 13),
(3, 8, 5, 10),
(3, 8, 6, 11),
(3, 8, 7, 14),
(3, 9, 5, 9),
(3, 9, 6, 12),
(3, 9, 7, 15),
(5, 10, 8, 16),
(5, 10, 9, 19),
(5, 10, 10, 23),
(7, 11, 11, 25),
(7, 11, 12, 29),
(7, 11, 13, 32),
(7, 11, 14, 34),
(7, 12, 11, 26),
(7, 12, 12, 30),
(7, 12, 13, 32),
(7, 12, 14, 34),
(7, 13, 11, 28),
(7, 13, 12, 31),
(7, 13, 13, 33),
(7, 13, 14, 35),
(7, 14, 11, 27),
(7, 14, 12, 30),
(7, 14, 13, 32),
(7, 14, 14, 35),
(10, 17, 15, 36),
(10, 17, 16, 38),
(10, 18, 15, 37),
(10, 18, 16, 39),
(11, 19, 17, 46),
(11, 19, 18, 47),
(11, 19, 19, 49),
(11, 20, 17, 45),
(11, 20, 18, 47),
(11, 20, 19, 49);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

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
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `custom_feature_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sell`
--
ALTER TABLE `sell`
  MODIFY `sell_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sub_category`
--
ALTER TABLE `sub_category`
  MODIFY `sub_category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `variant`
--
ALTER TABLE `variant`
  MODIFY `variant_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `variant_option`
--
ALTER TABLE `variant_option`
  MODIFY `option_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `variant_option_values`
--
ALTER TABLE `variant_option_values`
  MODIFY `value_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

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
