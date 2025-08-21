import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Style, PaperSize, PrintSettings, PrintJob, PageMargins, HeaderFooter, CustomColorSettings } from '../types';
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
    orientation: 'portrait',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    headerFooter: {
      header: {
        enabled: false,
        text: '',
        fontSize: 12,
        alignment: 'center'
      },
      footer: {
        enabled: false,
        text: '',
        fontSize: 10,
        alignment: 'center'
      }
    },
    customColors: {
      enabled: false,
      primaryColor: '#6B7280',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#FFFFFF'
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="text-center py-12">
        <p className="text-[#0EA5E9] text-lg mb-4">样式不存在</p>
        <Link to="/gallery" className="text-[#0EA5E9] hover:underline">
          返回样式库
        </Link>
      </div>
    );
  }

  const currentPaperSize = paperSizes.find(size => size.value === paperSize);
  const aspectRatio = currentPaperSize ? currentPaperSize.width / currentPaperSize.height : 1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Link
            to="/gallery"
            className="flex items-center text-[#0EA5E9] hover:text-[#0284C7] transition-colors min-h-[44px]"
          >
            <ArrowLeft className="mr-2" size={18} />
            <span className="text-sm sm:text-base">返回样式库</span>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1E293B] leading-tight">{style.name}</h1>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
              {style.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] text-xs sm:text-sm rounded-full shadow-sm border border-[#0EA5E9]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center px-3 sm:px-4 py-3 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] rounded-lg hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-colors text-sm sm:text-base min-h-[48px] border border-[#0EA5E9]"
          >
            <Download className="mr-1 sm:mr-2" size={16} />
            <span className="hidden sm:inline">下载</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white rounded-lg hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300 text-sm sm:text-base min-h-[48px] shadow-lg hover:shadow-xl"
          >
            <Printer className="mr-1 sm:mr-2" size={16} />
            打印
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            {/* Preview Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#0EA5E9]">预览</h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 sm:p-3 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] rounded-md hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  disabled={zoom <= 50}
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs sm:text-sm text-[#0EA5E9] min-w-[50px] sm:min-w-[60px] text-center px-2">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 sm:p-3 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] rounded-md hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  disabled={zoom >= 200}
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 sm:p-3 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] rounded-md hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-colors ml-1 sm:ml-2 min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>
            
            {/* Preview Image */}
            <div className="flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] rounded-lg p-4 sm:p-6 md:p-8 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              <div 
                className="bg-white shadow-lg relative"
                style={{
                  width: `${300 * (zoom / 100)}px`,
                  height: `${300 / aspectRatio * (zoom / 100)}px`,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'all 0.3s ease',
                  backgroundColor: printSettings.customColors.enabled ? printSettings.customColors.backgroundColor : '#ffffff'
                }}
              >
                {/* 边距指示器 */}
                <div 
                  className="absolute inset-0 border-2 border-dashed border-gray-300 pointer-events-none"
                  style={{
                    top: `${printSettings.margins.top * (zoom / 100) * 0.3}px`,
                    right: `${printSettings.margins.right * (zoom / 100) * 0.3}px`,
                    bottom: `${printSettings.margins.bottom * (zoom / 100) * 0.3}px`,
                    left: `${printSettings.margins.left * (zoom / 100) * 0.3}px`
                  }}
                />
                
                {/* 页眉 */}
                {printSettings.headerFooter.header.enabled && printSettings.headerFooter.header.text && (
                  <div 
                    className="absolute top-0 left-0 right-0 text-center pointer-events-none"
                    style={{
                      paddingTop: `${Math.max(printSettings.margins.top * (zoom / 100) * 0.3 - 20, 5)}px`,
                      fontSize: `${printSettings.headerFooter.header.fontSize * (zoom / 100) * 0.1}px`,
                      textAlign: printSettings.headerFooter.header.alignment,
                      color: printSettings.customColors.enabled ? printSettings.customColors.primaryColor : '#0EA5E9'
                    }}
                  >
                    {printSettings.headerFooter.header.text}
                  </div>
                )}
                
                {/* 页脚 */}
                {printSettings.headerFooter.footer.enabled && printSettings.headerFooter.footer.text && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 text-center pointer-events-none"
                    style={{
                      paddingBottom: `${Math.max(printSettings.margins.bottom * (zoom / 100) * 0.3 - 15, 5)}px`,
                      fontSize: `${printSettings.headerFooter.footer.fontSize * (zoom / 100) * 0.1}px`,
                      textAlign: printSettings.headerFooter.footer.alignment,
                      color: printSettings.customColors.enabled ? printSettings.customColors.primaryColor : '#0EA5E9'
                    }}
                  >
                    {printSettings.headerFooter.footer.text}
                  </div>
                )}

                {/* 主要内容区域 */}
                <div 
                  className="absolute inset-0"
                  style={{
                    top: `${printSettings.margins.top * (zoom / 100) * 0.3}px`,
                    right: `${printSettings.margins.right * (zoom / 100) * 0.3}px`,
                    bottom: `${printSettings.margins.bottom * (zoom / 100) * 0.3}px`,
                    left: `${printSettings.margins.left * (zoom / 100) * 0.3}px`,
                    filter: printSettings.colorMode === 'grayscale' ? 'grayscale(100%)' : 
                           printSettings.colorMode === 'blackwhite' ? 'grayscale(100%) contrast(200%)' : 'none'
                  }}
                >
                  {/* 如果是练字网格样式，显示SVG图案，否则显示图片 */}
                  {style.categoryId === 'practice' ? (
                    <GridPattern 
                      styleId={style.id}
                      width={300 * (zoom / 100) - (printSettings.margins.left + printSettings.margins.right) * (zoom / 100) * 0.3}
                      height={300 / aspectRatio * (zoom / 100) - (printSettings.margins.top + printSettings.margins.bottom) * (zoom / 100) * 0.3}
                      className="w-full h-full"
                      customColors={printSettings.customColors.enabled ? {
                        primaryColor: printSettings.customColors.primaryColor,
                        secondaryColor: printSettings.customColors.secondaryColor
                      } : undefined}
                    />
                  ) : (
                    <img
                      src={style.fullImageUrl}
                      alt={style.name}
                      className="w-full h-full object-cover"
                      style={{
                        filter: printSettings.customColors.enabled ? 
                          `hue-rotate(${printSettings.customColors.primaryColor === '#0EA5E9' ? '0' : '30'}deg)` : 'none'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,${encodeURIComponent(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F8FAFC"/><text x="200" y="160" text-anchor="middle" fill="#0EA5E9" font-size="24">${style.name}</text></svg>`
                          )}`;
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Paper Size */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#0EA5E9] mb-3 sm:mb-4">纸张尺寸</h3>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PaperSize)}
              className="w-full p-3 border-2 border-[#0EA5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0284C7] text-base min-h-[48px]"
            >
              {paperSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {currentPaperSize && (
              <p className="text-xs sm:text-sm text-[#0EA5E9] mt-2">
                尺寸: {currentPaperSize.width} × {currentPaperSize.height} mm
              </p>
            )}
          </div>

          {/* Print Settings */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B] mb-3 sm:mb-4">打印设置</h3>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Quality */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#0EA5E9] mb-2">
                  打印质量
                </label>
                <select
                  value={printSettings.quality}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    quality: e.target.value as PrintSettings['quality']
                  }))}
                  className="w-full p-3 border-2 border-[#0EA5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0284C7] transition-all text-base min-h-[48px]"
                >
                  <option value="draft">草稿质量</option>
                  <option value="normal">标准质量</option>
                  <option value="high">高质量</option>
                </select>
              </div>

              {/* Color Mode */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#0EA5E9] mb-2">
                  颜色模式
                </label>
                <select
                  value={printSettings.colorMode}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    colorMode: e.target.value as PrintSettings['colorMode']
                  }))}
                  className="w-full p-3 border-2 border-[#0EA5E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0284C7] text-base min-h-[48px]"
                >
                  <option value="color">彩色</option>
                  <option value="grayscale">灰度</option>
                  <option value="blackwhite">黑白</option>
                  <option value="custom">自定义颜色</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#1E293B] mb-2">
                  方向
                </label>
                <select
                  value={printSettings.orientation}
                  onChange={(e) => setPrintSettings(prev => ({ 
                    ...prev, 
                    orientation: e.target.value as PrintSettings['orientation']
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-base min-h-[48px]"
                >
                  <option value="portrait">纵向</option>
                  <option value="landscape">横向</option>
                </select>
              </div>

              {/* Copies */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#1E293B] mb-2">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-base min-h-[48px]"
                />
              </div>
            </div>
          </div>

          {/* Page Margins */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B] mb-3 sm:mb-4">页面边距</h3>
            
            {/* Margin Presets */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-[#374151] mb-2">
                预设边距
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrintSettings(prev => ({
                    ...prev,
                    margins: { top: 0, right: 0, bottom: 0, left: 0 }
                  }))}
                  className="p-2 text-xs sm:text-sm bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] rounded-md transition-colors"
                >无边距</button>
                <button
                  onClick={() => setPrintSettings(prev => ({
                    ...prev,
                    margins: { top: 20, right: 20, bottom: 20, left: 20 }
                  }))}
                  className="p-2 text-xs sm:text-sm bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] rounded-md transition-colors"
                >
                  标准边距
                </button>
              </div>
            </div>

            {/* Custom Margins */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">上边距 (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={printSettings.margins.top}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    margins: { ...prev.margins, top: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">右边距 (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={printSettings.margins.right}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    margins: { ...prev.margins, right: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">下边距 (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={printSettings.margins.bottom}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    margins: { ...prev.margins, bottom: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">左边距 (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={printSettings.margins.left}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    margins: { ...prev.margins, left: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                />
              </div>
            </div>
          </div>

          {/* Header & Footer */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B] mb-3 sm:mb-4">页眉页脚</h3>
            
            {/* Header Settings */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="header-enabled"
                  checked={printSettings.headerFooter.header.enabled}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    headerFooter: {
                      ...prev.headerFooter,
                      header: { ...prev.headerFooter.header, enabled: e.target.checked }
                    }
                  }))}
                  className="mr-2"
                />
                <label htmlFor="header-enabled" className="text-xs sm:text-sm font-medium text-[#374151]">
                  启用页眉
                </label>
              </div>
              {printSettings.headerFooter.header.enabled && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="页眉文字"
                    value={printSettings.headerFooter.header.text}
                    onChange={(e) => setPrintSettings(prev => ({
                      ...prev,
                      headerFooter: {
                        ...prev.headerFooter,
                        header: { ...prev.headerFooter.header, text: e.target.value }
                      }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                  />
                  <select
                    value={printSettings.headerFooter.header.alignment}
                    onChange={(e) => setPrintSettings(prev => ({
                      ...prev,
                      headerFooter: {
                        ...prev.headerFooter,
                        header: { ...prev.headerFooter.header, alignment: e.target.value as 'left' | 'center' | 'right' }
                      }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                  >
                    <option value="left">左对齐</option>
                    <option value="center">居中</option>
                    <option value="right">右对齐</option>
                  </select>
                </div>
              )}
            </div>

            {/* Footer Settings */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="footer-enabled"
                  checked={printSettings.headerFooter.footer.enabled}
                  onChange={(e) => setPrintSettings(prev => ({
                    ...prev,
                    headerFooter: {
                      ...prev.headerFooter,
                      footer: { ...prev.headerFooter.footer, enabled: e.target.checked }
                    }
                  }))}
                  className="mr-2"
                />
                <label htmlFor="footer-enabled" className="text-xs sm:text-sm font-medium text-[#374151]">
                  启用页脚
                </label>
              </div>
              {printSettings.headerFooter.footer.enabled && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="页脚文字"
                    value={printSettings.headerFooter.footer.text}
                    onChange={(e) => setPrintSettings(prev => ({
                      ...prev,
                      headerFooter: {
                        ...prev.headerFooter,
                        footer: { ...prev.headerFooter.footer, text: e.target.value }
                      }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                  />
                  <select
                    value={printSettings.headerFooter.footer.alignment}
                    onChange={(e) => setPrintSettings(prev => ({
                      ...prev,
                      headerFooter: {
                        ...prev.headerFooter,
                        footer: { ...prev.headerFooter.footer, alignment: e.target.value as 'left' | 'center' | 'right' }
                      }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                  >
                    <option value="left">左对齐</option>
                    <option value="center">居中</option>
                    <option value="right">右对齐</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#1E293B] mb-3 sm:mb-4">自定义颜色</h3>
            
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="custom-colors-enabled"
                checked={printSettings.customColors.enabled}
                onChange={(e) => {
                  setPrintSettings(prev => ({
                    ...prev,
                    customColors: { ...prev.customColors, enabled: e.target.checked },
                    colorMode: e.target.checked ? 'custom' : 'color'
                  }));
                }}
                className="mr-2"
              />
              <label htmlFor="custom-colors-enabled" className="text-xs sm:text-sm font-medium text-[#374151]">
                启用自定义颜色
              </label>
            </div>

            {printSettings.customColors.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">主色调</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={printSettings.customColors.primaryColor}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        customColors: { ...prev.customColors, primaryColor: e.target.value }
                      }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={printSettings.customColors.primaryColor}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        customColors: { ...prev.customColors, primaryColor: e.target.value }
                      }))}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">辅助色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={printSettings.customColors.secondaryColor}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        customColors: { ...prev.customColors, secondaryColor: e.target.value }
                      }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={printSettings.customColors.secondaryColor}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        customColors: { ...prev.customColors, secondaryColor: e.target.value }
                      }))}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">背景色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={printSettings.customColors.backgroundColor}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        customColors: { ...prev.customColors, backgroundColor: e.target.value }
                      }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={printSettings.customColors.backgroundColor}
                      onChange={(e) => setPrintSettings(prev => ({
                        ...prev,
                        customColors: { ...prev.customColors, backgroundColor: e.target.value }
                      }))}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-sm min-h-[40px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Styles */}
      {relatedStyles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[#1E293B] mb-3 sm:mb-4">相关样式</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedStyles.map((relatedStyle) => (
              <Link
                key={relatedStyle.id}
                to={`/preview/${relatedStyle.id}`}
                className="group bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={relatedStyle.thumbnailUrl}
                    alt={relatedStyle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="#F8FAFC"/><text x="150" y="120" text-anchor="middle" fill="#0EA5E9" font-size="16">${relatedStyle.name}</text></svg>`
                    )}`;
                    }}
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h4 className="font-medium text-[#1E293B] group-hover:text-[#0284C7] transition-colors text-xs sm:text-sm leading-tight">
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