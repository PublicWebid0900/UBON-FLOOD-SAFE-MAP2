import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RiskPoint, SurveillanceZone, RiskPinCategory, RiskLevel } from '../types';
import { 
  Zap, AlertTriangle, Shield, Heart, Home, Phone, 
  MapPin, Clock, Calendar, CheckCircle, Navigation,
  Layers, Eye, ExternalLink, X
} from 'lucide-react';

interface RiskMapProps {
  riskPoints: RiskPoint[];
  surveillanceZones: SurveillanceZone[];
  activeWaterLevel: number;
  onSelectPoint?: (point: RiskPoint) => void;
  onPickCoordinate?: (coords: { lat: number; lng: number }) => void;
  isPickingLocation?: boolean;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  riskPoints,
  surveillanceZones,
  activeWaterLevel,
  onSelectPoint,
  onPickCoordinate,
  isPickingLocation = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<RiskPoint | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('all');
  const [showSurveillanceZones, setShowSurveillanceZones] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Hat Suan Ya community (15.1925, 104.8645)
    const map = L.map(mapContainerRef.current, {
      center: [15.1928, 104.8645],
      zoom: 16,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap Standard Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | UBON FLOOD SAFE MAP',
      maxZoom: 19,
    }).addTo(map);

    // Marker Layer Group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Zones Layer Group
    const zonesLayer = L.layerGroup().addTo(map);
    zonesLayerRef.current = zonesLayer;

