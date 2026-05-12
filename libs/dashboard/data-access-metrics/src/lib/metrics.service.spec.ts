import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(MetricsService);
  });

  it('initialises with empty state', () => {
    expect(service.cards()).toEqual([]);
    expect(service.activity()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('loadDashboard populates 4 metric cards', () => {
    service.loadDashboard();
    expect(service.cards().length).toBe(4);
  });

  it('loadDashboard populates 10 000 activity rows', () => {
    service.loadDashboard();
    expect(service.activity().length).toBe(10_000);
  });

  it('loadDashboard sets loading to false after completion', () => {
    service.loadDashboard();
    expect(service.loading()).toBe(false);
  });

  it('loadDashboard clears error', () => {
    service.loadDashboard();
    expect(service.error()).toBeNull();
  });

  it('each metric card has required fields', () => {
    service.loadDashboard();
    for (const card of service.cards()) {
      expect(card.id).toBeTruthy();
      expect(card.label).toBeTruthy();
      expect(typeof card.value).toBe('number');
      expect(['up', 'down', 'flat']).toContain(card.trendDirection);
    }
  });

  it('each activity row has correct status values', () => {
    service.loadDashboard();
    for (const row of service.activity().slice(0, 100)) {
      expect(['success', 'warning', 'error']).toContain(row.status);
    }
  });

  it('refreshCards updates card values', () => {
    service.loadDashboard();
    const before = service.cards()[0].value;
    service.refreshCards();
    const after = service.cards()[0].value;
    expect(after).not.toBe(before);
  });

  it('activity rows have sequential ids starting at 1', () => {
    service.loadDashboard();
    expect(service.activity()[0].id).toBe(1);
    expect(service.activity()[9999].id).toBe(10_000);
  });
});
