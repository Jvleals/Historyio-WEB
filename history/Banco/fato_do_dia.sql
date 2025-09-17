-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2025 at 06:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fato_do_dia`
--

-- --------------------------------------------------------

--
-- Table structure for table `perguntas`
--

CREATE TABLE `perguntas` (
  `id` int(11) NOT NULL,
  `texto` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perguntas`
--

INSERT INTO `perguntas` (`id`, `texto`) VALUES
(1, 'Data que se teve a independência do Brasil'),
(2, 'Evento que marca o fim do absolutismo na França'),
(3, 'Quem pintou a Mona Lisa?'),
(4, 'Em que país fica a Torre Eiffel?');

-- --------------------------------------------------------

--
-- Table structure for table `respostas`
--

CREATE TABLE `respostas` (
  `id` int(11) NOT NULL,
  `texto` varchar(300) NOT NULL,
  `pergunta_id` int(11) NOT NULL,
  `correta` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `respostas`
--

INSERT INTO `respostas` (`id`, `texto`, `pergunta_id`, `correta`) VALUES
(1, '1822', 1, 1),
(2, '1945', 1, 0),
(3, '1889', 1, 0),
(4, '1760', 1, 0),
(5, '1900', 1, 0),
(6, 'Revolução Francesa', 2, 1),
(7, 'As grandes guerras', 2, 0),
(8, 'Guerra dos 100 anos', 2, 0),
(9, 'A comuna de Paris', 2, 0),
(10, 'Revolta na Martinica', 2, 0),
(11, 'Leonardo da Vinci', 3, 1),
(12, 'Pablo Picasso', 3, 0),
(13, 'Vincent Van Gogh', 3, 0),
(14, 'Claude Monet', 3, 0),
(15, 'Salvador Dalí', 3, 0),
(16, 'França', 4, 1),
(17, 'Itália', 4, 0),
(18, 'Espanha', 4, 0),
(19, 'Alemanha', 4, 0),
(20, 'Inglaterra', 4, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `perguntas`
--
ALTER TABLE `perguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `respostas`
--
ALTER TABLE `respostas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `perguntas`
--
ALTER TABLE `perguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `respostas`
--
ALTER TABLE `respostas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `respostas`
--
ALTER TABLE `respostas`
  ADD CONSTRAINT `respostas_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
