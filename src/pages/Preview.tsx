import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Style, PaperSize, PrintSettings, PrintJob } from '../types';
import { getStyleById, getRelatedStyles } from '../services/dataService';
import { useAppStore } from '../store';
import GridPattern from '../components/GridPatterns';

const Preview = () => {
  const { styleId } = useParams<{ styleId: string }>();
  const [style, setStyle] = useState<Style | null>(null);
  const [relatedStyles, setRelatedStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    quality: 'normal',
    colorMode: 'color',
    copies: 1,
    orientation: 'portrait'
  });
  const { addToPrintQueue } = useAppStore();

  const paperSizes = [
    { value: 'A4', label: 'A4 (210×297mm)', width: 210, height: 297 },
    { value: 'A3', label: 'A3 (297×420mm)', width: 297, height: 420 },
    { value: 'A5', label: 'A5 (148×210mm)', width: 148, height: 210 },
    { value: 'Letter', label: 'Letter (216×279mm)', width: 216, height: 279 },
    { value: 'Legal', label: 'Legal (216×356mm)', width: 216, height: 356 }
  ];

  useEffect(() => {
    const loadData = async () => {
      if (!styleId) return;
      
      setLoading(true);
      try {
        const [styleData, relatedData] = await Promise.all([
          getStyleById(styleId),
          getRelatedStyles(styleId, 4)
        ]);
        
        if (styleData) {
          setStyle(styleData);
          setRelatedStyles(relatedData);
        } else {
          toast.error('样式不存在');
        }
      } catch (error) {
        console.error('Failed to load style:', error);
        toast.error('加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [styleId]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePrint = () => {
    if (!style) return;

    const printJob: PrintJob = {
      id: `print_${Date.now()}`,
      styleId: style.id,
      styleName: style.name,
      paperSize,
      printSettings,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    addToPrintQueue(printJob);
    toast.success('已添加到打印队列');
    
    // 模拟打印过程
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = () => {
    if (!style) return;
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = style.fullImageUrl;
    link.download = `${style.name}_${paperSize}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('开始下载');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27]"></div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">样式不存在</p>
        <Link to="/gallery" className="text-[#2D5A27] hover:underline">
          返回样式库
        </Link>
      </div>
    );
  }

  const currentPaperSize = paperSizes.find(size => size.value === paperSize);
  const aspectRatio = currentPaperSize ? currentPaperSize.width / currentPaperSize.height : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/gallery"
            className="flex items-center text-[#2D5A27] hover:text-[#3D6A37] transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            返回样式库
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#2D5A27]">{style.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {style.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[#F4C2C2] text-[#2D5A27] text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="mr-2" size={18} />
            下载
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#3D6A37] transition-colors"
          >
            <Printer className="mr-2" size={18} />
            打印
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Preview Controls */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2D5A27]">预览</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={zoom <= 50}
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={zoom >= 200}
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors ml-2"
                >
                  <RotateCw size={18} />
                </button>
              </div>
            </div>
            
            {/* Preview Image */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 min-h-[500px]">
              <div 
                className="bg-white shadow-lg"
                style={{
                  width: `${300 * (zoom / 100)}px`,
                  height: `${300 / aspectRatio * (zoom / 100)}px`,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* 如果是练字网格样式，显示SVG图案，否则显示图片 */}
                {style.categoryId === 'practice' ? (
                  <GridPattern 
                    styleId={style.id}
                    width={300 * (zoom / 100)}
                    height={300 / aspectRatio * (zoom / 100)}
                    className="w-full h-full"
                  />
                ) : (
                  <img
                    src={style.fullImageUrl}
                    alt={style.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F8F6F0"/><text x="200" y="160" text-anchor="middle" fill="#2D5A27" font-size="24">${style.name}</text></svg>`
                      )}`;
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Paper Size */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-[#2D5A27] mb-4">纸张尺寸</h3>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PaperSize)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
            >
              {paperSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {currentPaperSize && (
              <p className="text-sm text-gray-600 mt-2">
                尺寸: {currentPaperSize.width} × {currentPaperSize.height} mm
              </p>
            )}
          </div>

          {/* Print Settings */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-[#2D5A27] mb-4">打印设置</h3>
            
            <div className="space-y-4">
              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  打印质量
                </label>
                <select
                  value={printSettings.quality}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    quality: e.target.value as PrintSettings['quality']
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
                >
                  <option value="draft">草稿质量</option>
                  <option value="normal">标准质量</option>
                  <option value="high">高质量</option>
                </select>
              </div>

              {/* Color Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  颜色模式
                </label>
                <select
                  value={printSettings.colorMode}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    colorMode: e.target.value as PrintSettings['colorMode']
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
                >
                  <option value="color">彩色</option>
                  <option value="grayscale">灰度</option>
                  <option value="blackwhite">黑白</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  方向
                </label>
                <select
                  value={printSettings.orientation}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    orientation: e.target.value as PrintSettings['orientation']
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
                >
                  <option value="portrait">纵向</option>
                  <option value="landscape">横向</option>
                </select>
              </div>

              {/* Copies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  份数
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={printSettings.copies}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    copies: parseInt(e.target.value) || 1
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Styles */}
      {relatedStyles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#2D5A27] mb-4">相关样式</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedStyles.map((relatedStyle) => (
              <Link
                key={relatedStyle.id}
                to={`/preview/${relatedStyle.id}`}
                className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={relatedStyle.thumbnailUrl}
                    alt={relatedStyle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="#F8F6F0"/><text x="150" y="120" text-anchor="middle" fill="#2D5A27" font-size="16">${relatedStyle.name}</text></svg>`
                      )}`;
                    }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-[#2D5A27] group-hover:text-[#3D6A37] transition-colors">
                    {relatedStyle.name}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;