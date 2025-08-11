import { useState, useCallback, useEffect } from "react";
import type { Level } from "./models/level";
import type { LevelState } from "./models/levelState";
import { buildInitialState } from "./logic/levelState";
import EditorBoardGrid from "./components/EditorBoardGrid";
import { demoLevel } from "./levels/demo";

export default function LevelEditor({ onBack }: { onBack: () => void }) {
  const [sides, setSides] = useState<number[]>([2, 3]);
  const [cards, setCards] = useState<number[]>([2, 3, 4, 5, 6, 9, 25]);
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [editMode, setEditMode] = useState<"place" | "given">("place");

  // Calculate total cells needed based on sides (matching BoardGrid logic)
  const calculateTotalCells = (sidesArray: number[]): number => {
    if (sidesArray.length === 0) return 0;
    if (sidesArray.length === 1) return 3; // Base case: innermost level uses 3 cells
    
    // Each additional level adds 5 more cells
    return 3 + (sidesArray.length - 1) * 5;
  };
  
  const totalCells = calculateTotalCells(sides);

  // Create a level and level state for the editor
  const [level, setLevel] = useState<Level>(() => ({
    sides: sides,
    given: [],
    solutions: Array(totalCells).fill(0),
    cards: cards,
  }));

  const [levelState, setLevelState] = useState<LevelState>(() => 
    buildInitialState(level)
  );

  // Update level and level state when sides or cards change
  useEffect(() => {
    const newLevel: Level = {
      sides: sides,
      given: level.given.filter(index => index < totalCells), // Keep only valid given indices
      solutions: Array.from({ length: totalCells }, (_, i) => level.solutions[i] || 0),
      cards: cards,
    };
    setLevel(newLevel);
    setLevelState(buildInitialState(newLevel));
  }, [sides, cards, totalCells]);

  const handleCellClick = useCallback((cellIndex: number) => {
    if (editMode === "place") {
      setLevel(prev => {
        const newSolutions = [...prev.solutions];
        newSolutions[cellIndex] = newSolutions[cellIndex] === selectedValue ? 0 : selectedValue;
        return { ...prev, solutions: newSolutions };
      });
      setLevelState(prev => {
        const newCellValues = [...prev.cellValues];
        newCellValues[cellIndex] = newCellValues[cellIndex] === selectedValue ? 0 : selectedValue;
        return { ...prev, cellValues: newCellValues };
      });
    } else if (editMode === "given") {
      setLevel(prev => {
        const newGiven = prev.given.includes(cellIndex)
          ? prev.given.filter(id => id !== cellIndex)
          : [...prev.given, cellIndex];
        return { ...prev, given: newGiven };
      });
      // Update level state to reflect given changes
      setLevelState(prev => {
        const newCellValues = [...prev.cellValues];
        const isGiven = level.given.includes(cellIndex);
        if (!isGiven) {
          // Cell is becoming given, set its value to the solution
          newCellValues[cellIndex] = level.solutions[cellIndex];
        } else {
          // Cell is no longer given, set to 0 unless it has a solution
          newCellValues[cellIndex] = level.solutions[cellIndex];
        }
        return { ...prev, cellValues: newCellValues };
      });
    }
  }, [editMode, selectedValue, level.given, level.solutions]);

  const addSide = () => {
    setSides(prev => [...prev, 2]);
  };

  const removeSide = () => {
    if (sides.length > 1) {
      setSides(prev => prev.slice(0, -1));
    }
  };

  const updateSide = (index: number, value: number) => {
    setSides(prev => {
      const newSides = [...prev];
      newSides[index] = Math.max(2, value);
      return newSides;
    });
  };

  const addCard = () => {
    setCards(prev => [...prev, 1]);
  };

  const removeCard = (index: number) => {
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  const updateCard = (index: number, value: number) => {
    setCards(prev => {
      const newCards = [...prev];
      newCards[index] = Math.max(1, value);
      return newCards;
    });
  };

  const exportLevel = () => {
    const levelJson = JSON.stringify(level, null, 2);
    
    // Create and download file
    const blob = new Blob([levelJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLevel = () => {
    setLevel(prev => ({
      ...prev,
      given: [],
      solutions: Array(totalCells).fill(0),
    }));
    setLevelState(prev => ({
      ...prev,
      cellValues: Array(totalCells).fill(0),
    }));
  };

  const loadLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const levelData = JSON.parse(e.target?.result as string) as Level;
        setSides(levelData.sides);
        setCards(levelData.cards);
        setLevel(levelData);
        setLevelState(buildInitialState(levelData));
      } catch (error) {
        alert('Erro ao carregar nível: Formato JSON inválido');
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be loaded again
    event.target.value = '';
  };

  const loadDemoLevel = () => {
    setSides(demoLevel.sides);
    setCards(demoLevel.cards);
    setLevel(demoLevel);
    setLevelState(buildInitialState(demoLevel));
  };

  const renderGrid = () => {
    // Calculate dynamic height based on number of levels
    const minHeight = Math.max(300, sides.length * 120); // At least 300px, +120px per level
    const maxHeight = Math.min(600, sides.length * 150); // Max 600px, but scale with levels
    
    // Calculate scale factor considering both width and height
    const cellPx = 60; // approximate pixel size per logical unit
    const outerSide = sides[sides.length - 1] ?? 0;
    const innerSum = sides.slice(0, -1).reduce((a, b) => a + b, 0);
    const estimatedUnits = outerSide + innerSum;
    const estimatedSize = 80 + estimatedUnits * cellPx; // include header size
    const containerLimit = 500; // px, max dimension inside blue box
    const scale = estimatedSize > containerLimit ? containerLimit / estimatedSize : 1;
    
    return (
      <div 
        className="w-full bg-blue-400 rounded-lg p-4 flex items-center justify-center"
        style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
      >
        <div 
          className="max-w-full max-h-full"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'center',
            overflow: 'visible'
          }}
        >
          <EditorBoardGrid
            level={level}
            levelState={levelState}
            editMode={editMode}
            selectedValue={selectedValue}
            onCellClick={handleCellClick}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-white text-black p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editor de Níveis</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Voltar ao Menu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Grid Dimensions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Dimensões da Grade</h3>
              <div className="space-y-2">
                {sides.map((side, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm w-16">Lado {index + 1}:</span>
                    <input
                      type="number"
                      value={side}
                      min="2"
                      onChange={(e) => updateSide(index, parseInt(e.target.value) || 2)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={addSide}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Adicionar Lado
                  </button>
                  <button
                    onClick={removeSide}
                    disabled={sides.length <= 1}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-gray-300"
                  >
                    Remover Lado
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Mode */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Modo de Edição</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="editMode"
                    value="place"
                    checked={editMode === "place"}
                    onChange={() => setEditMode("place")}
                  />
                  <span>Colocar Números</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="editMode"
                    value="given"
                    checked={editMode === "given"}
                    onChange={() => setEditMode("given")}
                  />
                  <span>Marcar como Dado</span>
                </label>
              </div>

              {editMode === "place" && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">
                    Valor Selecionado:
                  </label>
                  <input
                    type="number"
                    value={selectedValue}
                    min="1"
                    onChange={(e) => setSelectedValue(parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              )}
            </div>

            {/* Available Cards */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Cartas Disponíveis</h3>
              <div className="space-y-2">
                {cards.map((card, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="number"
                      value={card}
                      min="1"
                      onChange={(e) => updateCard(index, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => removeCard(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCard}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Adicionar Carta
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Ações</h3>
              <div className="space-y-2">
                <button
                  onClick={exportLevel}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Exportar como JSON
                </button>
                <label className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer block text-center">
                  Carregar Nível JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadLevel}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={loadDemoLevel}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  Carregar Nível Demo
                </button>
                <button
                  onClick={clearLevel}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Limpar Grade
                </button>
              </div>
            </div>
          </div>

          {/* Grid Editor */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Editor de Grade</h3>
              <div className="mb-4 text-sm text-gray-600">
                <p>Total de células: {totalCells} (lados: {sides.join(', ')})</p>
                <p>Células amarelas são marcadas como "dadas" (pré-preenchidas)</p>
                <p>Clique nas células para colocar números ou marcar como dadas</p>
                {(() => {
                  const cellPx = 60;
                  const outerSide = sides[sides.length - 1] ?? 0;
                  const innerSum = sides.slice(0, -1).reduce((a, b) => a + b, 0);
                  const estimatedUnits = outerSide + innerSum;
                  const estimatedSize = 80 + estimatedUnits * cellPx;
                  const containerLimit = 500;
                  const scale = estimatedSize > containerLimit ? containerLimit / estimatedSize : 1;
                  return scale < 1 ? (
                    <p className="text-xs mt-2 text-orange-600">
                      ⚠️ Grade grande - reduzida para {Math.round(scale * 100)}% para caber no container
                    </p>
                  ) : null;
                })()}
                <p className="text-xs mt-2">
                  Células dadas: [{level.given.sort((a, b) => a - b).join(', ')}]
                </p>
              </div>
              {renderGrid()}
            </div>
          </div>
        </div>

        {/* Level Preview */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Pré-visualização do Nível (JSON)</h3>
          
          {/* Cell mapping debug info */}
          <div className="mb-4 text-xs text-gray-600 bg-gray-100 p-2 rounded">
            <p><strong>Debug do Mapeamento de Células:</strong></p>
            {sides.map((_, levelIndex) => {
              const isInnermost = levelIndex === 0;
              const currentLevelCells = totalCells - levelIndex * 5;
              
              if (isInnermost) {
                return (
                  <p key={levelIndex}>
                    Nível {levelIndex + 1} (mais interno): células [{currentLevelCells - 3}, {currentLevelCells - 1}, {currentLevelCells - 2}]
                  </p>
                );
              } else {
                return (
                  <p key={levelIndex}>
                    Nível {levelIndex + 1}: células [{currentLevelCells - 5}, {currentLevelCells - 4}, {currentLevelCells - 1}, {currentLevelCells - 2}, {currentLevelCells - 3}]
                  </p>
                );
              }
            }).reverse()}
          </div>
          
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-auto max-h-64">
            {JSON.stringify(level, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
