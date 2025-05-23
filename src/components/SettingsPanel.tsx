import React from 'react';
import { useQuran } from '../contexts/QuranContext';
import { useTheme } from '../contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Moon, Sun } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SettingsPanelProps {
  className?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ className }) => {
  const { settings, updateSettings } = useQuran();
  const { theme, toggleTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={className}
        >
          <Settings size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-card">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your Quran reading experience
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-6 py-6">
          <div className="flex items-center justify-between">
            <label htmlFor="theme" className="text-sm font-medium flex items-center gap-2">
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              Dark Mode
            </label>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="auto-play" className="text-sm font-medium">
              Auto-play Audio
            </label>
            <Switch
              id="auto-play"
              checked={settings.autoPlayAudio}
              onCheckedChange={(checked) => 
                updateSettings({ autoPlayAudio: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="show-translation" className="text-sm font-medium">
              Show Translation
            </label>
            <Switch
              id="show-translation"
              checked={settings.showTranslation}
              onCheckedChange={(checked) => 
                updateSettings({ showTranslation: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="show-transliteration" className="text-sm font-medium">
              Show Transliteration
            </label>
            <Switch
              id="show-transliteration"
              checked={settings.showTransliteration}
              onCheckedChange={(checked) => 
                updateSettings({ showTransliteration: checked })
              }
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="font-size" className="text-sm font-medium block">
              Font Size
            </label>
            <Slider
              id="font-size"
              min={0.75}
              max={1.5}
              step={0.25}
              value={[settings.fontSize]}
              onValueChange={(value) => 
                updateSettings({ fontSize: value[0] })
              }
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Smaller</span>
              <span>Larger</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
