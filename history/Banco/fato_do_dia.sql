-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2025 at 03:34 PM
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
-- Table structure for table `historico_jogos`
--

CREATE TABLE `historico_jogos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `modo_jogo` enum('diario','ilimitado') NOT NULL,
  `pontos_ganhos` int(11) DEFAULT 0,
  `acertou` tinyint(1) NOT NULL,
  `data_jogo` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jogadas_diarias`
--

CREATE TABLE `jogadas_diarias` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `pergunta_dia_id` int(11) NOT NULL,
  `vidas_restantes` int(11) NOT NULL,
  `pontos` int(11) NOT NULL,
  `acertou` tinyint(1) NOT NULL,
  `data_jogo` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Em que ano o Brasil foi descoberto pelos portugueses?'),
(2, 'Quem foi o primeiro governador-geral do Brasil?'),
(3, 'Qual foi o principal produto econômico do Brasil no período colonial?'),
(4, 'Em que ano a família real portuguesa chegou ao Brasil?'),
(5, 'Quem proclamou a Independência do Brasil?'),
(6, 'Qual foi o último imperador do Brasil?'),
(7, 'Em que ano foi proclamada a República no Brasil?'),
(8, 'Qual era o nome da operação que trouxe a família real portuguesa para o Brasil?'),
(9, 'Quem foi Tiradentes e qual seu papel na Inconfidência Mineira?'),
(10, 'Qual tratado estabeleceu os limites do Brasil após a independência?'),
(11, 'Qual foi o primeiro nome dado ao Brasil pelos portugueses?'),
(12, 'Qual ciclo econômico sucedeu o ciclo do açúcar no Brasil Colonial?'),
(13, 'O que foi a Guerra dos Emboabas?'),
(14, 'Qual o principal objetivo das Bandeiras?'),
(15, 'O que estabelecia o Tratado de Tordesilhas?'),
(16, 'Qual cidade foi a primeira capital do Brasil?'),
(17, 'Qual foi a data da coroação de Dom Pedro I como imperador?'),
(18, 'O que foi a Confederação do Equador?'),
(19, 'Qual lei colocou fim ao tráfico de escravizados para o Brasil?'),
(20, 'O que foi a Revolução Farroupilha?'),
(21, 'Qual o nome do período em que Dom Pedro II assumiu o trono antes da maioridade?'),
(22, 'Qual lei deu fim à escravidão no Brasil?'),
(23, 'Quem foi o primeiro presidente do Brasil?'),
(24, 'O que foi a Política dos Governadores?'),
(25, 'Qual movimento armado contestou as eleições de 1910?'),
(26, 'O que foi a Coluna Prestes?'),
(27, 'Quando foi promulgada a atual Constituição brasileira?'),
(28, 'Qual presidente implementou o Plano Real?'),
(29, 'Qual foi o principal produto de exportação durante o ciclo da borracha?'),
(30, 'O que foi o \"Encilhamento\"?'),
(31, 'Qual plano econômico congelou preços e salários em 1986?'),
(32, 'Quando foi criada a Petrobras?'),
(33, 'O que foi a \"Década Perdida\" na economia brasileira?'),
(34, 'Qual o nome do primeiro Ato Institucional da ditadura militar?'),
(35, 'O que foi o \"Milagre Econômico\" brasileiro?'),
(36, 'Qual o nome da lei que restabeleceu o pluripartidarismo no Brasil?'),
(37, 'O que foram os \"anos de chumbo\"?'),
(38, 'Qual presidente militar iniciou a abertura política?'),
(39, 'Quantos anos durou o Estado Novo?'),
(40, 'O que foi a CLT e quando foi criada?'),
(41, 'Qual foi o principal movimento opositor a Vargas em 1935?'),
(42, 'Que empresa estatal foi criada durante o governo Vargas?'),
(43, 'Como terminou o primeiro governo de Vargas?'),
(44, 'Em que ano o Brasil declarou guerra aos países do Eixo?'),
(45, 'Qual foi a principal contribuição brasileira na Segunda Guerra?'),
(46, 'O que foi o Navio \"Vital de Oliveira\" na Primeira Guerra?'),
(47, 'Quantos soldados brasileiros integraram a FEB?'),
(48, 'Qual o único navio brasileiro afundado por um submarino alemão na 2ª Guerra?'),
(49, 'Qual presidente brasileiro rompeu relações com Cuba em 1964?'),
(50, 'O que foi a \"Operação Brother Sam\"?'),
(51, 'Qual o alinhamento do Brasil durante a maior parte da Guerra Fria?'),
(52, 'O que foi o Acordo Nuclear Brasil-Alemanha?'),
(53, 'Qual presidente visitou a China em 1995, marcando nova política externa?');

