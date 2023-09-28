CREATE TABLE `companies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('hosting','vpn') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hosting',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payments` json NOT NULL,
  `countries` json NOT NULL,
  `promo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `geoip` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isoCode` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anycast` tinyint DEFAULT '0',
  `hostname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `org` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asn` int unsigned DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `companyId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip_uidx` (`ip`),
  KEY `companyId_idx` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rules` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `hostname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `org` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asn` int unsigned DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company_idx` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
