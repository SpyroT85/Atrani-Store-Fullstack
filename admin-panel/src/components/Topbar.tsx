import { FiSun, FiMoon } from 'react-icons/fi';
import Button from './Button';

interface TopbarProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function Topbar({ dark, onToggleDark }: TopbarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-medium">Products</h1>
      <Button variant="edit" onClick={onToggleDark} icon={dark ? <FiSun /> : <FiMoon />}>
        {dark ? 'Light' : 'Dark'}
      </Button>
    </div>
  );
}