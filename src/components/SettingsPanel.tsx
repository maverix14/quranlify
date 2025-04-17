
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SettingsPanelProps {
  className?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ className }) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={className}
    >
      <Settings size={20} />
    </Button>
  );
};

export default SettingsPanel;
