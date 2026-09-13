import { useEffect, useState } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapViewport({ safeZone, lastKnownLocation, expanded }) {
  const map = useMap();

  useEffect(() => {
    const bounds = [
      [safeZone.latitude, safeZone.longitude],
      [lastKnownLocation.latitude, lastKnownLocation.longitude],
    ];
    map.fitBounds(bounds, { padding: expanded ? [64, 430] : [32, 32], maxZoom: 15 });
  }, [map, safeZone.latitude, safeZone.longitude, lastKnownLocation.latitude, lastKnownLocation.longitude, expanded]);

  return null;
}

function EmergencyAlertMap({ alert }) {
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const safeZonePosition = [alert.safeZone.latitude, alert.safeZone.longitude];
  const lastKnownPosition = [
    alert.lastKnownLocation.latitude,
    alert.lastKnownLocation.longitude,
  ];

  return (
    <div className={`emergency-map-wrap ${isExpanded ? "is-expanded" : ""}`}>
      <div className="emergency-navigation-bar">
        <div>
          <strong>{alert.status === "resolved" ? "Patient reached the safe zone" : navigationStarted ? "Navigation in progress" : "Recovery route ready"}</strong>
          <small>{alert.status === "resolved" ? "The latest patient location is inside the configured safe zone." : `${Math.round(alert.distanceFromSafeZoneMeters)} m remaining to the safe zone`}</small>
        </div>
        <div className="emergency-map-actions">
          <button type="button" className="emergency-expand-map" onClick={() => setIsExpanded(true)}>Expand map</button>
          {alert.status !== "resolved" && <button type="button" onClick={() => setNavigationStarted((started) => !started)}>{navigationStarted ? "Stop navigation" : "Start navigation"}</button>}
        </div>
      </div>
      {isExpanded && <aside className="emergency-route-panel">
        <button type="button" className="emergency-map-close" onClick={() => setIsExpanded(false)} aria-label="Close full-screen map">Close</button>
        <p>RECOVERY NAVIGATION</p>
        <h3>{navigationStarted ? "Navigation in progress" : "Route preview"}</h3>
        <div className="emergency-route-stop start"><span>1</span><div><strong>Start</strong><small>Patient's last known location<br />{lastKnownPosition[0].toFixed(5)}, {lastKnownPosition[1].toFixed(5)}</small></div></div>
        <div className="emergency-route-stop destination"><span>2</span><div><strong>Destination</strong><small>Configured safe zone<br />{safeZonePosition[0].toFixed(5)}, {safeZonePosition[1].toFixed(5)}</small></div></div>
        <div className="emergency-route-distance">{alert.status === "resolved" ? "Patient is inside the safe zone" : `${Math.round(alert.distanceFromSafeZoneMeters)} m to destination`}</div>
      </aside>}
      <MapContainer
        key={isExpanded ? "expanded-map" : "embedded-map"}
        className="emergency-alert-map"
        center={safeZonePosition}
        zoom={14}
        scrollWheelZoom={false}
        aria-label="Map from the patient's safe zone to last known location"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={safeZonePosition}
          radius={alert.safeZone.radiusMeters}
          pathOptions={{ color: "#3d9451", fillColor: "#79ba83", fillOpacity: 0.2 }}
        />
        <CircleMarker center={safeZonePosition} radius={8} pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#25803b", fillOpacity: 1 }}>
          <Tooltip direction="top" offset={[0, -8]} permanent>Destination: safe zone</Tooltip>
        </CircleMarker>
        <Polyline positions={[safeZonePosition, lastKnownPosition]} pathOptions={{ color: "#b64a43", weight: 4, dashArray: "8 8" }} />
        <CircleMarker center={lastKnownPosition} radius={9} pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#c84840", fillOpacity: 1 }}>
          <Tooltip direction="top" offset={[0, -8]} permanent>Start: patient location</Tooltip>
        </CircleMarker>
        <MapViewport safeZone={alert.safeZone} lastKnownLocation={alert.lastKnownLocation} expanded={isExpanded} />
      </MapContainer>
      <div className="emergency-map-legend"><span><i className="safe" />Safe zone</span><span><i className="last-known" />Last known location</span></div>
    </div>
  );
}

export default EmergencyAlertMap;