    // Handle map click for reporting
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isPickingLocation && onPickCoordinate) {
        onPickCoordinate({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isPickingLocation, onPickCoordinate]);

  // Color generator adhering to the official 8 color codes from PDF page 4
  const getMarkerPinConfig = (category: RiskPinCategory, isTriggeredByWater: boolean) => {
    switch (category) {
      case 'bedridden': // สีน้ำเงิน คือ จุดผู้ป่วยติดเตียง
        return {
          bgColor: '#2563eb', // Blue
          textColor: '#ffffff',
          symbol: '🛌',
          label: 'ผู้ป่วยติดเตียง',
          pulse: isTriggeredByWater
        };
      case 'flood_zone': // สีแดง คือ จุดโซนน้ำท่วมก่อน (จุดอันตรายรถห้ามผ่าน)
        return {
          bgColor: '#dc2626', // Red
          textColor: '#ffffff',
          symbol: '⛔',
          label: 'จุดน้ำท่วมก่อน (รถห้ามผ่าน)',
          pulse: true
        };
      case 'pu_ta_shrine': // สีม่วง คือ ศาลปู่ตา
        return {
          bgColor: '#9333ea', // Purple
          textColor: '#ffffff',
          symbol: '⛩️',
          label: 'ศาลปู่ตา',
          pulse: false
        };
      case 'community_hall': // สีชมพู คือ ศาลาชุมชน
        return {
          bgColor: '#db2777', // Pink
          textColor: '#ffffff',
          symbol: '📢',
          label: 'ศาลาชุมชน',
          pulse: false
        };
      case 'elderly': // สีส้ม คือ จุดมีผู้สูงอายุ
        return {
          bgColor: '#ea580c', // Orange
          textColor: '#ffffff',
          symbol: '👴',
          label: 'ผู้สูงอายุ',
          pulse: isTriggeredByWater
        };
      case 'disabled': // สีเขียว คือ จุดมีผู้พิการ
        return {
          bgColor: '#16a34a', // Green
          textColor: '#ffffff',
          symbol: '♿',
          label: 'ผู้พิการ',
          pulse: isTriggeredByWater
        };
      case 'children': // สีเขียวอ่อน คือ จุดมีเด็ก
        return {
          bgColor: '#84cc16', // Light Green / Lime
          textColor: '#1f2937',
          symbol: '👶',
          label: 'จุดมีเด็กเล็ก',
          pulse: isTriggeredByWater
        };
      case 'electric_hazard': // สีฟ้า คือ จุดที่เคยมีไฟรั่ว
        return {
          bgColor: '#0284c7', // Sky Blue / Cyan
          textColor: '#ffffff',
          symbol: '⚡',
          label: 'เสี่ยงไฟฟ้ารั่ว',
          pulse: true
        };
      case 'shelter': // จุดพักพิงและจุดช่วยเหลือ
        return {
          bgColor: '#0d9488', // Teal
          textColor: '#ffffff',
          symbol: '⛺',
          label: 'ศูนย์พักพิง',
          pulse: false
        };
      case 'authority': // จุดประสานงานเจ้าหน้าที่
        return {
          bgColor: '#4f46e5', // Indigo
          textColor: '#ffffff',
          symbol: '🛡️',
          label: 'จุดประสานงาน',
          pulse: false
        };
      case 'road_closure': // จุดถนนที่ควรหลีกเลี่ยง
        return {
          bgColor: '#b91c1c', // Dark Red
          textColor: '#ffffff',
          symbol: '🚧',
          label: 'ถนนควรหลีกเลี่ยง',
          pulse: true
        };
      default:
        return {
          bgColor: '#475569',
          textColor: '#ffffff',
          symbol: '📍',
          label: 'จุดเสี่ยง',
          pulse: false
        };
    }
  };

  // Render Markers and Surveillance Polygons
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !zonesLayerRef.current) return;

    // Clear previous markers
    markersLayerRef.current.clearLayers();
    zonesLayerRef.current.clearLayers();

    // 1. Render Surveillance Zones (Page 5: 3.4 พื้นที่เฝ้าระวังด้านความปลอดภัย)
    if (showSurveillanceZones) {
      surveillanceZones.forEach(zone => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.code === 'ZONE-A' ? '#dc2626' : zone.code === 'ZONE-B' ? '#d97706' : '#2563eb',
          fillColor: zone.code === 'ZONE-A' ? '#f87171' : zone.code === 'ZONE-B' ? '#fbbf24' : '#60a5fa',
          fillOpacity: 0.22,
          weight: 2,
          dashArray: '4, 4'
        });

        polygon.bindTooltip(`
          <div class="p-1 text-xs">
            <strong class="text-slate-900">${zone.name}</strong><br/>
            <span class="text-slate-600">${zone.riskType}</span>
          </div>
        `, { sticky: true });

        zonesLayerRef.current?.addLayer(polygon);
      });
    }

    // 2. Filter & Render Risk Points
    const filteredPoints = riskPoints.filter(point => {
      // Category filter
      if (activeCategoryFilter === 'electric' && point.category !== 'electric_hazard') return false;
      if (activeCategoryFilter === 'flood' && point.category !== 'flood_zone' && point.category !== 'road_closure') return false;
      if (activeCategoryFilter === 'vulnerable' && !['bedridden', 'elderly', 'disabled', 'children'].includes(point.category)) return false;
      if (activeCategoryFilter === 'shelter' && point.category !== 'shelter') return false;
      if (activeCategoryFilter === 'authority' && point.category !== 'authority') return false;

      // Risk level filter
      if (activeRiskFilter !== 'all' && point.riskLevel !== activeRiskFilter) return false;

      return true;
    });

    filteredPoints.forEach(point => {
      // Check if dynamically triggered by current simulated water level
      const isWaterTriggered = Boolean(point.minWaterLevelTrigger && activeWaterLevel >= point.minWaterLevelTrigger);
      const config = getMarkerPinConfig(point.category, isWaterTriggered);

      // Create Custom HTML Pin
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="custom-pin ${config.pulse ? 'custom-pin-pulse' : ''}" 
               style="background-color: ${config.bgColor}; color: ${config.textColor}; width: 34px; height: 34px; font-size: 15px;">
            <span>${config.symbol}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(point);
        if (onSelectPoint) onSelectPoint(point);
      });

      marker.bindTooltip(`
        <div class="text-xs font-sans">
          <div class="font-bold text-slate-900">${point.name}</div>
          <div class="text-slate-500">${point.categoryLabel}</div>
        </div>
      `, { direction: 'top', offset: [0, -18] });

      markersLayerRef.current?.addLayer(marker);
    });

  }, [riskPoints, surveillanceZones, activeCategoryFilter, activeRiskFilter, showSurveillanceZones, activeWaterLevel, onSelectPoint]);

  const handleFlyTo = (lat: number, lng: number) => {
    mapInstanceRef.current?.flyTo([lat, lng], 17, { duration: 1.2 });
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([15.1928, 104.8645], 16, { duration: 1.0 });
  };

  return (
    <div id="map" className="relative w-full h-[650px] lg:h-[720px] bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Picking Location Banner (if active) */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md text-xs sm:text-sm font-medium flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4" />
          <span>คลิกบนแผนที่เพื่อระบุตำแหน่งจุดเสี่ยงที่ต้องการแจ้ง</span>
        </div>
      )}

      {/* Top Controls Overlay: Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Category Segmented Filters */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-lg p-1 shadow-sm flex flex-wrap items-center gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'flood', label: 'น้ำท่วม / ทางเลี่ยง' },
            { id: 'electric', label: 'เสี่ยงไฟฟ้า (สีฟ้า)' },
            { id: 'vulnerable', label: 'กลุ่มเปราะบาง (4 กลุ่ม)' },
            { id: 'shelter', label: 'จุดพักพิง' },
            { id: 'authority', label: 'จุดประสานงาน' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeCategoryFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Map Utility Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowSurveillanceZones(!showSurveillanceZones)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              showSurveillanceZones
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>โซนเฝ้าระวัง (A/B/C)</span>
          </button>

          <button
            onClick={handleResetView}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            รีเซ็ตมุมมอง
          </button>
        </div>
      </div>

      {/* Official 8-Color Legend Panel (Page 4) */}
      <div className="absolute bottom-6 left-4 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-md max-w-xs sm:max-w-sm hidden sm:block">
        <div className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
          <span>สัญลักษณ์ระบุจุดเสี่ยงชุมชน (8 สีมาตรฐาน)</span>
          <span className="text-[10px] text-slate-500 font-normal">หาดสวนยา</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
            <span>จุดผู้ป่วยติดเตียง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
            <span>จุดน้ำท่วมก่อน (รถห้ามผ่าน)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0"></span>
            <span>ศาลปู่ตา</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-600 shrink-0"></span>
            <span>ศาลาชุมชน</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-600 shrink-0"></span>
            <span>จุดมีผู้สูงอายุ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-600 shrink-0"></span>
            <span>จุดมีผู้พิการ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-lime-500 shrink-0"></span>
            <span>จุดมีเด็กเล็ก</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0"></span>
            <span>จุดที่เคยมีไฟรั่ว</span>
          </div>
        </div>
      </div>

      {/* Selected Point Inspection Drawer / Card */}
      {selectedPoint && (
        <div className="absolute top-18 right-4 z-20 w-84 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-right duration-200">
          {/* Card Header */}
          <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2 bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-medium text-slate-700">{selectedPoint.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {selectedPoint.riskLevel === 'high' ? 'ความเสี่ยงสูง' : selectedPoint.riskLevel === 'medium' ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงต่ำ'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {selectedPoint.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Preview if available */}
          {selectedPoint.imageUrl && (
            <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
              <img 
                src={selectedPoint.imageUrl} 
                alt={selectedPoint.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] rounded">
                ภาพถ่ายภาคสนามชุมชน
              </div>
            </div>
          )}

          {/* Card Body */}
          <div className="p-4 space-y-3 text-xs max-h-[380px] overflow-y-auto">
            {/* Electrical hazard mandatory warning banner (from document Page 5) */}
            {selectedPoint.category === 'electric_hazard' && selectedPoint.warning && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <Zap className="w-4 h-4 text-amber-600" />
                  คำเตือนความปลอดภัยระบบไฟฟ้า
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedPoint.warning}
                </p>
              </div>
            )}

            {/* General warning if present and not electric */}
            {selectedPoint.category !== 'electric_hazard' && selectedPoint.warning && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ข้อควรระวัง / คำเตือน
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedPoint.warning}
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="text-slate-400 font-medium mb-0.5">ลักษณะข้อมูล / ความเสี่ยง:</div>
              <p className="text-slate-700 leading-relaxed">
                {selectedPoint.description}
              </p>
            </div>

            {/* Travel Advice */}
            {selectedPoint.travelAdvice && (
              <div>
                <div className="text-slate-400 font-medium mb-0.5">ข้อแนะนำในการเดินทาง:</div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedPoint.travelAdvice}
                </p>
              </div>
            )}

            {/* Facilities if shelter */}
            {selectedPoint.facilities && selectedPoint.facilities.length > 0 && (
              <div>
                <div className="text-slate-400 font-medium mb-1">สิ่งอำนวยความสะดวก:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPoint.facilities.map((fac, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata attributes */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedPoint.addressOrZone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>หน่วยงานรับผิดชอบ: {selectedPoint.responsibleOrg}</span>
              </div>
              {selectedPoint.contact && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>เบอร์ติดต่อ: {selectedPoint.contact}</span>
                </div>
              )}
              {selectedPoint.operatingHours && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>เวลาทำการ: {selectedPoint.operatingHours}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>วันที่สำรวจ: {selectedPoint.surveyDate}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => handleFlyTo(selectedPoint.lat, selectedPoint.lng)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              โฟกัสจุดนี้
            </button>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>ยืนยันข้อมูลแล้ว</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
