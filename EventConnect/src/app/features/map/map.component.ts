import { Component, OnInit, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { HeaderComponent } from '../../layout/components/header/header';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, AfterViewInit {
  events: any[] = [];
  selectedEvent: any = null;
  private platformId = inject(PLATFORM_ID);
  private eventService = inject(EventService);
  private map: any;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.eventService.getEvents(1, 100).subscribe({
        next: (res) => {
          this.events = res.data.filter((e: any) => e.latitude && e.longitude);
          if (this.map) this.addMarkers();
        }
      });
    }
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');

      this.map = L.map('map', {
        center: [41.6488, -0.8891],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      if (this.events.length) this.addMarkers();
    }
  }

  async addMarkers() {
    const L = await import('leaflet');
    this.events.forEach(event => {
      const marker = L.marker([event.latitude, event.longitude])
        .addTo(this.map)
        .bindPopup(`<strong>${event.title}</strong><br>${event.locationName}`);

      marker.on('click', () => {
        this.selectedEvent = event;
      });
    });
  }
}