import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChiffrePage } from './chiffre.page';

describe('ChiffrePage', () => {
  let component: ChiffrePage;
  let fixture: ComponentFixture<ChiffrePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChiffrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
