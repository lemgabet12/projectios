import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArrivalsDeparturesPage } from './arrivals-departures.page';

describe('ArrivalsDeparturesPage', () => {
  let component: ArrivalsDeparturesPage;
  let fixture: ComponentFixture<ArrivalsDeparturesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ArrivalsDeparturesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
