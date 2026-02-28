import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.css']
})
export class StoreSettingsComponent implements OnInit {
  form: any = {
    name: '',
    description: '',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    phone: ''
  };
  message = '';
  locating = false;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getMyStore().subscribe({
      next: (res) => (this.form = res.data),
      error: () => {
        // If seller has no store profile yet, prefill coordinates from current device location.
        this.useCurrentLocation();
      }
    });
  }

  save(): void {
    const payload = {
      ...this.form,
      latitude: Number(this.form.latitude),
      longitude: Number(this.form.longitude)
    };

    if (!Number.isFinite(payload.latitude) || !Number.isFinite(payload.longitude)) {
      this.message = 'Latitude and longitude must be valid numbers.';
      return;
    }

    this.storeService.upsertMyStore(payload).subscribe({
      next: () => (this.message = 'Store profile saved'),
      error: (err) => (this.message = err?.error?.message || 'Failed to save store')
    });
  }

  onMapCoordinatesChange(coords: { latitude: number; longitude: number }): void {
    this.form.latitude = Number(coords.latitude.toFixed(6));
    this.form.longitude = Number(coords.longitude.toFixed(6));
  }

  useCurrentLocation(): void {
    this.message = '';
    if (!navigator.geolocation) {
      this.message = 'Geolocation is not supported in this browser.';
      return;
    }

    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.form.latitude = Number(position.coords.latitude.toFixed(6));
        this.form.longitude = Number(position.coords.longitude.toFixed(6));
        this.locating = false;
        this.message = 'Current location applied. Review and save store profile.';
      },
      (error) => {
        this.locating = false;
        if (error.code === error.PERMISSION_DENIED) {
          this.message = 'Location permission denied.';
          return;
        }
        this.message = 'Failed to fetch current location.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
}
