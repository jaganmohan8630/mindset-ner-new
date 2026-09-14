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
import { getUIText } from "../uiTranslations";

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

function EmergencyAlertMap({ alert, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const formatText = (key, values) => Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    t(key),
  );
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
          <strong>{alert.status === "resolved" ? t("patientReachedSafeZone") : navigationStarted ? t("navigationInProgress") : t("recoveryRouteReady")}</strong>
          <small>{alert.status === "resolved" ? t("latestLocationInsideSafeZone") : formatText("distanceRemainingToSafeZone", { distance: Math.round(alert.distanceFromSafeZoneMeters) })}</small>
        </div>
        <div className="emergency-map-actions">
          <button type="button" className="emergency-expand-map" onClick={() => setIsExpanded(true)}>{t("expandMap")}</button>
          {alert.status !== "resolved" && <button type="button" onClick={() => setNavigationStarted((started) => !started)}>{navigationStarted ? t("stopNavigation") : t("startNavigation")}</button>}
        </div>
      </div>
      {isExpanded && <aside className="emergency-route-panel">
        <button type="button" className="emergency-map-close" onClick={() => setIsExpanded(false)} aria-label={t("closeFullScreenMap")}>{t("close")}</button>
        <p>{t("recoveryNavigation").toUpperCase()}</p>
        <h3>{navigationStarted ? t("navigationInProgress") : t("routePreview")}</h3>
        <div className="emergency-route-stop start"><span>1</span><div><strong>{t("start")}</strong><small>{t("patientLastKnownLocation")}<br />{lastKnownPosition[0].toFixed(5)}, {lastKnownPosition[1].toFixed(5)}</small></div></div>
        <div className="emergency-route-stop destination"><span>2</span><div><strong>{t("destination")}</strong><small>{t("configuredSafeZone")}<br />{safeZonePosition[0].toFixed(5)}, {safeZonePosition[1].toFixed(5)}</small></div></div>
        <div className="emergency-route-distance">{alert.status === "resolved" ? t("patientInsideSafeZone") : formatText("distanceToDestination", { distance: Math.round(alert.distanceFromSafeZoneMeters) })}</div>
      </aside>}
      <MapContainer
        key={isExpanded ? "expanded-map" : "embedded-map"}
        className="emergency-alert-map"
        center={safeZonePosition}
        zoom={14}
        scrollWheelZoom={false}
        aria-label={t("mapSafeZoneToLastKnownLocation")}
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
          <Tooltip direction="top" offset={[0, -8]} permanent>{t("destinationSafeZone")}</Tooltip>
        </CircleMarker>
        <Polyline positions={[safeZonePosition, lastKnownPosition]} pathOptions={{ color: "#b64a43", weight: 4, dashArray: "8 8" }} />
        <CircleMarker center={lastKnownPosition} radius={9} pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#c84840", fillOpacity: 1 }}>
          <Tooltip direction="top" offset={[0, -8]} permanent>{t("startPatientLocation")}</Tooltip>
        </CircleMarker>
        <MapViewport safeZone={alert.safeZone} lastKnownLocation={alert.lastKnownLocation} expanded={isExpanded} />
      </MapContainer>
      <div className="emergency-map-legend"><span><i className="safe" />{t("safeZone")}</span><span><i className="last-known" />{t("lastKnown")}</span></div>
    </div>
  );
}

export default EmergencyAlertMap;
