import { getAssetPath } from '../../utils/assets';

interface TeamsTabProps {
  theme: 'dark' | 'light';
}

const STATIC_TEAMS = [
  {
    name: 'Bellandur Riders',
    abbreviation: 'Riders',
    logoPath: '/assets/teams/BellandurRiders.jpeg',
    group: 'A',
    description: 'Speed, agility, and determination define the Riders'
  },
  {
    name: 'Royal Challengers Bellandur',
    abbreviation: 'RCB',
    logoPath: '/assets/teams/RCB.jpeg',
    group: 'A',
    description: 'Bold challengers ready to dominate'
  },
  {
    name: 'Bellandur Phoenix',
    abbreviation: 'Phoenix',
    logoPath: '/assets/teams/BellandurPhoenix.jpeg',
    group: 'A',
    description: 'Rising from the ashes to claim victory'
  },
  {
    name: 'Bellandur Bulldozers',
    abbreviation: 'Bulldozers',
    logoPath: '/assets/teams/BellandurBulldozers.jpeg',
    group: 'A',
    description: 'Unstoppable force on the field'
  },
  {
    name: 'Uppi Super Avengers',
    abbreviation: 'USA',
    logoPath: '/assets/teams/USA Uppi-Super-Avengers.jpeg',
    group: 'A',
    description: 'Assembling champions for glory'
  },
  {
    name: 'Royal Tiger Bellandur',
    abbreviation: 'Royal Tiger',
    logoPath: '/assets/teams/Royal-Tiger-Bellandur.jpeg',
    group: 'A',
    description: 'Fierce competitors with royal pride'
  },
  {
    name: 'MR Titans',
    abbreviation: 'Titans',
    logoPath: '/assets/teams/MR-Titans.jpeg',
    group: 'B',
    description: 'Titans of strength and strategy'
  },
  {
    name: 'Bellandur Sharks',
    abbreviation: 'Sharks',
    logoPath: '/assets/teams/BELLANDUR-SHARKS.jpeg',
    group: 'B',
    description: 'Swift predators of the pitch'
  },
  {
    name: 'Bellandur Monsters',
    abbreviation: 'Monsters',
    logoPath: '/assets/teams/BM-Bellandur-Monsters.jpeg',
    group: 'B',
    description: 'Monstrous power and relentless spirit'
  },
  {
    name: 'OG Cricketers',
    abbreviation: 'OG',
    logoPath: '/assets/teams/OG-CRICKETERS.jpeg',
    group: 'B',
    description: 'Original champions with legacy'
  },
  {
    name: 'YKR Cricketers',
    abbreviation: 'YKR',
    logoPath: '/assets/teams/YKR-CRICKETERS.jpeg',
    group: 'B',
    description: 'Elite cricketers with unmatched skill'
  },
  {
    name: 'Bellandur Super Kings',
    abbreviation: 'Super Kings',
    logoPath: '/assets/teams/SUPER-GIANTS-BELLANDUR.jpeg',
    group: 'B',
    description: 'Giants ready to conquer the league'
  },
];

export function TeamsTab({ theme }: TeamsTabProps) {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          BCL 2025 Teams
        </h2>
        <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Competing in two groups for ultimate glory
        </p>
      </div>

      {/* Group A */}
      <div className="space-y-4">
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${
          isDark 
            ? 'bg-primary-900/30 text-white border border-primary-700/50' 
            : 'bg-primary-100 text-primary-900 border border-primary-200'
        }`}>
          <span className="text-lg font-bold">Group A</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {STATIC_TEAMS.filter(team => team.group === 'A').map((team) => (
            <div
              key={team.abbreviation}
              className={`${
                isDark ? 'bg-neutral-800 border-neutral-700 hover:border-primary-600' : 'bg-white border-neutral-200 hover:border-primary-400'
              } rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center space-y-4`}
            >
              {/* Emphasized Logo */}
              <div className={`w-32 h-32 flex items-center justify-center  ${
                isDark ? 'bg-neutral-900/50' : 'bg-neutral-50'
              } p-4 ring-4 ${
                isDark ? 'ring-primary-900/30' : 'ring-primary-100'
              }`}>
                <img
                  src={getAssetPath(team.logoPath)}
                  alt={team.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                  }}
                />
              </div>
              
              {/* Team Info */}
              <div className="space-y-2">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {team.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {team.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group B */}
      <div className="space-y-4">
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${
          isDark 
            ? 'bg-primary-900/30 text-white border border-primary-700/50' 
            : 'bg-primary-100 text-primary-900 border border-primary-200'
        }`}>
          <span className="text-lg font-bold">Group B</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {STATIC_TEAMS.filter(team => team.group === 'B').map((team) => (
            <div
              key={team.abbreviation}
              className={`${
                isDark ? 'bg-neutral-800 border-neutral-700 hover:border-primary-600' : 'bg-white border-neutral-200 hover:border-primary-400'
              } rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center space-y-4`}
            >
              {/* Emphasized Logo */}
              <div className={`w-32 h-32 flex items-center justify-center  ${
                isDark ? 'bg-neutral-900/50' : 'bg-neutral-50'
              } p-4 ring-4 `}>
                <img
                  src={getAssetPath(team.logoPath)}
                  alt={team.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                  }}
                />
              </div>
              
              {/* Team Info */}
              <div className="space-y-2">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {team.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {team.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
