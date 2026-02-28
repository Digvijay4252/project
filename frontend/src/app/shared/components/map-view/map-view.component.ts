import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

declare const L: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Output() coordinatesChange = new EventEmitter<{ latitude: number; longitude: number }>();
  @Input() latitude = 0;
  @Input() longitude = 0;
  private map: any;
  private marker: any;
  openMapUrl = '';
  private suppressEmit = false;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const startLat = this.getSafeNumber(this.latitude, 20.5937);
    const startLng = this.getSafeNumber(this.longitude, 78.9629);
    this.map = L.map(this.mapContainer.nativeElement, { zoomControl: true }).setView([startLat, startLng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([startLat, startLng], { draggable: true }).addTo(this.map);
    this.updateOpenMapUrl(startLat, startLng);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      const latitude = Number(position.lat.toFixed(6));
      const longitude = Number(position.lng.toFixed(6));
      this.updateOpenMapUrl(latitude, longitude);
    });

    this.map.on('click', (e: any) => {
      const latitude = Number(e.latlng.lat.toFixed(6));
      const longitude = Number(e.latlng.lng.toFixed(6));
      this.marker.setLatLng([latitude, longitude]);
      this.updateOpenMapUrl(latitude, longitude);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !this.marker) {
      return;
    }

    const latChanged = !!changes['latitude'];
    const lngChanged = !!changes['longitude'];
    if (!latChanged && !lngChanged) {
      return;
    }

    const lat = this.getSafeNumber(this.latitude, this.marker.getLatLng().lat);
    const lng = this.getSafeNumber(this.longitude, this.marker.getLatLng().lng);
    const current = this.marker.getLatLng();
    if (Number(current.lat.toFixed(6)) === Number(lat.toFixed(6)) && Number(current.lng.toFixed(6)) === Number(lng.toFixed(6))) {
      return;
    }

    this.suppressEmit = true;
    this.marker.setLatLng([lat, lng]);
    this.map.panTo([lat, lng], { animate: true });
    this.updateOpenMapUrl(lat, lng);
    this.suppressEmit = false;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private getSafeNumber(value: unknown, fallback: number): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  private updateOpenMapUrl(latitude: number, longitude: number): void {
    this.openMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
    if (!this.suppressEmit) {
      this.coordinatesChange.emit({ latitude, longitude });
    }
  }
}
