SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `db_authentication` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `db_authentication`;

DROP TABLE IF EXISTS `t_users`;
CREATE TABLE `t_users` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `useName` varchar(255) NOT NULL,
  `useFirst_Name` varchar(255) NOT NULL,
  `usePassword` varchar(255) NOT NULL,
  `usePseudo` varchar(255) NOT NULL,
  `useEmail` varchar(255) NOT NULL,
  `isAdmin` BOOLEAN NOT NULL DEFAULT FALSE,
  `salt` varchar(255) NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `idx_unique_name` (`useName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `t_users` (`useName`, `useFirst_Name`, `usePassword`, `usePseudo`, `useEmail`, `isAdmin`, `salt`) VALUES
('Boule', 'John', '1234', 'john_boul', 'john@gmail.com', 'true', 'john123', 'weaeew');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
