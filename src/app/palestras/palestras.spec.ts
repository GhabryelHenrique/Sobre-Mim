import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Palestras } from './palestras';

describe('Palestras', () => {
  let component: Palestras;
  let fixture: ComponentFixture<Palestras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Palestras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Palestras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
