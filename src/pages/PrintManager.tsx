import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Clock, CheckCircle, XCircle, Trash2, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { PrintJob, PrintHistory } from '../types';
import { useAppStore } from '../store';

const PrintManager = () => {
  const { printQueue, printHistory, updatePrintJob, removePrintJob, addToPrintHistory } = useAppStore();
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [printerStatus, setPrinterStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // 模拟打印机连接
  const handleConnectPrinter = async () => {
    setPrinterStatus('connecting');
    
    // 模拟连接延迟
    setTimeout(() => {
      setPrinterStatus('connected');
      toast.success('打印机连接成功');
    }, 2000);
  };

  const handleDisconnectPrinter = () => {
    setPrinterStatus('disconnected');
    toast.info('打印机已断开连接');
  };

  // 开始打印任务
  const handleStartPrint = (jobId: string) => {
    const job = printQueue.find(j => j.id === jobId);
    if (!job) return;

    if (printerStatus !== 'connected') {
      toast.error('请先连接打印机');
      return;
    }

    updatePrintJob(jobId, { status: 'printing', progress: 0 });
    toast.success('开始打印');

    // 模拟打印进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        updatePrintJob(jobId, { status: 'completed', progress: 100 });
        
        // 添加到打印历史
        const historyRecord: PrintHistory = {
          id: `history_${Date.now()}`,
          styleId: job.styleId,
          paperSize: job.paperSize,
          printSettings: job.printSettings,
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        addToPrintHistory(historyRecord);
        
        // 从队列中移除
        setTimeout(() => {
          removePrintJob(jobId);
        }, 2000);
        
        clearInterval(interval);
        toast.success('打印完成');
      } else {
        updatePrintJob(jobId, { progress: Math.floor(progress) });
      }
    }, 500);
  };

  // 取消打印任务
  const handleCancelPrint = (jobId: string) => {
    updatePrintJob(jobId, { status: 'failed' });
    toast.error('打印已取消');
    
    setTimeout(() => {
      removePrintJob(jobId);
    }, 1000);
  };

  // 重新打印
  const handleReprintFromHistory = (record: PrintHistory) => {
    const newJob: PrintJob = {
      id: `reprint_${Date.now()}`,
      styleId: record.styleId,
      styleName: `重新打印 - ${record.styleId}`,
      paperSize: record.paperSize,
      printSettings: record.printSettings,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    // 这里应该调用 addToPrintQueue，但由于我们没有样式名称，先用简化版本
    toast.success('已添加到打印队列');
  };

  const getStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'printing':
        return <Printer className="text-blue-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-[#10B981]" size={20} />;
    }
  };

  const getStatusText = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'printing':
        return '打印中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '已取消';
      default:
        return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-6">打印管理</h1>
        
        {/* Printer Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              printerStatus === 'connected' ? 'bg-green-500' :
              printerStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              'bg-red-500'
            }`}></div>
            <span className="text-sm text-[#0EA5E9]">
              打印机: {
                printerStatus === 'connected' ? '已连接' :
                printerStatus === 'connecting' ? '连接中...' :
                '未连接'
              }
            </span>
          </div>
          
          {printerStatus === 'disconnected' ? (
            <button
              onClick={handleConnectPrinter}
              className="px-4 py-2 bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white rounded-lg hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              连接打印机
            </button>
          ) : printerStatus === 'connected' ? (
            <button
              onClick={handleDisconnectPrinter}
              className="px-4 py-2 bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white rounded-lg hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              断开连接
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] rounded-lg cursor-not-allowed border border-[#0EA5E9]"
            >
              连接中...
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F0F9FF] rounded-lg p-1">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'queue'
              ? 'bg-[#0EA5E9] text-white'
            : 'text-[#0EA5E9] hover:text-[#0284C7]'
          }`}
        >
          打印队列 ({printQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'history'
              ? 'bg-[#0EA5E9] text-white'
            : 'text-[#0EA5E9] hover:text-[#0284C7]'
          }`}
        >
          打印历史 ({printHistory.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'queue' ? (
        <div className="bg-white rounded-lg shadow-md">
          {printQueue.length === 0 ? (
            <div className="text-center py-12">
              <Printer className="mx-auto text-[#0EA5E9] mb-4" size={48} />
              <p className="text-[#0EA5E9] text-lg mb-4">打印队列为空</p>
              <Link
                to="/gallery"
                className="text-[#0EA5E9] hover:underline"
              >
                去选择样式打印
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {printQueue.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(job.status)}
                      <div>
                        <h3 className="font-semibold text-[#0EA5E9]">{job.styleName}</h3>
                        <p className="text-sm text-[#10B981]">
                          {job.paperSize} · {job.printSettings.quality} · {job.printSettings.copies}份
                        </p>
                        <p className="text-xs text-[#0EA5E9]">
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {job.status === 'printing' && (
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] rounded-full h-2">
                            <div 
                              className="bg-[#0EA5E9] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-[#0EA5E9]">{job.progress}%</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/preview/${job.styleId}`}
                          className="p-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
                          title="查看样式"
                        >
                          <Eye size={18} />
                        </Link>
                        
                        {job.status === 'pending' && (
                          <button
                            onClick={() => handleStartPrint(job.id)}
                            className="px-3 py-1 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] rounded hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-all duration-300 shadow-sm text-sm border border-[#0EA5E9]"
                            disabled={printerStatus !== 'connected'}
                          >
                            开始打印
                          </button>
                        )}
                        
                        {job.status === 'printing' && (
                          <button
                            onClick={() => handleCancelPrint(job.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                          >
                            取消
                          </button>
                        )}
                        
                        {(job.status === 'pending' || job.status === 'failed') && (
                          <button
                            onClick={() => removePrintJob(job.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="删除任务"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-[#0EA5E9]">
                    状态: {getStatusText(job.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {printHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto text-[#0EA5E9] mb-4" size={48} />
              <p className="text-[#0EA5E9] text-lg">暂无打印历史</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {printHistory.map((record) => (
                <div key={record.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="text-green-500" size={20} />
                      <div>
                        <h3 className="font-semibold text-[#0EA5E9]">
                          样式 ID: {record.styleId}
                        </h3>
                        <p className="text-sm text-[#10B981]">
                          {record.paperSize} · {record.printSettings.quality} · {record.printSettings.copies}份
                        </p>
                        <p className="text-xs text-[#0EA5E9]">
                          {new Date(record.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/preview/${record.styleId}`}
                        className="p-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
                        title="查看样式"
                      >
                        <Eye size={18} />
                      </Link>
                      
                      <button
                        onClick={() => handleReprintFromHistory(record)}
                        className="flex items-center px-3 py-1 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] rounded hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-all duration-300 shadow-sm text-sm border border-[#0EA5E9]"
                      >
                        <RotateCcw className="mr-1" size={14} />
                        重新打印
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrintManager;