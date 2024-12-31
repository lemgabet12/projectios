import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DeteilagencePage } from './deteilagence.page';

describe('DeteilagencePage', () => {
  let component: DeteilagencePage;
  let fixture: ComponentFixture<DeteilagencePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeteilagencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
