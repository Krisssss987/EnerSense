import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAnalysisComponent } from './quick-analysis.component';

describe('QuickAnalysisComponent', () => {
  let component: QuickAnalysisComponent;
  let fixture: ComponentFixture<QuickAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
