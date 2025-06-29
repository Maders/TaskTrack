import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreatePage } from './task-create-page';

describe('TaskCreatePage', () => {
  let component: TaskCreatePage;
  let fixture: ComponentFixture<TaskCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
