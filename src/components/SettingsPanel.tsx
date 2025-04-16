
import React from 'react';
import { useQuran } from '../contexts/QuranContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useQuran();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="btn-glass absolute top-4 right-4"
        >
          <Settings size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        
        <div className="grid gap-6 py-6">
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
