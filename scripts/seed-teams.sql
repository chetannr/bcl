-- Seed 12 teams with ₹1,00,000 budget each

INSERT INTO teams (name, logo_url, base_budget, current_balance, players_count) VALUES
('Bellandur Sharks', '/assets/teams/BELLANDUR-SHARKS.jpeg', 100000, 100000, 0),
('Bellandur Bulldozers', '/assets/teams/BellandurBulldozers.jpeg', 100000, 100000, 0),
('Bellandur Phoenix', '/assets/teams/BellandurPhoenix.jpeg', 100000, 100000, 0),
('Bellandur Riders', '/assets/teams/BellandurRiders.jpeg', 100000, 100000, 0),
('Bellandur Monsters', '/assets/teams/BM-Bellandur-Monsters.jpeg', 100000, 100000, 0),
('MR Titans', '/assets/teams/MR-Titans.jpeg', 100000, 100000, 0),
('OG Cricketers', '/assets/teams/OG-CRICKETERS.jpeg', 100000, 100000, 0),
('RCB', '/assets/teams/RCB.jpeg', 100000, 100000, 0),
('Royal Tiger Bellandur', '/assets/teams/Royal-Tiger-Bellandur.jpeg', 100000, 100000, 0),
('Super Giants Bellandur', '/assets/teams/SUPER-GIANTS-BELLANDUR.jpeg', 100000, 100000, 0),
('Uppi Super Avengers', '/assets/teams/USA Uppi-Super-Avengers.jpeg', 100000, 100000, 0),
('YKR Cricketers', '/assets/teams/YKR-CRICKETERS.jpeg', 100000, 100000, 0)
ON CONFLICT (name) DO NOTHING;
