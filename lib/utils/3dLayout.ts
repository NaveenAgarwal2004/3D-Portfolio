// Utility function for project card positioning
export function calculateGridPosition(index: number): [number, number, number] {
  const cols = 3;          // 3 columns
  const spacing = 4;       // 4 units between cards
  
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  // Center the grid (offset by half width)
  const x = (col - 1) * spacing;  // -4, 0, 4
  const y = -row * spacing;        // 0, -4, -8, ...
  const z = 0;
  
  return [x, y, z];
}

// Constellation layout algorithm (Fibonacci sphere distribution)
export function generateConstellationPositions(techStack: string[]): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};
  const radius = 5; // Sphere radius
  
  techStack.forEach((tech, i) => {
    // Fibonacci sphere distribution for even spacing
    const phi = Math.acos(1 - 2 * (i + 0.5) / techStack.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    positions[tech] = [x, y, z];
  });
  
  return positions;
}
