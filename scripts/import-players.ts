import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface PlayerData {
  Name: string;
  Age: string;
  Category: string;
  Ph: string;
  PlayerType?: string;
}

const TEAMS = [
  { name: 'Bellandur Sharks', logo: 'BELLANDUR-SHARKS.jpeg' },
  { name: 'Bellandur Bulldozers', logo: 'BellandurBulldozers.jpeg' },
  { name: 'Bellandur Phoenix', logo: 'BellandurPhoenix.jpeg' },
  { name: 'Bellandur Riders', logo: 'BellandurRiders.jpeg' },
  { name: 'Bellandur Monsters', logo: 'BM-Bellandur-Monsters.jpeg' },
  { name: 'MR Titans', logo: 'MR-Titans.jpeg' },
  { name: 'OG Cricketers', logo: 'OG-CRICKETERS.jpeg' },
  { name: 'RCB', logo: 'RCB.jpeg' },
  { name: 'Royal Tiger Bellandur', logo: 'Royal-Tiger-Bellandur.jpeg' },
  { name: 'Super Giants Bellandur', logo: 'SUPER-GIANTS-BELLANDUR.jpeg' },
  { name: 'Uppi Super Avengers', logo: 'USA Uppi-Super-Avengers.jpeg' },
  { name: 'YKR Cricketers', logo: 'YKR-CRICKETERS.jpeg' },
];

async function seedTeams() {
  console.log('Seeding teams...');
  
  for (const team of TEAMS) {
    const { data, error } = await supabase
      .from('teams')
      .upsert({
        name: team.name,
        logo_url: `/assets/teams/${team.logo}`,
        base_budget: 100000,
        current_balance: 100000,
        players_count: 0,
      }, {
        onConflict: 'name',
      });

    if (error) {
      console.error(`Error seeding team ${team.name}:`, error);
    } else {
      console.log(`✓ Seeded team: ${team.name}`);
    }
  }
}

async function seedPlayers() {
  console.log('Seeding players...');
  
  const playersDataPath = path.join(__dirname, '../../bcl/output/players_data.json');
  const playersData: PlayerData[] = JSON.parse(fs.readFileSync(playersDataPath, 'utf-8'));

  const playersDir = path.join(__dirname, '../../bcl/output');
  const defaultPhoto = '/assets/player-template.png';

  for (const playerData of playersData) {
    const phone = playerData.Ph.replace(/\D/g, '');
    const photoPath = path.join(playersDir, `${phone}.jpg`);
    const photoUrl = fs.existsSync(photoPath)
      ? `/assets/players/${phone}.jpg`
      : defaultPhoto;

    const { error } = await supabase
      .from('players')
      .upsert({
        name: playerData.Name || 'Unknown',
        age: playerData.Age || '',
        category: playerData.Category || 'All Rounder',
        phone: phone,
        photo_url: photoUrl,
        player_type: playerData.PlayerType || 'Regular',
        base_price: 2000,
        status: 'unsold',
      }, {
        onConflict: 'phone',
      });

    if (error) {
      console.error(`Error seeding player ${playerData.Name}:`, error);
    }
  }

  console.log(`✓ Seeded ${playersData.length} players`);
}

async function main() {
  try {
    await seedTeams();
    await seedPlayers();
    console.log('\n✅ Seeding completed!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
