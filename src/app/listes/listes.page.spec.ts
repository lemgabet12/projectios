import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ListesPage } from './listes.page';

describe('ListesPage', () => {
  let component: ListesPage;
  let fixture: ComponentFixture<ListesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
