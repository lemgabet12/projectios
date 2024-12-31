import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DeteilrecapPage } from './deteilrecap.page';

describe('DeteilrecapPage', () => {
  let component: DeteilrecapPage;
  let fixture: ComponentFixture<DeteilrecapPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeteilrecapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
