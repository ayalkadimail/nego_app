import { useUser } from '../../context/UserContext';

export default function DevUserSwitcher() {
  const { userId, setUserId } = useUser();

  return (
    <div className="fixed bottom-2 right-2 z-50 bg-navy-950 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-2 shadow-lg">
      <span>X-User-Id (dev) :</span>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-10 text-black px-1 rounded"
      />
    </div>
  );
}