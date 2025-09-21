import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationTabComponent } from './notification-tab.component';
import { ComplaintsService } from '../../../core/services/complaints.service';
import { AuthService } from '../../../core/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('NotificationTabComponent', () => {
  let component: NotificationTabComponent;
  let fixture: ComponentFixture<NotificationTabComponent>;
  let complaintsService: jasmine.SpyObj<ComplaintsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const complaintsServiceSpy = jasmine.createSpyObj('ComplaintsService', ['getNewlyEditedComplaintsList']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [NotificationTabComponent, HttpClientTestingModule],
      providers: [
        { provide: ComplaintsService, useValue: complaintsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTabComponent);
    component = fixture.componentInstance;
    complaintsService = TestBed.inject(ComplaintsService) as jasmine.SpyObj<ComplaintsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', () => {
    authService.getUserId.and.returnValue(1);
    complaintsService.getNewlyEditedComplaintsList.and.returnValue(of([]));

    component.ngOnInit();

    expect(authService.getUserId).toHaveBeenCalled();
    expect(complaintsService.getNewlyEditedComplaintsList).toHaveBeenCalledWith(1);
  });

  it('should handle error when user ID is not found', () => {
    authService.getUserId.and.returnValue(null);

    component.ngOnInit();

    expect(component.error).toBe('User ID not found');
  });

  it('should toggle notifications visibility', () => {
    expect(component.showNotifications).toBeFalse();
    
    component.toggleNotifications();
    expect(component.showNotifications).toBeTrue();
    
    component.toggleNotifications();
    expect(component.showNotifications).toBeFalse();
  });

  it('should return correct notification count', () => {
    component.notifications = [
      { timeStamp: '2023-01-01', user: {} as any, status: 'pending', location: 'test', complaintType: 'test', comment: 'test' },
      { timeStamp: '2023-01-02', user: {} as any, status: 'resolved', location: 'test', complaintType: 'test', comment: 'test' }
    ];

    expect(component.getNotificationCount()).toBe(2);
  });
});