-- --------------------------------------------------------

--
-- Table structure for table `perguntas_do_dia`
--

CREATE TABLE `perguntas_do_dia` (
  `id` int(11) NOT NULL,
  `data` date NOT NULL,
  `pergunta_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perguntas_do_dia`
--

INSERT INTO `perguntas_do_dia` (`id`, `data`, `pergunta_id`, `created_at`) VALUES
(1, '2025-10-04', 3, '2025-10-04 20:13:19');

-- --------------------------------------------------------

--
-- Table structure for table `pergunta_do_dia`
--

CREATE TABLE `pergunta_do_dia` (
  `id` int(11) NOT NULL,
  `pergunta_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pontuacoes`
--

CREATE TABLE `pontuacoes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `modo_jogo` enum('diario','ilimitado') NOT NULL,
  `pontos` int(11) NOT NULL,
  `data_pontuacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pontuacoes`
--

INSERT INTO `pontuacoes` (`id`, `usuario_id`, `modo_jogo`, `pontos`, `data_pontuacao`) VALUES
(1, 2, 'ilimitado', 0, '2025-10-04 21:32:09'),
(2, 2, 'ilimitado', 0, '2025-10-04 21:32:15'),
(3, 2, 'ilimitado', 10, '2025-10-04 21:32:20'),
(4, 2, 'ilimitado', 10, '2025-10-04 21:32:27'),
(5, 2, 'ilimitado', 0, '2025-10-04 21:32:33'),
(6, 2, 'ilimitado', 10, '2025-10-04 21:32:41');

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
(1, '1500', 1, 1),
(2, '1492', 1, 0),
(3, '1502', 1, 0),
(4, '1498', 1, 0),
(5, '1510', 1, 0),
(6, 'Tomé de Sousa', 2, 1),
(7, 'Duarte da Costa', 2, 0),
(8, 'Mem de Sá', 2, 0),
(9, 'Martim Afonso de Sousa', 2, 0),
(10, 'Cristóvão Jacques', 2, 0),
(11, 'Açúcar', 3, 1),
(12, 'Café', 3, 0),
(13, 'Ouro', 3, 0),
(14, 'Algodão', 3, 0),
(15, 'Borracha', 3, 0),
(16, '1808', 4, 1),
(17, '1822', 4, 0),
(18, '1815', 4, 0),
(19, '1798', 4, 0),
(20, '1831', 4, 0),
(21, 'Dom Pedro I', 5, 1),
(22, 'Dom João VI', 5, 0),
(23, 'José Bonifácio', 5, 0),
(24, 'Dom Pedro II', 5, 0),
(25, 'Tiradentes', 5, 0),
(26, 'Dom Pedro II', 6, 1),
(27, 'Dom Pedro I', 6, 0),
(28, 'Dom João VI', 6, 0),
(29, 'Princesa Isabel', 6, 0),
(30, 'Dom Miguel', 6, 0),
(31, '1889', 7, 1),
(32, '1822', 7, 0),
(33, '1840', 7, 0),
(34, '1870', 7, 0),
(35, '1891', 7, 0),
(36, 'Transferência da Corte Portuguesa', 8, 1),
(37, 'Invasão Napoleônica', 8, 0),
(38, 'Fuga para o Brasil', 8, 0),
(39, 'Missão Francesa', 8, 0),
(40, 'Revolução do Porto', 8, 0),
(41, 'Líder da Inconfidência Mineira e mártir da independência', 9, 1),
(42, 'Primeiro presidente do Brasil', 9, 0),
(43, 'Descobridor do ouro em Minas Gerais', 9, 0),
(44, 'Fundador de São Paulo', 9, 0),
(45, 'Líder da Balaiada', 9, 0),
(46, 'Tratado de Madrid', 10, 1),
(47, 'Tratado de Tordesilhas', 10, 0),
(48, 'Tratado de Petrópolis', 10, 0),
(49, 'Tratado de Utrecht', 10, 0),
(50, 'Tratado de Paris', 10, 0),
(51, 'Ilha de Vera Cruz', 11, 1),
(52, 'Terra de Santa Cruz', 11, 0),
(53, 'Pindorama', 11, 0),
(54, 'Brasil Colônia', 11, 0),
(55, 'Novo Mundo', 11, 0),
(56, 'Ciclo do ouro', 12, 1),
(57, 'Ciclo do café', 12, 0),
(58, 'Ciclo da borracha', 12, 0),
(59, 'Ciclo do algodão', 12, 0),
(60, 'Ciclo industrial', 12, 0),
(61, 'Conflito pela posse das minas de ouro em Minas Gerais', 13, 1),
(62, 'Guerra contra os holandeses', 13, 0),
(63, 'Revolta de escravizados', 13, 0),
(64, 'Conflito entre portugueses e espanhóis', 13, 0),
(65, 'Guerra pela independência', 13, 0),
(66, 'Capturar indígenas e procurar metais preciosos', 14, 1),
(67, 'Explorar a costa brasileira', 14, 0),
(68, 'Combater os holandeses', 14, 0),
(69, 'Fundar novas cidades', 14, 0),
(70, 'Evangelizar os nativos', 14, 0),
(71, 'Divisão do mundo entre Portugal e Espanha', 15, 1),
(72, 'Independência do Brasil', 15, 0),
(73, 'Fim da escravidão', 15, 0),
(74, 'Criação do Mercosul', 15, 0),
(75, 'Chegada da família real', 15, 0),
(76, 'Salvador', 16, 1),
(77, 'Rio de Janeiro', 16, 0),
(78, 'São Paulo', 16, 0),
(79, 'Recife', 16, 0),
(80, 'Olinda', 16, 0),
(81, '1 de dezembro de 1822', 17, 1),
(82, '7 de setembro de 1822', 17, 0),
(83, '25 de março de 1824', 17, 0),
(84, '15 de novembro de 1889', 17, 0),
(85, '9 de janeiro de 1822', 17, 0),
(86, 'Movimento republicano no Nordeste em 1824', 18, 1),
(87, 'Aliança de províncias do Sul', 18, 0),
(88, 'Tratado comercial com a Inglaterra', 18, 0),
(89, 'Revolta de escravizados', 18, 0),
(90, 'Movimento pela independência', 18, 0),
(91, 'Lei Eusébio de Queirós (1850)', 19, 1),
(92, 'Lei Áurea (1888)', 19, 0),
(93, 'Lei do Ventre Livre (1871)', 19, 0),
(94, 'Lei dos Sexagenários (1885)', 19, 0),
(95, 'Lei Bill Aberdeen (1845)', 19, 0),
(96, 'Guerra civil no Rio Grande do Sul (1835-1845)', 20, 1),
(97, 'Revolta em Pernambuco', 20, 0),
(98, 'Movimento pela independência', 20, 0),
(99, 'Guerra contra o Paraguai', 20, 0),
(100, 'Revolta contra a cobrança de impostos', 20, 0),
(101, 'Regência (1831-1840)', 21, 1),
(102, 'Estado Novo', 21, 0),
(103, 'República Velha', 21, 0),
(104, 'Governo Provisório', 21, 0),
(105, 'Período Joanino', 21, 0),
(106, 'Lei Áurea (1888)', 22, 1),
(107, 'Lei do Ventre Livre (1871)', 22, 0),
(108, 'Lei Eusébio de Queirós (1850)', 22, 0),
(109, 'Lei dos Sexagenários (1885)', 22, 0),
(110, 'Constituição de 1824', 22, 0),
(111, 'Marechal Deodoro da Fonseca', 23, 1),
(112, 'Marechal Floriano Peixoto', 23, 0),
(113, 'Prudente de Morais', 23, 0),
(114, 'Campos Sales', 23, 0),
(115, 'Getúlio Vargas', 23, 0),
(116, 'Acordo entre presidente e governadores', 24, 1),
(117, 'Política de industrialização', 24, 0),
(118, 'Reforma agrária', 24, 0),
(119, 'Política externa', 24, 0),
(120, 'Sistema educacional', 24, 0),
(121, 'Revolta da Chibata', 25, 1),
(122, 'Guerra de Canudos', 25, 0),
(123, 'Revolta da Armada', 25, 0),
(124, 'Coluna Prestes', 25, 0),
(125, 'Revolução Federalista', 25, 0),
(126, 'Movimento tenentista pelo interior do Brasil', 26, 1),
(127, 'Revolta de oficiais da Marinha', 26, 0),
(128, 'Movimento operário', 26, 0),
(129, 'Revolta de escravizados', 26, 0),
(130, 'Movimento estudantil', 26, 0),
(131, '1988', 27, 1),
(132, '1891', 27, 0),
(133, '1934', 27, 0),
(134, '1946', 27, 0),
(135, '1967', 27, 0),
(136, 'Fernando Henrique Cardoso', 28, 1),
(137, 'Itamar Franco', 28, 0),
(138, 'Fernando Collor', 28, 0),
(139, 'José Sarney', 28, 0),
(140, 'Dilma Rousseff', 28, 0),
(141, 'Látex da seringueira', 29, 1),
(142, 'Café', 29, 0),
(143, 'Açúcar', 29, 0),
(144, 'Ouro', 29, 0),
(145, 'Algodão', 29, 0),
(146, 'Política econômica de Rui Barbosa', 30, 1),
(147, 'Ciclo do ouro', 30, 0),
(148, 'Plano Cruzado', 30, 0),
(149, 'Reforma monetária', 30, 0),
(150, 'Política industrial', 30, 0),
(151, 'Plano Cruzado', 31, 1),
(152, 'Plano Real', 31, 0),
(153, 'Plano Collor', 31, 0),
(154, 'Plano Verão', 31, 0),
(155, 'PAEG', 31, 0),
(156, '1953', 32, 1),
(157, '1930', 32, 0),
(158, '1940', 32, 0),
(159, '1960', 32, 0),
(160, '1970', 32, 0),
(161, 'Década de 1980', 33, 1),
(162, 'Década de 1970', 33, 0),
(163, 'Década de 1990', 33, 0),
(164, 'Década de 1960', 33, 0),
(165, 'Década de 1950', 33, 0),
(166, 'AI-1', 34, 1),
(167, 'AI-5', 34, 0),
(168, 'AI-2', 34, 0),
(169, 'AI-3', 34, 0),
(170, 'AI-4', 34, 0),
(171, 'Crescimento acelerado (1968-1973)', 35, 1),
(172, 'Plano Real', 35, 0),
(173, 'Industrialização nos anos 50', 35, 0),
(174, 'Era Vargas', 35, 0),
(175, 'República Velha', 35, 0),
(176, 'Lei nº 6.767/1979', 36, 1),
(177, 'AI-5', 36, 0),
(178, 'Constituição de 1988', 36, 0),
(179, 'Lei de Anistia', 36, 0),
(180, 'Lei de Segurança Nacional', 36, 0),
(181, 'Período mais repressivo (1968-1974)', 37, 1),
(182, 'Era Vargas', 37, 0),
(183, 'República Velha', 37, 0),
(184, 'Governo JK', 37, 0),
(185, 'Governo Collor', 37, 0),
(186, 'General Ernesto Geisel', 38, 1),
(187, 'General Costa e Silva', 38, 0),
(188, 'Marechal Castelo Branco', 38, 0),
(189, 'General Médici', 38, 0),
(190, 'General Figueiredo', 38, 0),
(191, '8 anos (1937-1945)', 39, 1),
(192, '5 anos', 39, 0),
(193, '10 anos', 39, 0),
(194, '15 anos', 39, 0),
(195, '3 anos', 39, 0),
(196, 'Consolidação das Leis do Trabalho (1943)', 40, 1),
(197, 'Código Civil Brasileiro', 40, 0),
(198, 'Constituição de 1934', 40, 0),
(199, 'Lei de Segurança Nacional', 40, 0),
(200, 'Código de Processo Civil', 40, 0),
(201, 'Intentona Comunista', 41, 1),
(202, 'Revolta Paulista', 41, 0),
(203, 'Golpe Integralista', 41, 0),
(204, 'Movimento Tenentista', 41, 0),
(205, 'Revolta da Armada', 41, 0),
(206, 'Vale do Rio Doce', 42, 1),
(207, 'Embraer', 42, 0),
(208, 'Telebras', 42, 0),
(209, 'Eletrobras', 42, 0),
(210, 'Petrobras', 42, 0),
(211, 'Suicídio em 1954', 43, 1),
(212, 'Golpe militar', 43, 0),
(213, 'Impeachment', 43, 0),
(214, 'Renúncia', 43, 0),
(215, 'Fim do mandato', 43, 0),
(216, '1942', 44, 1),
(217, '1939', 44, 0),
(218, '1941', 44, 0),
(219, '1943', 44, 0),
(220, '1944', 44, 0),
(221, 'Força Expedicionária Brasileira (FEB)', 45, 1),
(222, 'Marinha de guerra', 45, 0),
(223, 'Força Aérea', 45, 0),
(224, 'Suprimentos médicos', 45, 0),
(225, 'Tropas navais', 45, 0),
(226, 'Navio brasileiro torpedeado na 1ª Guerra', 46, 1),
(227, 'Navio da FEB', 46, 0),
(228, 'Navio presidencial', 46, 0),
(229, 'Navio mercante', 46, 0),
(230, 'Navio de guerra alemão', 46, 0),
(231, 'Cerca de 25.000', 47, 1),
(232, '10.000', 47, 0),
(233, '50.000', 47, 0),
(234, '100.000', 47, 0),
(235, '5.000', 47, 0),
(236, 'Vital de Oliveira', 48, 1),
(237, 'Minas Gerais', 48, 0),
(238, 'São Paulo', 48, 0),
(239, 'Bahia', 48, 0),
(240, 'Rio de Janeiro', 48, 0),
(241, 'Castelo Branco', 49, 1),
(242, 'Jânio Quadros', 49, 0),
(243, 'João Goulart', 49, 0),
(244, 'Costa e Silva', 49, 0),
(245, 'JK', 49, 0),
(246, 'Apoio dos EUA ao golpe de 1964', 50, 1),
(247, 'Missão brasileira na ONU', 50, 0),
(248, 'Programa nuclear', 50, 0),
(249, 'Missão de paz', 50, 0),
(250, 'Acordo comercial', 50, 0),
(251, 'Alinhamento com os EUA', 51, 1),
(252, 'Neutralidade', 51, 0),
(253, 'Alinhamento com URSS', 51, 0),
(254, 'Terceira via', 51, 0),
(255, 'Não alinhado', 51, 0),
(256, '1975', 52, 1),
(257, '1960', 52, 0),
(258, '1980', 52, 0),
(259, '1990', 52, 0),
(260, '2000', 52, 0),
(261, 'Fernando Henrique Cardoso', 53, 1),
(262, 'Itamar Franco', 53, 0),
(263, 'Fernando Collor', 53, 0),
(264, 'Lula', 53, 0),
(265, 'Dilma Rousseff', 53, 0);

-- --------------------------------------------------------

--
-- Table structure for table `respostas_usuarios`
--

CREATE TABLE `respostas_usuarios` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `pergunta_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `acertou` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `respostas_usuarios`
--

INSERT INTO `respostas_usuarios` (`id`, `usuario_id`, `pergunta_id`, `data`, `acertou`, `created_at`) VALUES
(1, 1, 3, '2025-10-04', 1, '2025-10-04 20:13:32');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_stats`
--

CREATE TABLE `user_stats` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `pontos_totais` int(11) DEFAULT 0,
  `pontos_diarios` int(11) DEFAULT 0,
  `pontos_ilimitados` int(11) DEFAULT 0,
  `total_acertos` int(11) DEFAULT 0,
  `total_erros` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_stats`
--

INSERT INTO `user_stats` (`id`, `usuario_id`, `pontos_totais`, `pontos_diarios`, `pontos_ilimitados`, `total_acertos`, `total_erros`, `created_at`, `updated_at`) VALUES
(1, 2, 30, 0, 30, 3, 3, '2025-10-04 21:09:36', '2025-10-04 21:32:41'),
(2, 3, 0, 0, 0, 0, 0, '2025-10-05 14:33:28', '2025-10-05 14:33:28');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ofensiva_atual` int(11) DEFAULT 0,
  `recorde_ofensiva` int(11) DEFAULT 0,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password_hash`, `email`, `ofensiva_atual`, `recorde_ofensiva`, `data_criacao`, `updated_at`) VALUES
(1, '', '', NULL, 1, 1, '2025-10-04 20:13:32', '2025-10-04 20:53:43'),
(2, 'Jvls', '$2y$10$4gb9gdQQh4e6Yiuwf76bTOxcqhjj2s4SROqhNlADwmj8fiRTKKTI6', 'joaoleal@gmail.com', 0, 0, '2025-10-04 21:09:36', '2025-10-04 21:09:36'),
(3, 'Leandro', '$2y$10$WNuzX0k5.ZyAetdDoOSiVuD8VNWzZkpCIMRvoE03J69KQZl7cxbzy', 'joaolegal@gmail.com', 0, 0, '2025-10-05 14:33:28', '2025-10-05 14:33:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `historico_jogos`
--
ALTER TABLE `historico_jogos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `jogadas_diarias`
--
ALTER TABLE `jogadas_diarias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_jogada_dia` (`usuario_id`,`data_jogo`),
  ADD KEY `pergunta_dia_id` (`pergunta_dia_id`);

--
-- Indexes for table `perguntas`
--
ALTER TABLE `perguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perguntas_do_dia`
--
ALTER TABLE `perguntas_do_dia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `data` (`data`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- Indexes for table `pergunta_do_dia`
--
ALTER TABLE `pergunta_do_dia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `data` (`data`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- Indexes for table `pontuacoes`
--
ALTER TABLE `pontuacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_pontuacao_data` (`data_pontuacao`);

--
-- Indexes for table `respostas`
--
ALTER TABLE `respostas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- Indexes for table `respostas_usuarios`
--
ALTER TABLE `respostas_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_resposta_dia` (`usuario_id`,`data`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_pontos_totais` (`pontos_totais`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `historico_jogos`
--
ALTER TABLE `historico_jogos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jogadas_diarias`
--
ALTER TABLE `jogadas_diarias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `perguntas`
--
ALTER TABLE `perguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `perguntas_do_dia`
--
ALTER TABLE `perguntas_do_dia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pergunta_do_dia`
--
ALTER TABLE `pergunta_do_dia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pontuacoes`
--
ALTER TABLE `pontuacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `respostas`
--
ALTER TABLE `respostas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=266;

--
-- AUTO_INCREMENT for table `respostas_usuarios`
--
ALTER TABLE `respostas_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_stats`
--
ALTER TABLE `user_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `historico_jogos`
--
ALTER TABLE `historico_jogos`
  ADD CONSTRAINT `historico_jogos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jogadas_diarias`
--
ALTER TABLE `jogadas_diarias`
  ADD CONSTRAINT `jogadas_diarias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `jogadas_diarias_ibfk_2` FOREIGN KEY (`pergunta_dia_id`) REFERENCES `pergunta_do_dia` (`id`);

--
-- Constraints for table `perguntas_do_dia`
--
ALTER TABLE `perguntas_do_dia`
  ADD CONSTRAINT `perguntas_do_dia_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas` (`id`);

--
-- Constraints for table `pergunta_do_dia`
--
ALTER TABLE `pergunta_do_dia`
  ADD CONSTRAINT `pergunta_do_dia_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas` (`id`);

--
-- Constraints for table `pontuacoes`
--
ALTER TABLE `pontuacoes`
  ADD CONSTRAINT `pontuacoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `respostas`
--
ALTER TABLE `respostas`
  ADD CONSTRAINT `respostas_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `respostas_usuarios`
--
ALTER TABLE `respostas_usuarios`
  ADD CONSTRAINT `respostas_usuarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `respostas_usuarios_ibfk_2` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas` (`id`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
