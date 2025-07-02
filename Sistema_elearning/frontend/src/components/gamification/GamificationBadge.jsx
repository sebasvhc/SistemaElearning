export default function GamificationBadge({ user }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-2">Tu Progreso</h3>
      <div className="flex items-center space-x-4">
        <div className="bg-yellow-100 p-3 rounded-full">
          <span className="text-yellow-800 font-bold text-xl">🏆</span>
        </div>
        <div>
          <p className="font-medium">{user.xp || 0} XP</p>
          <p className="text-sm text-gray-600">Nivel {Math.floor((user.xp || 0) / 1000)}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Insignias</h4>
        <div className="flex flex-wrap gap-2">
          {user.badges?.length > 0 ? (
            user.badges.map((badge, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {badge}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">Aún no tienes insignias</p>
          )}
        </div>
      </div>
    </div>
  );
}