import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoList } from './veiculo-list';

describe('VeiculoList', () => {
  let component: VeiculoList;
  let fixture: ComponentFixture<VeiculoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculoList],
    }).compileComponents();

    fixture = TestBed.createComponent(VeiculoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
