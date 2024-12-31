import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RecaptilatifPage } from './recaptilatif.page';

describe('RecaptilatifPage', () => {
  let component: RecaptilatifPage;
  let fixture: ComponentFixture<RecaptilatifPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecaptilatifPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
