import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListPage } from './task-list-page';

describe('TaskListPage', () => {
  let component: TaskListPage;
  let fixture: ComponentFixture<TaskListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
