import { useState, useEffect, ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import tankData from '@/data/tankData';
import { TankData } from '@/data/tankData';
import TankVisual from './TankVisual';

interface TankSelectionProps {
  selectedTank: TankData | null;
  selectedTankId: string;
  onSelectTank: (tankId: string) => void;
  fillPercentage: number;
}

const TankSelection = ({ 
  selectedTank, 
  selectedTankId, 
  onSelectTank, 
  fillPercentage 
}: TankSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [noMatch, setNoMatch] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Check if search term matches any tank
    const upperSearchTerm = value.toUpperCase();
    let found = false;

    // Find if the tank exists in our data
    for (const tankId of Object.keys(tankData)) {
      if (tankId.toUpperCase().startsWith(upperSearchTerm)) {
        onSelectTank(tankId);
        found = true;
        break;
      }
    }

    // If not found and there's a search term, show no match state
    if (!found && upperSearchTerm.length > 0) {
      setNoMatch(true);
    } else {
      setNoMatch(false);
    }
  };

  // Handle tank selection change
  const handleTankSelect = (value: string) => {
    setSearchTerm(value);
    onSelectTank(value);
    setNoMatch(false);
  };

  // Sync search term with selected tank
  useEffect(() => {
    if (selectedTankId) {
      setSearchTerm(selectedTankId);
    }
  }, [selectedTankId]);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-serif text-wine-700 mb-4 border-b border-wine-200 pb-2">Tank Selection</h2>
      
      <div className="mb-4">
        <Label htmlFor="searchTank" className="block text-sm font-medium text-gray-700 mb-1">Search Tank</Label>
        <Input
          id="searchTank"
          value={searchTerm}
          onChange={handleSearchChange}
          className={`w-full p-2 ${noMatch ? 'no-match border-wine-500' : ''}`}
          placeholder="Type to search..."
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="tankSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Tank</Label>
        <Select value={selectedTankId} onValueChange={handleTankSelect}>
          <SelectTrigger id="tankSelect" className="w-full">
            <SelectValue placeholder="-- Select a Tank --" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(tankData).map((tankId) => (
              <SelectItem key={tankId} value={tankId}>
                {tankId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tank Specifications */}
      {selectedTank && (
        <div className="p-4 bg-oak-50 rounded-lg border border-oak-200 mb-4">
          <h3 className="text-lg font-semibold text-oak-800 mb-2">Tank Specifications</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Gallons per Inch:</span>
              <span className="font-medium">{selectedTank.GALS_PER_INCH.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gallons in Top:</span>
              <span className="font-medium">{selectedTank.GALS_IN_TOP.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Top Inches:</span>
              <span className="font-medium">{selectedTank.TOP_INCHES.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Gallons:</span>
              <span className="font-medium">{selectedTank.TOTAL_GALS.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Tank Visual Representation */}
      <TankVisual fillPercentage={fillPercentage} />
    </div>
  );
};

export default TankSelection;
