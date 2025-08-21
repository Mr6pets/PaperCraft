import React from 'react';

interface GridPatternProps {
  styleId: string;
  width?: number;
  height?: number;
  className?: string;
}

export const GridPattern: React.FC<GridPatternProps> = ({ 
  styleId, 
  width = 400, 
  height = 300, 
  className = '' 
}) => {
  const renderPattern = () => {
    switch (styleId) {
      case 'tian-zi-ge':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="tianzi" patternUnits="userSpaceOnUse" width="40" height="40">
                <rect width="40" height="40" fill="white" stroke="#333" strokeWidth="1"/>
                <line x1="20" y1="0" x2="20" y2="40" stroke="#666" strokeWidth="0.5"/>
                <line x1="0" y1="20" x2="40" y2="20" stroke="#666" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tianzi)"/>
          </svg>
        );
      
      case 'mi-zi-ge':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="mizi" patternUnits="userSpaceOnUse" width="40" height="40">
                <rect width="40" height="40" fill="white" stroke="#333" strokeWidth="1"/>
                <line x1="20" y1="0" x2="20" y2="40" stroke="#666" strokeWidth="0.5"/>
                <line x1="0" y1="20" x2="40" y2="20" stroke="#666" strokeWidth="0.5"/>
                <line x1="0" y1="0" x2="40" y2="40" stroke="#999" strokeWidth="0.3"/>
                <line x1="40" y1="0" x2="0" y2="40" stroke="#999" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mizi)"/>
          </svg>
        );
      
      case 'jiu-gong-ge':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="jiugong" patternUnits="userSpaceOnUse" width="60" height="60">
                <rect width="60" height="60" fill="white" stroke="#333" strokeWidth="1"/>
                <line x1="20" y1="0" x2="20" y2="60" stroke="#666" strokeWidth="0.5"/>
                <line x1="40" y1="0" x2="40" y2="60" stroke="#666" strokeWidth="0.5"/>
                <line x1="0" y1="20" x2="60" y2="20" stroke="#666" strokeWidth="0.5"/>
                <line x1="0" y1="40" x2="60" y2="40" stroke="#666" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jiugong)"/>
          </svg>
        );
      
      case 'calligraphy-large-grid':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="largegrid" patternUnits="userSpaceOnUse" width="80" height="80">
                <rect width="80" height="80" fill="white" stroke="#333" strokeWidth="1.5"/>
                <line x1="40" y1="0" x2="40" y2="80" stroke="#888" strokeWidth="0.5" strokeDasharray="2,2"/>
                <line x1="0" y1="40" x2="80" y2="40" stroke="#888" strokeWidth="0.5" strokeDasharray="2,2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#largegrid)"/>
          </svg>
        );
      
      case 'calligraphy-vertical':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="vertical" patternUnits="userSpaceOnUse" width="30" height="400">
                <rect width="30" height="400" fill="white"/>
                <line x1="0" y1="0" x2="0" y2="400" stroke="#333" strokeWidth="1"/>
                <line x1="30" y1="0" x2="30" y2="400" stroke="#333" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vertical)"/>
          </svg>
        );
      
      case 'english-four-line':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="fourline" patternUnits="userSpaceOnUse" width="400" height="60">
                <rect width="400" height="60" fill="white"/>
                <line x1="0" y1="0" x2="400" y2="0" stroke="#333" strokeWidth="1"/>
                <line x1="0" y1="20" x2="400" y2="20" stroke="#999" strokeWidth="0.5" strokeDasharray="2,2"/>
                <line x1="0" y1="40" x2="400" y2="40" stroke="#999" strokeWidth="0.5" strokeDasharray="2,2"/>
                <line x1="0" y1="60" x2="400" y2="60" stroke="#333" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fourline)"/>
          </svg>
        );
      
      case 'english-ruled':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="ruled" patternUnits="userSpaceOnUse" width="400" height="30">
                <rect width="400" height="30" fill="white"/>
                <line x1="0" y1="30" x2="400" y2="30" stroke="#333" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ruled)"/>
          </svg>
        );
      
      case 'math-grid':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="mathgrid" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect width="20" height="20" fill="white" stroke="#ddd" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mathgrid)"/>
          </svg>
        );
      
      case 'coordinate-paper':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="coordinate" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect width="20" height="20" fill="white" stroke="#ddd" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#coordinate)"/>
            {/* X轴 */}
            <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#333" strokeWidth="2"/>
            {/* Y轴 */}
            <line x1={width/2} y1="0" x2={width/2} y2={height} stroke="#333" strokeWidth="2"/>
            {/* 箭头 */}
            <polygon points={`${width-10},${height/2-5} ${width},${height/2} ${width-10},${height/2+5}`} fill="#333"/>
            <polygon points={`${width/2-5},10 ${width/2},0 ${width/2+5},10`} fill="#333"/>
          </svg>
        );
      
      case 'dot-grid':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="dotgrid" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect width="20" height="20" fill="white"/>
                <circle cx="20" cy="20" r="1" fill="#ccc"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)"/>
          </svg>
        );
      
      case 'music-staff':
        return (
          <svg width={width} height={height} className={className}>
            <defs>
              <pattern id="staff" patternUnits="userSpaceOnUse" width="400" height="80">
                <rect width="400" height="80" fill="white"/>
                <line x1="0" y1="10" x2="400" y2="10" stroke="#333" strokeWidth="1"/>
                <line x1="0" y1="20" x2="400" y2="20" stroke="#333" strokeWidth="1"/>
                <line x1="0" y1="30" x2="400" y2="30" stroke="#333" strokeWidth="1"/>
                <line x1="0" y1="40" x2="400" y2="40" stroke="#333" strokeWidth="1"/>
                <line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#staff)"/>
          </svg>
        );
      
      default:
        return (
          <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{width, height}}>
            <span className="text-gray-500">预览不可用</span>
          </div>
        );
    }
  };

  return renderPattern();
};

export default GridPattern;