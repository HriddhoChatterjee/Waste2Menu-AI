import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Camera, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  Radio, 
  Maximize2,
  VideoOff,
  Video,
  Info
} from 'lucide-react';
import { MOCK_VISION_SCANS } from '../../utils/mockData';
import { VisionDetection, ScrapCategory } from '../../types';
import { sounds } from '../../utils/soundEffects';

export const VisionIngestor: React.FC = () => {
  const { addScrap } = useAppStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanPresetIndex, setScanPresetIndex] = useState(0);
  const [detections, setDetections] = useState<VisionDetection[]>([]);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentPreset = MOCK_VISION_SCANS[scanPresetIndex];

  // Handle Real Camera if toggled
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera) {
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setCameraActive(true);
          }
        })
        .catch(() => {
          setUseRealCamera(false);
          setCameraActive(false);
        });
    } else {
      setCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [useRealCamera]);

  // Initial detection load
  useEffect(() => {
    loadDetectionsForPreset(scanPresetIndex);
  }, [scanPresetIndex]);

  const loadDetectionsForPreset = (index: number) => {
    const preset = MOCK_VISION_SCANS[index];
    const dets: VisionDetection[] = preset.detections.map((d, i) => ({
      id: `det-${i}`,
      label: d.label,
      category: d.category,
      confidence: d.confidence,
      estimatedMassKg: d.estimatedMassKg,
      bbox: d.bbox,
      color: d.color
    }));
    setDetections(dets);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    sounds.playScanBeep();

    setTimeout(() => {
      const nextIdx = (scanPresetIndex + 1) % MOCK_VISION_SCANS.length;
      setScanPresetIndex(nextIdx);
      loadDetectionsForPreset(nextIdx);
      setIsScanning(false);
      sounds.playSuccessChime();
    }, 1800);
  };

  const handleCommitScraps = () => {
    detections.forEach((d) => {
      addScrap({
        name: d.label,
        category: d.category,
        weightKg: d.estimatedMassKg,
        perishableHoursLeft: d.category === 'poultry_bones' ? 7.5 : 12.0,
        maxPerishableHours: d.category === 'poultry_bones' ? 8.0 : 16.0,
        qualityScore: Math.round(d.confidence * 100),
        detectedFromVision: true,
        notes: `AI Visual Ingestion: ${Math.round(d.confidence * 100)}% Confidence`
      });
    });
  };

  const totalDetectedMass = detections.reduce((acc, d) => acc + d.estimatedMassKg, 0);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-charcoal-light relative overflow-hidden flex flex-col h-full">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-light">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-bold text-white text-base">
                AI Vision Cutting-Board Ingestor
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>60 FPS</span>
              </span>
            </div>
            <p className="text-xs text-textMuted font-mono">
              YOLO-FoodVision v9 Neural Segmentation Feed
            </p>
          </div>
        </div>

        {/* Real camera toggle */}
        <button
          onClick={() => setUseRealCamera(!useRealCamera)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            useRealCamera
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-charcoal border-charcoal-light text-textMuted hover:text-white'
          }`}
          title="Toggle Physical Webcam Feed"
        >
          {useRealCamera ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{useRealCamera ? 'Webcam Live' : 'Sim Board'}</span>
        </button>
      </div>

      {/* Main Viewfinder / Canvas Area */}
      <div className="relative mt-4 aspect-video w-full rounded-xl bg-obsidian-dark border border-charcoal-light/80 overflow-hidden flex items-center justify-center shadow-inner">
        
        {/* Real Webcam Stream or Animated Cutting Board Simulation */}
        {useRealCamera && cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full relative bg-gradient-to-br from-[#121926] via-[#0E1520] to-[#090D14] flex items-center justify-center p-4">
            
            {/* Cutting Board Grid Texture */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            {/* Visual Cutting Board Frame */}
            <div className="w-[88%] h-[82%] rounded-xl border-2 border-dashed border-emerald-500/30 bg-charcoal/40 relative flex items-center justify-center">
              
              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-emerald-400" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-0.5 bg-emerald-400" />
              </div>

              {/* Cutting board metadata watermark */}
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-400/60 uppercase tracking-wider">
                CAM_01 • BRIGADE_PREP_BOARD • 1080p
              </div>
              <div className="absolute top-2 right-3 text-[10px] font-mono text-textMuted/60">
                STATION: POULTRY & MIREPOIX
              </div>

              {/* Simulated Food Trimmings Illustration Icons */}
              <div className="text-center space-y-1 opacity-90">
                <div className="text-3xl filter drop-shadow-md">
                  {scanPresetIndex === 0 ? '🍗 🦴' : scanPresetIndex === 1 ? '🧅 🥕 🥬' : '🍊 🍋 🌿'}
                </div>
                <div className="text-xs font-mono font-semibold text-emerald-300">
                  {currentPreset.label}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Animated Scanning Laser Sweep */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="w-full h-1 laser-line animate-laser-scan absolute top-0" />
            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
          </div>
        )}

        {/* Neural Bounding Box Overlays */}
        {detections.map((det) => (
          <div
            key={det.id}
            style={{
              left: `${det.bbox.x}%`,
              top: `${det.bbox.y}%`,
              width: `${det.bbox.w}%`,
              height: `${det.bbox.h}%`,
              borderColor: det.color,
            }}
            className="absolute border-2 rounded-lg pointer-events-none z-10 transition-all duration-500 shadow-lg"
          >
            {/* Corner tags */}
            <div
              style={{ backgroundColor: det.color }}
              className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-obsidian flex items-center space-x-1.5 shadow-md whitespace-nowrap"
            >
              <span>{det.label}</span>
              <span className="bg-obsidian/30 text-white px-1 rounded text-[10px]">
                {Math.round(det.confidence * 100)}%
              </span>
            </div>

            {/* Mass estimate badge bottom */}
            <div className="absolute -bottom-5 right-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-obsidian-dark/90 text-emerald-300 border border-emerald-500/40">
              ~{det.estimatedMassKg} kg
            </div>
          </div>
        ))}

        {/* Live HUD Status Pill top-left */}
        <div className="absolute top-3 left-3 z-20 flex items-center space-x-2 bg-obsidian/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-charcoal-light text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-textPrimary font-semibold">OBJECT TRACKING ACTIVE</span>
        </div>

      </div>

      {/* Detections Summary List */}
      <div className="mt-4 flex-1">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-textMuted uppercase tracking-wider font-mono">
            Detected Byproducts ({detections.length} Classes)
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            Total Mass: {totalDetectedMass.toFixed(1)} kg
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {detections.map((det) => (
            <div
              key={det.id}
              className="p-2.5 rounded-xl bg-charcoal/70 border border-charcoal-light flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: det.color }}
                />
                <div>
                  <div className="text-xs font-bold text-white leading-none">{det.label}</div>
                  <div className="text-[10px] text-textMuted font-mono mt-0.5">
                    Confidence: {(det.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400">{det.estimatedMassKg} kg</div>
                <div className="text-[10px] text-textMuted font-mono uppercase">{det.category.replace('_', ' ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Run Scan & Commit to Reservoir */}
      <div className="mt-5 pt-3 border-t border-charcoal-light flex items-center space-x-3">
        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light hover:border-emerald-500/50 transition-all text-xs font-bold disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Analyzing Frame...' : 'Run Vision Scan'}</span>
        </button>

        <button
          onClick={handleCommitScraps}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian font-bold text-xs shadow-glow-emerald transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-obsidian" />
          <span>Commit to Reservoir ({totalDetectedMass.toFixed(1)} kg)</span>
        </button>
      </div>

    </div>
  );
};
